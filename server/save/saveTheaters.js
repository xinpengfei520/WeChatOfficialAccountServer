// 引入Theaters
const Theaters = require('../../model/Theaters');

module.exports = async data => {

    for (var i = 0; i < data.length; i++) {
        let item = data[i];

        // MongoError: E11000 duplicate key error collection
        // 先通过 doubanId 查询是否已经存在，如果存在说明存过，如果不存在，然后再存入数据库中
        const movie = await Theaters.find({doubanId: item.doubanId});

        if (!movie.length) {
            await Theaters.create({
                title: item.title,
                rating: item.rating,
                runtime: item.runtime,
                directors: item.directors,
                casts: item.casts,
                image: item.image,
                doubanId: item.doubanId,
                genre: item.genre,
                summary: item.summary,
                releaseDate: item.releaseDate,
            });

            console.log('Theaters 数据保存成功~');

        } else {
            console.log('Theaters 中已存在 doubanId：' + item.doubanId);
        }
    }
};