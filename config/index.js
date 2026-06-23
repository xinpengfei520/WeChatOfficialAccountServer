// 加载 .env 中的环境变量
require('dotenv').config();

// 配置对象模块(将配置信息暴露出去)
module.exports = {
    // 微信公众号后台配置的 token
    token: process.env.WECHAT_TOKEN,
    // 微信公众号的 appId
    appId: process.env.WECHAT_APP_ID,
    // 微信公众号的 appSecret
    appSecret: process.env.WECHAT_APP_SECRET,
    // 服务器外网 ip
    url: process.env.SERVER_URL
};
