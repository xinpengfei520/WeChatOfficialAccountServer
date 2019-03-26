/**
 * 七牛云图片 api 接口
 */

// 地址前缀：七牛云图片接口(换成自己的)
const prefix = 'http://image.x-sir.com/';

module.exports = {
    accessToken: `${prefix}token?grant_type=client_credential`,
    ticket: `${prefix}ticket/getticket?type=jsapi`,
    menu: {
        create: `${prefix}menu/create?`,
        delete: `${prefix}menu/delete?`
    },
    temporary: {
        upload: `${prefix}media/upload?`,
        get: `${prefix}media/get?`
    },
    permanment: {
        uploadNews: `${prefix}material/add_news?`,
        uploadImg: `${prefix}media/uploadimg?`,
        uploadOthers: `${prefix}material/add_material?`,
        get: `${prefix}material/get_material?`
    }
};

