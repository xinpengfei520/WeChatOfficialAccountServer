/**
 * 将数据库中的图片上传到七牛云服务器中
 */

// 上传图片到七牛中方法
const upload = require('./upload');
// 生成唯一的 key 方法
const nanoid = require('nanoid');

module.exports = async (key, Model) => {

    /*
     * 1. 获取数据库中的图片链接
     * 2. 上传到七牛中
     * 3. 保存 key 到数据库中
     */

    // 去数据库中找所有没有上传图片的文档对象
    // const movies = await Model.find({posterKey: {$in: ['', null, {$exists: false}]}});
    const movies = await Model.find({
        $or: [
            {[key]: ''},
            {[key]: null},
            {[key]: {$exists: false}}
        ]
    });

    // 遍历每一条数据
    for (let i = 0; i < movies.length; i++) {
        // 获取每一个文档对象
        let movie = movies[i];

        // 初始化两个值
        let url = movie.image;
        let fileName = '.jpg'; // default file name
        // 上传图片到七牛
        if (key === 'coverKey') {
            url = movie.cover;
        } else if (key === 'videoKey') {
            url = movie.link;
            fileName = '.mp4';
        }

        // 文件名
        fileName = `${nanoid(10)}${fileName}`;

        // 此处必须判断 undefined 防止报：
        // TypeError: First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object
        if (typeof (url) == "undefined") {
            console.log('url undefined!');
        } else {
            await upload(url, fileName);
        }

        // 保存 key 到数据库中
        movie[key] = fileName;

        await movie.save();
    }
};