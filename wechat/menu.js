/**
 * 自定义公众号聊天框底部菜单
 */

const {url} = require('../config');

module.exports = {
    "button": [
        {
            "type": "view",
            "name": "Video",
            "url": `${url}/movie`
        },
        {
            "type": "view",
            "name": "语音识别",
            "url": `${url}/search`
        },
        {
            "name": "关于",
            "sub_button": [
                {
                    "type": "view",
                    "name": "个人网站",
                    "url": "http://www.x-sir.com"
                },
                {
                    "type": "click",
                    "name": "帮助",
                    "key": "help"
                }
            ]
        }
    ]
};