/**
 * 将爬取的图片上传到七牛云
 */

// 加载 .env 中的环境变量
require('dotenv').config();
// 引入 qiniu 模块
const qiniu = require('qiniu');

// accessKey & secretKey 从环境变量读取
const accessKey = process.env.QINIU_ACCESS_KEY;
const secretKey = process.env.QINIU_SECRET_KEY;

// 定义鉴权对象
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
// 定义配置对象
const config = new qiniu.conf.Config();
// 存储区域   z0 -- 华东
config.zone = qiniu.zone.Zone_z0;
// bucketManager 对象上就有所有的方法
const bucketManager = new qiniu.rs.BucketManager(mac, config);
// 存储空间的名称(换为自己在七牛上建的存储空间的名称)
const bucket = process.env.QINIU_BUCKET || 'wechat';

module.exports = (resUrl, key) => {
    /*
     * resUrl  网络资源的地址
     * bucket  存储空间的名称 students
     * key     重命名网络资源的名称
     */
    return new Promise((resolve, reject) => {
        bucketManager.fetch(resUrl, bucket, key, function (err, respBody, respInfo) {
            if (err) {
                reject('上传七牛云的方法出了问题！' + err);
            } else {
                if (respInfo.statusCode === 200) {
                    console.log('七牛云文件上传成功~');
                    resolve();
                }
            }
        });
    })
};