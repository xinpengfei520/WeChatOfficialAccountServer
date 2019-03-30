// 引入 Trailers
const Trailers = require('../../model/Trailers');

module.exports = async data => {

    for (var i = 0; i < data.length; i++) {
        let item = data[i];

        // MongoError: E11000 duplicate key error collection
        // 先通过 doubanId 查询是否已经存在，如果存在说明存过，如果不存在，然后再存入数据库中
        const movie = await Trailers.find({doubanId: item.doubanId});

        if (!movie.length) {
            await Trailers.create({
                title: item.title,
                rating: item.rating,
                runtime: item.runtime,
                directors: item.directors,
                casts: item.casts,
                image: item.image,
                doubanId: item.doubanId,
                cover: item.cover,
                genre: item.genre,
                summary: item.summary,
                releaseDate: item.releaseDate,
                link: item.link,
            });

            console.log('Trailers 数据保存成功~');

        } else {
            console.log('Trailers 中已存在 doubanId：' + item.doubanId);
        }
    }
};