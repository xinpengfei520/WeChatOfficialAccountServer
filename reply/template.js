/**
 * 用来加工处理最终回复给用户消息的模板（xml数据）
 * 注意：xml 数据中不能有多余的空格，一个也不能有，否则会出错！！！
 */

module.exports = options => {

    // 公共部分的消息体
    let replyMessage = `<xml>
        <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
        <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
        <CreateTime>${options.createTime}</CreateTime>
        <MsgType><![CDATA[${options.msgType}]]></MsgType>`;

    // 文本消息
    if (options.msgType === 'text') {
        replyMessage += `<Content><![CDATA[${options.content}]]></Content>`;
        // 图片消息
    } else if (options.msgType === 'image') {
        replyMessage += `<Image><MediaId><![CDATA[${options.mediaId}]]></MediaId></Image>`;
        // 语音消息
    } else if (options.msgType === 'voice') {
        replyMessage += `<Voice><MediaId><![CDATA[${options.mediaId}]]></MediaId></Voice>`;
        // 视频消息
    } else if (options.msgType === 'video') {
        replyMessage += `<Video>
      <MediaId><![CDATA[${options.mediaId}]]></MediaId>
      <Title><![CDATA[${options.title}]]></Title>
      <Description><![CDATA[${options.description}]]></Description>
      </Video>`;
        // 音乐消息
    } else if (options.msgType === 'music') {
        replyMessage += `<Music>
      <Title><![CDATA[${options.title}]]></Title>
      <Description><![CDATA[${options.description}]]></Description>
      <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
      <HQMusicUrl><![CDATA[${options.hqMusicUrl}]]></HQMusicUrl>
      <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId>
      </Music>`;
        // 新闻消息
    } else if (options.msgType === 'news') {
        replyMessage += `<ArticleCount>${options.content.length}</ArticleCount>
      <Articles>`;

        options.content.forEach(item => {
            replyMessage += `<item>
        <Title><![CDATA[${item.title}]]></Title>
        <Description><![CDATA[${item.description}]]></Description>
        <PicUrl><![CDATA[${item.picUrl}]]></PicUrl>
        <Url><![CDATA[${item.url}]]></Url>
        </item>`
        });

        replyMessage += `</Articles>`;
    }

    replyMessage += '</xml>';

    // 最终回复给用户的 xml 数据
    return replyMessage;
};