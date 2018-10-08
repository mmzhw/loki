const tanText = '作曲家，指挥家，曾执棒伦敦交响乐团，纽约爱乐，柏林爱乐等世界知名交响乐团，并荣获诸多著名音乐大奖（格莱美奖，奥斯卡学院奖等）。2010年上海世博会期间担任“全球文化大使”，现担任联合国教科文全球组织亲善大使。'
const jeanText = '1945年出生，法国著名设计师，1994年创办让·努维尔工作室，2008年获得普利兹克奖桂冠。他的作品过目难忘，如巴黎阿拉伯文化中心、巴黎原始艺术博物馆、巴黎爱乐厅、阿布扎比卢浮宫，并被誉为21世纪最具代表性的建筑师之一。目前，让·努维尔正在中国筹备数个大型项目。' 
const anaisText = 'Anaïs Martane（安娜·马田）：她与中国的不解之缘，得从青春的初爱说起。安娜·马田当年为了学习中文离开了故乡尼斯，来到巴黎就读于国立东方语言学院（INALCO）。2001年，她来到中国，以摄影记者的身份为不同的外国媒体工作，后来在中国定居并组建了家庭。2011年，她开始了电影制片人的职业生涯，为中法合拍影片特别是陈果、刘烨和王超等人的多部电影担任制片人，并有两部影片在戛纳获奖。事业有成的她致力于提高中国大众的文化和教育水平。同时她也是环保理念的积极倡导者。2016年，她担任了“种植吧小园丁”项目的形象大使。“种植吧小园丁”是一个由法国大使馆支持的种植比赛，通过在幼儿园和小学植树和种植蔬菜的活动，唤起孩子们对环境保护的意识，鼓励他们选择环保的生活方式。'
const chengText = '国际动作巨星、导演、制作人、编剧、歌手、全世界最年轻的奥斯卡终身成就奖获得者。与此同时，他也是一位身体力行的环保倡导者与实践者。2003年，因为在环境保护方面的杰出贡献，成龙被授予中国环境文化促进会副会长一职。他提倡节约用水、垃圾分类、珍惜食物、减少能源消耗，并为鼓励人们环保出行，成立了环保出行基金。作为环保行动的先锋， 成龙自2016年起将电影废弃物回收再设计变成艺术品，并举办环保艺术展。希望通过艺术展览的方式，让人们意识到回收和可持续的重要性。2017年，成龙启动“成龙环保英雄”系列公益计划，通过一系列纪录片，讲述如何应用创新科技改善现实生活环境的人和事，旨在鼓励具有创新理念的人们为中国及全世界的环境问题出谋划策，贡献力量。在成龙不遗余力地号召和鼓励下， 越来越多的人开始关注环保，并加入环保的队伍。'
const guest = {
  a: {
    desc: anaisText,
    name: '安娜·马田',
    identity: '推广大使',
    imgPath: './imgs/p-a.png',
  },
  c: {
    desc: chengText,
    name: '成龙',
    identity: '推广大使',
    imgPath: './imgs/p-c.png',
  },
  t: {
    desc: tanText,
    name: '谭盾',
    identity: '特邀嘉宾',
    imgPath: './imgs/p-t.png',
  },
  j: {
    desc: jeanText,
    identity: '特邀嘉宾',
    name: 'Jean Nouvel',
    imgPath: './imgs/p-j.png',
  }
}

const coverDom = document.querySelector('.cover')
document.querySelector('.close-btn').addEventListener('click', () => {
  coverDom.style.display = 'none'
})

for (var cell of document.querySelectorAll('.sguest')) {
  let name = cell.dataset.name
  cell.addEventListener('click', () => {
    coverDom.style.display = 'block' 

    document.querySelector('.avatar-img').src = guest[name].imgPath
    document.querySelector('.person-desc .name').innerText = guest[name].name
    document.querySelector('.person-desc .identity').innerText = guest[name].identity
    document.querySelector('.person-desc').scrollTop = 0
    document.querySelector('.person-desc p').innerText = guest[name].desc
  }, false);
}

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
      let shareTitle = '来有象视频和谭盾、安娜一起聊聊城市变迁 '
      let desc = '第四届中法环境月'
      let image = 'https://activity.youxiangtv.com/cnfr/imgs/share.jpg'

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

