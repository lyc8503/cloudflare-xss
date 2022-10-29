## Cloudflare XSS
本项目仅供学习交流使用, 请勿用于非法用处!

#### 简介
基于 Cloudflare Workers 和 KV 存储的 Serverless XSS 平台 (～￣▽￣)～

#### 部署
1. 准备一个 Cloudflare 账号以及一个域名(可使用免费的 freenom / euorg 域名)
2. 创建 Cloudflare Workers, 将域名指向 Worker
3. 在 Workers KV 中创建 Namespace, 在 Worker - Settings - Variables 下的 KV Namespace Bindings 创建 Binding, Name 填写 `kv_storage`, Namespace 选择刚创建的 Namespace.
4. 编辑 Worker 代码, 将 `compiled.js` 中的内容全部复制替换原有的样例代码, 保存.
5. 修改第一行的变量 KEY, 修改为一个随机字符串.
6. 部署完成!

#### 使用
1. 默认访问 `https://www.example.com/icon.js` 可以得到默认的 script payload, 此 payload 会收集用户 Cookie, LocalStorage, 屏幕截图等信息. (Payload 来源: https://github.com/mazen160/xless/blob/master/payload.js)
2. 访问 `https://www.example.com/<你设置的KEY>` 可以进入后台管理界面
3. 管理界面上可以上传自定义文件, 可以自定义 JS, JS 只需要发送 POST 请求到 `https://www.example.com` 即可被记录.
4. 所有对页面的请求都会被记录, 可以上传自定义的图片后将链接插入公开网站, 获得访问者的 IP 和 UA 等信息.
