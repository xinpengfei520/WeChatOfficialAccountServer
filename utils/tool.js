/**
 * 工具函数包
 */

// 引入 xml2js，将 xml 数据转化成 js 对象
const {parseString} = require('xml2js');
// 引入 fs 模块
const {writeFile, readFile} = require('fs');
// 引入 path 模块
const {resolve} = require('path');

module.exports = {
    /**
     * 获取用户数据的异步方法
     * @param req 请求的内容
     * @returns {Promise<any>}
     */
    getUserDataAsync(req) {
        return new Promise((resolve, reject) => {
            let xmlData = '';
            req
                .on('data', data => {
                    console.log(data.toString());
                    // 当流式数据传递过来时，会触发当前事件，会将数据注入到回调函数中
                    // 读取的数据是 buffer，需要将其转化成字符串
                    xmlData += data.toString();
                })
                .on('end', () => {
                    console.log('end');
                    // 当数据接收完毕时，会触发 end 回调方法
                    resolve(xmlData);
                })
        })
    },
    /**
     * 解析 XML 数据的异步方法
     * @param xmlData xml 数据
     * @returns {Promise<any>}
     */
    parseXMLAsync(xmlData) {
        return new Promise((resolve, reject) => {
            parseString(xmlData, {trim: true}, (err, data) => {
                if (!err) {
                    resolve(data);
                } else {
                    reject('parseXMLAsync方法出了问题:' + err);
                }
            })
        })
    },
    /**
     * 格式化 js 数据，因为解析出来的数据不是我们想要的，所以我们将其进行格式化转换
     * @param jsData
     */
    formatMessage(jsData) {
        let message = {};
        // 获取 xml 对象
        jsData = jsData.xml;
        // 判断数据是否是一个对象
        if (typeof jsData === 'object') {
            // 遍历对象
            for (let key in jsData) {
                // 获取属性值
                let value = jsData[key];
                // 过滤掉空的数据
                if (Array.isArray(value) && value.length > 0) {
                    // 将合法的数据赋值到 message 对象上
                    message[key] = value[0];
                }
            }
        }

        return message;
    },
    /**
     * 异步写入文件
     * @param data
     * @param fileName
     * @returns {Promise<any>}
     */
    writeFileAsync(data, fileName) {
        // 将对象转化 json 字符串
        data = JSON.stringify(data);
        // 调用 path 模块中的 resolve 方法来获取文件的绝对路径
        const filePath = resolve(__dirname, fileName);
        return new Promise((resolve, reject) => {
            writeFile(filePath, data, err => {
                if (!err) {
                    console.log('文件保存成功~');
                    resolve();
                } else {
                    reject('writeFileAsync方法出了问题：' + err);
                }
            })
        })
    },
    /**
     * 异步读取文件
     * @param fileName
     * @returns {Promise<any>}
     */
    readFileAsync(fileName) {
        // 调用 path 模块中的 resolve 方法来获取文件的绝对路径
        const filePath = resolve(__dirname, fileName);
        return new Promise((resolve, reject) => {
            readFile(filePath, (err, data) => {
                if (!err) {
                    console.log('文件读取成功~');
                    // 将 json 字符串转化 js 对象
                    data = JSON.parse(data);
                    resolve(data);
                } else {
                    reject('readFileAsync方法出了问题：' + err);
                }
            })
        })
    }
};