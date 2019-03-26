/**
 * 豆瓣 api 接口
 */

// 地址前缀
const prefix = 'https://api.douban.com/';

module.exports = {
    search: `${prefix}v2/movie/search`,
    // 搜索用户输入指定电影信息
    //https://api.douban.com/v2/movie/search?q=${message.Content}&count=8
};

