
var wxShare = function() {
  var oReq = new XMLHttpRequest()
  oReq.onload = (e) => {
    var data = oReq.response
    console.log(data, typeof data)
    if (data) {
      /* global wx:true */
      data = JSON.parse(data)
      wx.config({
        // debug: true,
        appId: 'wxc89ca66545c2df54',
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
      })

      // let url = window.location.href
      let shareTitle = '有象视频城市拍客招募 千万奖金等你来拿！'
      let desc = '用镜头记录城市，用画面留存记忆，探寻那些传闻已久，却不为人知的故事~'
      let image = 'https://activity.youxiangtv.com/pai/imgs/share.png'
      wx.ready(() => {
        wx.onMenuShareAppMessage({
          title: shareTitle,
          desc: desc,
          imgUrl: image,
          // link: url
        })
        wx.onMenuShareTimeline({
          title: shareTitle,
          imgUrl: image,
        })
      })
    }
  }
  oReq.open('POST', '/wechat/get_params')
  oReq.send()
}

wxShare()

import bridge from '../bridge'
// bridge.call('base_share', data, function (res) {});
bridge.register('base_getShareContent', function (data, responseCallback) {
  var responseData = {
    code: '0000', // string类型，固定值0000
    data: {
      title: '有象视频城市拍客招募 千万奖金等你来拿！', // string类型，分享主标题
      subTitle: '用镜头记录城市，用画面留存记忆，探寻那些传闻已久，却不为人知的故事~', // string类型，分享副标题
      // content: '网易网易网易', // string类型，分享描述内容
      imgUrl: 'https://activity.youxiangtv.com/pai/imgs/share.png', // string类型，分享图片url
      shareUrl: 'https://activity.youxiangtv.com/pai/' // string类型，分享url
    },
    msg: '',
  };
  responseCallback(responseData);
})

