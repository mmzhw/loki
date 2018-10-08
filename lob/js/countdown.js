(function() {
  var math_floor = Math.floor;
  var $ = function(query) {
    return document.querySelector(query);
  };
  var fixNum = function(num) {
    if (num > 9) {
      return num;
    } else {
      return '0' + num;
    }
  };

  // window.ajax = function(url, method, params, success, fail) {
  //   var xhr = new XMLHttpRequest();
  //   var prefix = 'http://10.0.72.174:3000'
  //
  //   xhr.onreadystatechange = function() {
  //     if (xhr.readyState == 4) {
  //       var status = xhr.status;
  //       if (status >= 200 && status < 300) {
  //         var response;
  //         try {
  //           response = JSON.parse(xhr.responseText);
  //         } catch (e) {
  //           response = {};
  //         }
  //         success && success(response);
  //       } else {
  //         fail && fail();
  //       }
  //     }
  //   };
  //
  //   if (method.toLowerCase() == 'get') {
  //     var query;
  //     var arr = [];
  //     for (var key in params) {
  //       arr.push(key + '=' + params[key])
  //     }
  //     if (key !== undefined) {
  //       query = '?';
  //     } else {
  //       query = '';
  //     }
  //     query += arr.join('&');
  //     xhr.open('GET', prefix + url + query, true);
  //     xhr.withCredentials = true
  //     xhr.send();
  //   } else if (method.toLowerCase() == 'post') {
  //     xhr.open('POST', prefix + url, true);
  //     //设置表单提交时的内容类型
  //     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //     xhr.withCredentials = true
  //     xhr.send(params);
  //   }
  // }

  var countdown = function(timestamp) {
    var lag = timestamp - Date.now();

    if (lag <= 0) {
      return {
        days: '00',
        hours: '00',
        mins: '00',
        secs: '00'
      };
    }
    var timeLeft = Math.floor(lag / 1000);

    return {
      days: fixNum(math_floor(timeLeft / 86400)),
      hours: fixNum(math_floor((timeLeft / 3600) % 24)),
      mins: fixNum(math_floor((timeLeft / 60) % 60)),
      secs: fixNum(math_floor(timeLeft % 60))
    };
  };

  var timer = setInterval(function() {
    var startTime = new Date('Jun 12,2017 13:00:00').getTime();
    if (startTime <= Date.now()) {
      clearInterval(timer);
      return;
    };
    var time = countdown(startTime);

    $('.days').innerText = time.days;
    $('.hours').innerText = time.hours;
    $('.mins').innerText = time.mins;
    $('.secs').innerText = time.secs;
  }, 1000);

  window.leftTimes = null
  window.lefVoteNum = null

  axios({
    method: 'get',
    url: '/lobster/rewards_num',
    data: {},
    withCredentials: true
  }).then(function(result) {
    leftTimes = result.data.rewards_num;
    lefVoteNum = 3 - result.data.vote_num;
    $('.left-times').innerHTML = 'x<span>'+leftTimes+'</span>'
    $('.vote-ticket').innerHTML = '<p>您今天还有'+ lefVoteNum +'票可投</p>';
    console.log('leftTimes', leftTimes);
  })

  var animationTimer,
      canTouch = true;

  $('.turntable-btn').addEventListener('touchend', function(event) {
    if (leftTimes == 0) {
      console.log('抽奖机会用完了！！');
      popUp('nolottery')
      return;
    }
    $('.pointer').className = 'pointer';
    clearTimeout(animationTimer);

    axios({
      method: 'post',
      url: '/lobster/lottery',
      data: {},
    }).then(function(result) {
      console.log(result.data);
      var data = result.data.data;

      leftTimes = data.rewards_num;
      $('.left-times').innerHTML = 'x<span>'+leftTimes+'</span>'
      $('.the-times').innerHTML = leftTimes
      if (data.awards === 'none') {
        console.log('很遗憾没有中奖');
        if (canTouch) {
          $('.pointer').classList.add('none1');
          canTouch = false;
        }
        popUpReward('')
      } else {
        switch (data.awards) {
          case 0:
            console.log('特等奖');
            if (canTouch) {
              $('.pointer').classList.add('zero');
              canTouch = false;
            }
            popUpReward(0)
            break;
          case 1:
            console.log('一等奖');
            if (canTouch) {
              $('.pointer').classList.add('first');
              canTouch = false;
            }
            popUpReward(1)
            break;
          case 2:
            console.log('二等奖');
            if (canTouch) {
              $('.pointer').classList.add('second');
              canTouch = false;
            }
            popUpReward(2)
            break;
          case 3:
            console.log('三等奖');
            if (canTouch) {
              $('.pointer').classList.add('third');
              canTouch = false;
            }
            popUpReward(3)
            break;
          case 4:
            console.log('四等奖');
            if (canTouch) {
              $('.pointer').classList.add('fourth');
              canTouch = false;
            }
            popUpReward(4)
            break;
          default:
            // do nothing
        }
      }

    })

    animationTimer = setTimeout(function() {
      canTouch = true
    }, 1000)
  });

  function getId(id) {
    return document.getElementById(id)
  }
  function popUpReward(awards) {
    var resultName
    var awardName = getId("award-name")
    var awardsImage = getId("awards-image")
    switch (awards) {
      case 0:
        console.log('特等奖');
        resultName = '最大的奖项！'
        awardsImage.setAttribute('src', './image/icon-prize0.png')
        getId('reward_msg').style.display = 'block'
        break;
      case 1:
        console.log('一等奖');
        awardsImage.setAttribute('src', './image/icon-prize1.png')
        resultName = '一等奖<br><span class="subti">DOBBY跟拍口袋智能折叠无人机一台！！</span>'
        break;
      case 2:
        console.log('二等奖');
        awardsImage.setAttribute('src', './image/icon-prize2.png')
        resultName = '二等奖<br><span class="subti">第十七届中国盱眙（金诚）国际龙虾节群星演唱会门票一张</span>'
        break;
      case 3:
        console.log('三等奖');
        awardsImage.setAttribute('src', './image/icon-prize3.png')
        resultName = '三等奖<br><span class="subti">金诚太悦度假酒店豪华湖景大床房1晚</span>'
        break;
      case 4:
        console.log('四等奖');
        awardsImage.setAttribute('src', './image/icon-prize4.png')
        resultName = '幸运奖<br><span class="subti">有象视频官方精美礼品一份（马克杯、公仔、抱枕、U盘、充电宝等随机赠送）</span>'
        break;
      default:
        resultName = ''
    }
    setTimeout(function(){
      if (resultName) {
        awardName.innerHTML = resultName
        popUp('reward')
      } else {
        popUp('no-reward')
      }
    }, 1200)
  }
  function popUp(showId) {
    var show = getId(showId)
    show.style.display = 'block'
    mask.style.display = 'block'
  }
  function hidePop(showId) {
    var show = getId(showId)
    show.style.display = 'none'
    mask.style.display = 'none'
  }
  // popUpReward(1)
  var weibos = [
    {
      name: '鸭子',
      device: 'iPhone',
      time: '6分钟前',
      face: './face/face1.jpg',
      content: '波姐一生推',
      comments: '3',
      likes: '5'
    },
    {
      name: 'christine&chris',
      device: 'iPhone 7',
      time: '2017/6/5 21:05',
      face: './face/face2.jpg',
      content: '<p>波多野结衣是谁？？？</p><p>天使萌是谁？？？？</p><p>我还是个孩纸啊~~~~~~~</p>',
      comments: '22',
      likes: '153'
    },
    {
      name: '给我burning',
      device: 'Android客户端',
      time: '1分钟前',
      face: './face/face3.jpg',
      content: '盱眙龙虾才是真·好吃·龙虾',
      comments: '5',
      likes: '20'
    },
    {
      name: 'gakki是我老婆',
      device: '微博 weibo.com',
      time: '1分钟前',
      face: './face/face4.jpg',
      content: '一年没吃龙虾了，夏天到了，龙虾烤串撸起来╰(*°▽°*)╯',
      comments: '2',
      likes: '30'
    },
    {
      name: 'xxxtian',
      device: 'iPhone 6',
      time: '3小时前',
      face: './face/face5.jpg',
      content: '十三香、椒盐、麻辣、香辣、白灼、蒜泥',
      comments: '4',
      likes: '11'
    },
    {
      name: '夏天见鬼去',
      device: 'iPhone 7 Plus',
      time: '27分钟前',
      face: './face/face6.jpg',
      content: '话说龙虾到底要整只吃还是去头去尾吃',
      comments: '14',
      likes: '44'
    },
    {
      name: 'whynoon',
      device: 'HUAWEI Mate 8',
      time: '30分钟前',
      face: './face/face7.jpg',
      content: '波姐喂我吃龙虾~~~~~要剥好的！',
      comments: '1',
      likes: '1'
    },
    {
      name: '嘻嘻锅',
      device: 'OPPO R9s',
      time: '35分钟前',
      face: './face/face8.jpg',
      content: '听说我中奖了！！！！要见波姐了！！！！！激动！！！！该带哪本片去找她签名！',
      comments: '3',
      likes: '9'
    },
    {
      name: '南质777',
      device: '360安全浏览器',
      time: '36分钟前',
      face: './face/face9.jpg',
      content: '龙虾？我只吃盱眙的。女神，我只认波多老师！',
      comments: '13',
      likes: '5'
    },
    {
      name: '波妞好',
      device: '红米Note 3',
      time: '37分钟前',
      face: './face/face10.jpg',
      content: '波多老师 我的人生导师 ！！期待您现场生动的讲课！',
      comments: '13',
      likes: '52'
    },
    {
      name: '到底要我怎样嘛',
      device: 'iPhone 6s',
      time: '37分钟前',
      face: './face/face11.jpg',
      content: 'アイドル，頑張って！',
      comments: '2',
      likes: '6'
    },
    {
      name: 'YHUSHI',
      device: 'iPhone 7',
      time: '38分钟前',
      face: './face/face12.jpg',
      content: '我是女生 我也喜欢看你的作品，学习到了很多知识！',
      comments: '11',
      likes: '2'
    },
    {
      name: '我家的VIP',
      device: 'Android客户端',
      time: '2小时前',
      face: './face/face13.jpg',
      content: '我马上要高考了，希望能得到老师的祝福！',
      comments: '1',
      likes: '1'
    },
    {
      name: 'vivi萌_',
      device: '微博 weibo.com',
      time: '3小时前',
      face: './face/face14.jpg',
      content: '龙虾和波姐，青春的回忆~',
      comments: '11',
      likes: '19'
    },
    {
      name: '妞仔很忙',
      device: 'iPhone 6',
      time: '27分钟前',
      face: './face/face15.jpg',
      content: '妹子们好像都挺好看的嘛',
      comments: '2',
      likes: '7'
    },
  ];

  var random1 = Math.floor(weibos.length * Math.random());
  var random2 = (random1 + 1) % 14;
  var random3 = (random1 + 6) % 14;

  console.log(random1, random2, random3);

  var html1 = '<div class="weibo-item"><div class="weibo-header clearfix"><div class="weibo-face"><img src="'+weibos[random1].face+'" alt=""></div><div class="weibo-from"><div class="weibo-name">'+weibos[random1].name+'</div><div class="weibo-device">'+weibos[random1].time+' 来自' +weibos[random1].device+'</div></div></div><div class="weibo-body"><a class="topic" href="http://huati.weibo.com/k/612%E6%9C%89%E8%B1%A1%E8%99%BE%E6%90%9E%E4%B8%80%E6%B3%A2">#612有象虾搞一波#</a><span class="content">'+weibos[random1].content+'</span></div><div class="weibo-tools"><a href="http://huati.weibo.com/k/612%E6%9C%89%E8%B1%A1%E8%99%BE%E6%90%9E%E4%B8%80%E6%B3%A2"><span class="zhuanfa">转发</span><span class="comments">'+weibos[random1].comments+'</span><span class="likes">'+weibos[random1].likes+'</span></a></div></div>';

  var html2 = '<div class="weibo-item"><div class="weibo-header clearfix"><div class="weibo-face"><img src="'+weibos[random2].face+'" alt=""></div><div class="weibo-from"><div class="weibo-name">'+weibos[random2].name+'</div><div class="weibo-device">'+weibos[random2].time+' 来自' +weibos[random2].device+'</div></div></div><div class="weibo-body"><a class="topic" href="http://huati.weibo.com/k/612%E6%9C%89%E8%B1%A1%E8%99%BE%E6%90%9E%E4%B8%80%E6%B3%A2">#612有象虾搞一波#</a><span class="content">'+weibos[random2].content+'</span></div><div class="weibo-tools"><a href="http://huati.weibo.com/k/612%E6%9C%89%E8%B1%A1%E8%99%BE%E6%90%9E%E4%B8%80%E6%B3%A2"><span class="zhuanfa">转发</span><span class="comments">'+weibos[random2].comments+'</span><span class="likes">'+weibos[random2].likes+'</span></a></div></div>';

  var html3 = '<div class="weibo-item"><div class="weibo-header clearfix"><div class="weibo-face"><img src="'+weibos[random3].face+'" alt=""></div><div class="weibo-from"><div class="weibo-name">'+weibos[random3].name+'</div><div class="weibo-device">'+weibos[random3].time+' 来自' +weibos[random3].device+'</div></div></div><div class="weibo-body"><a class="topic" href="http://huati.weibo.com/k/612%E6%9C%89%E8%B1%A1%E8%99%BE%E6%90%9E%E4%B8%80%E6%B3%A2">#612有象虾搞一波#</a><span class="content">'+weibos[random3].content+'</span></div><div class="weibo-tools"><a href="http://huati.weibo.com/k/612%E6%9C%89%E8%B1%A1%E8%99%BE%E6%90%9E%E4%B8%80%E6%B3%A2"><span class="zhuanfa">转发</span><span class="comments">'+weibos[random3].comments+'</span><span class="likes">'+weibos[random3].likes+'</span></a></div></div>';

    $('.weibo-content').innerHTML = html1+html2+html3;

    var runbo = function(list) {
      var container = $('.list');
      var htm = '<ul class="inner-list">';
      list.forEach(function(item) {
        htm += '<p>'+item+'</p>';
      })
      htm += '</ul>'
      container.innerHTML = htm
      var y = 0
      setInterval(function() {
        if (y < - 90) {
          y = 0
        }
        y = y - 2;
        $('.inner-list').style.transform = 'translateY('+y+'px)'
      }, 200);
    }

    axios({
      method: 'get',
      url: '/lobster/rewards_info',
      data: {}
    }).then(function(result) {
      var list = result.data.data;
      var _list = []
      list.forEach(function(item) {
        var map = {
          1: '一等奖',
          0: '特等奖',
          2: '二等奖',
          3: '三等奖',
          4: '幸运奖'
        }
        _list.push('恭喜！'+item.name + '' + item.phone + '中了' + map[item.awards]);
      })
      console.log(list);
      runbo(_list);
    })
})()
