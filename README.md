# WeChatOfficialAccountServer

> 一个基于 **Node.js / Express** 的微信公众号后端服务：对接微信公众平台的消息与菜单回调，并对外提供一个「电影迷你站」——展示豆瓣热门电影、电影预告片，以及带弹幕的播放页面。

爬取豆瓣电影 / 预告片数据存入 MongoDB，图片与视频转存到七牛云，用户可以在公众号里通过**关键字**、**语音**或**底部菜单**查询电影信息，并在内嵌网页中观看预告片、发送弹幕。

---

## ✨ 功能特性

- **微信服务器接入**：GET 请求校验服务器有效性（sha1 签名），POST 请求接收并自动回复用户消息。
- **智能消息回复**：支持文本、语音、事件（关注/取关/点击/跳转）等多种消息类型。
  - 回复「首页」→ 电影预告片首页图文
  - 回复「热门」→ 数据库中的热门电影图文列表
  - 回复任意「片名」→ 调用豆瓣搜索接口返回匹配电影
  - **发送语音** → 语音识别后按识别文字搜索电影
- **自定义公众号菜单**：一键删除 / 重建底部菜单（视频、语音识别、个人博客、帮助）。
- **JS-SDK 签名**：为网页调用微信 JS-SDK（语音识别等）动态生成 `signature`。
- **电影迷你站**（EJS 服务端渲染）：
  - 预告片列表页、电影详情页、语音搜索页
  - 基于 [DPlayer](https://dplayer.js.org/) 的**弹幕**播放，弹幕数据存入 MongoDB
- **数据管线**：Puppeteer 爬取豆瓣正在热映 / 预告片 → 存入 MongoDB → 图片/视频上传至七牛云。
- **素材管理**：封装微信临时 / 永久素材的上传与下载（图文、图片、视频等）。

---

## 🧱 技术栈

| 分类 | 技术 |
| --- | --- |
| 运行时 | Node.js |
| Web 框架 | Express 4 |
| 模板引擎 | EJS 3（视图位于 `./views`） |
| 数据库 | MongoDB + Mongoose 8 |
| 爬虫 | Puppeteer |
| 对象存储 | 七牛云（qiniu SDK） |
| HTTP 客户端 | axios + form-data |
| 其他 | sha1（签名）、xml2js（解析微信 XML）、nanoid（生成文件名）、dotenv（环境变量） |
| 工程化 | ESLint 10（flat config） |

---

## 📂 目录结构

```
.
├── app.js                  # Web 服务入口：连库 → 挂载路由 → 监听 3000 端口
├── config/                 # 从 .env 读取的配置（token / appId / appSecret / url）
├── cons/                   # 第三方 API 地址常量
│   ├── weChatApi.js        #   微信接口前缀（token / ticket / menu / material）
│   ├── douBanApi.js        #   豆瓣电影搜索接口
│   └── imageApi.js         #   七牛云图片域名
├── db/                     # MongoDB 连接（返回一个 Promise，启动时 await）
├── model/                  # Mongoose 数据模型
│   ├── Theaters.js         #   热门电影
│   ├── Trailers.js         #   电影预告片
│   └── Danmus.js           #   弹幕
├── router/                 # Express 路由（网页 + 弹幕接口 + 微信消息中间件）
├── reply/                  # 微信消息处理
│   ├── index.js            #   服务器校验 + 消息收发主流程
│   ├── reply.js            #   根据消息类型/内容决定回复什么
│   └── template.js         #   将回复对象拼装成微信要求的 XML
├── wechat/                 # 微信 SDK 封装
│   ├── wechat.js           #   Wechat 类：access_token / ticket / 菜单 / 素材
│   └── menu.js             #   自定义菜单结构定义
├── server/                 # 数据管线（手动运行，非 Web 服务）
│   ├── index.js            #   编排：爬取 → 保存 → 上传七牛
│   ├── crawler/            #   Puppeteer 爬虫（theaters / trailers）
│   ├── save/               #   将爬取结果写入 MongoDB
│   └── qiniu/              #   上传图片/视频到七牛云
├── views/                  # EJS 模板（movie / detail / search）
├── utils/                  # 工具函数 + access_token/ticket 本地缓存文件
├── media/                  # 素材上传/下载的本地临时目录
├── eslint.config.js        # ESLint flat config
├── .env.example            # 环境变量模板（复制为 .env 后填真实值）
└── CLAUDE.md               # 面向 Claude Code 的项目说明
```

---

## 🔄 数据流概览

**微信消息链路**（`node app.js`）：

```
微信服务器 ──POST──▶ router ──▶ reply/index.js
                                   │ 解析 XML → formatMessage
                                   ▼
                              reply/reply.js  ──▶ 查 MongoDB / 调豆瓣接口
                                   │
                                   ▼
                              template.js（拼 XML） ──▶ 返回给微信服务器
```

**数据准备链路**（`node server/index.js`，手动运行）：

```
Puppeteer 爬取豆瓣 ──▶ 保存到 MongoDB ──▶ 图片/视频上传七牛云 ──▶ 回写 key 到文档
```

---

## 🚀 快速开始

### 1. 前置条件

- **Node.js**（建议 LTS 版本）与 npm
- **MongoDB**：必须先启动并可连接（默认 `mongodb://localhost:27017/DouBan`）。`app.js` 与数据管线在启动时会 `await` 数据库连接。
- **公网隧道**：微信回调与 JS-SDK 签名都依赖 `SERVER_URL`。用 [ngrok](https://ngrok.com/)（或类似工具）把本地 `3000` 端口暴露到公网，并将该公网地址填入 `SERVER_URL`——它必须与微信实际访问的地址一致。
- **微信公众号**（测试号即可）与**七牛云**账号，用于获取下方所需的密钥。

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制模板并填入真实值：

```bash
cp .env.example .env
```

| 变量 | 说明 |
| --- | --- |
| `WECHAT_TOKEN` | 微信公众平台「服务器配置」中填写的 Token（需与代码一致） |
| `WECHAT_APP_ID` | 公众号 AppID |
| `WECHAT_APP_SECRET` | 公众号 AppSecret |
| `SERVER_URL` | 本服务的公网地址（如 ngrok 地址），微信回调 / JS-SDK 签名使用 |
| `QINIU_ACCESS_KEY` | 七牛云 AccessKey |
| `QINIU_SECRET_KEY` | 七牛云 SecretKey |
| `QINIU_BUCKET` | 七牛云存储空间名（默认 `wechat`） |
| `MONGODB_URI` | MongoDB 连接串（默认 `mongodb://localhost:27017/DouBan`） |

> ⚠️ **安全提示**
> - `.env` 已被 `.gitignore` 忽略，**切勿提交**。新增密钥时，请从 `process.env` 读取，并在 `.env.example` 补一行占位符。
> - 项目早期 git 历史中曾提交过真实密钥，这些密钥已视为**泄露**，请到微信公众平台与七牛云控制台**重新生成 / 轮换**，不要继续使用。

### 4. 启动 Web 服务

```bash
node app.js
```

服务会先连接 MongoDB，再挂载路由并监听 **3000** 端口。随后在微信公众平台「服务器配置」中填入 `SERVER_URL` 与 `WECHAT_TOKEN` 完成接入验证。

---

## ▶️ 三个运行入口

本项目有三个**独立**的可执行入口，用途不同：

| 命令 | 作用 | 副作用 |
| --- | --- | --- |
| `node app.js` | 启动 Web + 微信回调服务（端口 3000） | 无 |
| `node server/index.js` | 一次性数据管线：爬取影院/预告片 → 存 MongoDB → 上传七牛 | 写数据库、上传七牛（**手动运行**，未做定时调度） |
| `node wechat/wechat.js` | 文件底部的 IIFE 会**删除并重建**微信自定义菜单，并运行素材上传测试 | ⚠️ **有副作用**：会改动线上菜单、发起网络请求，仅在确实要（重新）配置菜单时运行 |

---

## 🌐 Web 路由

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/movie` | 预告片列表页（EJS 渲染 `movie.ejs`） |
| `GET` | `/detail/:id` | 电影详情页，`:id` 为豆瓣 ID（渲染 `detail.ejs`） |
| `GET` | `/search` | 语音搜索页，服务端生成 JS-SDK 签名后渲染 `search.ejs` |
| `GET` | `/v3?id=<doubanId>` | 获取某部电影的弹幕列表（DPlayer 弹幕接口） |
| `POST` | `/v3` | 提交一条弹幕（流式 body，存入 `Danmus`） |
| `GET`/`POST` | `/*`（其余） | 交由微信消息中间件处理（服务器校验 + 消息收发） |

---

## 💬 公众号交互（关键字）

用户在公众号对话框中：

| 输入 | 回复 |
| --- | --- |
| `首页` | 电影预告片首页图文卡片，点击进入 `/movie` |
| `热门` | 数据库中热门电影图文列表，点击进入 `/detail/:doubanId` |
| 其他文本（片名） | 调用豆瓣搜索接口，返回最多 8 条匹配电影 |
| 语音消息 | 微信语音识别后，按识别文字搜索电影 |
| 关注 / 点击菜单「帮助」 | 返回功能引导文案 |

底部菜单（见 `wechat/menu.js`）：**Video**（跳转 `/movie`）、**语音识别**（跳转 `/search`）、**关于**（个人博客 / 帮助）。

---

## 🗃️ 数据模型（Mongoose）

- **Theaters（热门电影）**：`title`、`rating`、`directors`、`casts`、`image`、`doubanId`(unique)、`genre`、`summary`、`releaseDate`、`posterKey`（七牛 key）等。
- **Trailers（预告片）**：在 Theaters 字段基础上增加 `cover`、`link`、`coverKey`、`videoKey`——分别对应封面图与视频在七牛的 key。
- **Danmus（弹幕）**：`doubanId`、`author`、`time`、`text`、`color`、`type`。

---

## 🛠️ 数据管线细节

`node server/index.js` 依次执行：

1. `theatersCrawler()` — Puppeteer 无头浏览器爬取豆瓣「正在热映」（北京）前 8 条 → `saveTheaters()` 入库 → 海报上传七牛（`posterKey`）。
2. `trailersCrawler()` — 爬取预告片数据 → `saveTrailers()` 入库 → 分别上传海报 / 封面 / 视频（`posterKey` / `coverKey` / `videoKey`）。

上传时用 `nanoid` 生成唯一文件名，上传成功后把 key 回写到对应文档。数据库中已有 key 的文档会被跳过，因此可重复运行以增量补齐。

---

## 🧑‍💻 开发

```bash
npm run lint       # ESLint 检查
npm run lint:fix   # 自动修复
```

> `npm test` 目前仅是占位脚本（会直接报错），项目暂无测试。

**约定**：

- 模板引擎为 **EJS**，视图在 `./views`。
- 第三方 API 地址常量集中在 `cons/`，数据模型集中在 `model/`。
- 所有密钥统一通过 `dotenv` 从 `.env` 读取，代码中**不硬编码任何密钥**。

---

## 📄 License

[Apache License 2.0](./LICENSE)
