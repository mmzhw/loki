(function() {
  // 进入网页获取铭牌
  getNameplate()
  var $ = function(query) {
    return document.querySelector(query);
  };//
  function getId(id) {
    return document.getElementById(id)
  }
  function getClass (className) {
    return document.getElementsByClassName(className)
  }
  var nameplateNumber = getClass('nameplate-number')
  var voteBtn = getClass('vote-btn')
  var activityName = getClass('activity-name')
  var voteActivity = getClass('vote-activity')
  var voteContent = getClass('vote-content')
  var voteBtn = getClass('vote-btn')
  var voteAdd = getClass('vote-add')
  // 获取铭牌
  function getNameplate () {
    axios({
      method: 'get',
      url: '/lobster/nameplate',
      data: {}
    }).then(function(data) {
      var resultData = data.data;
      for (var i = 0; i < nameplateNumber.length; i++) {
        nameplateNumber[i].innerHTML = resultData.data[i].number + '想看'
        activityName[i].innerHTML = resultData.data[i].name
        voteContent[i].setAttribute ('data-id' ,resultData.data[i].id)
      }
    })
  }
  // 投票
  function addNameplate (addId) {
    console.log(addId)
    axios({
      url: '/lobster/nameplate',
      method: 'post',
      data: {
        id: addId
      }
    }).then(function(result) {
      console.log(result);
      $('.vote-ticket').innerHTML = '<p>您今天还有'+ (3 - result.data.vote_num) +'票可投</p>';
      leftTimes = result.data.rewards_num;
      $('.left-times').innerHTML = 'x<span>'+leftTimes+'</span>'
      console.log('success')
    })
  }
  for(var i = 0; i < voteBtn.length; i++) {
    (function(i) {
      var j = i
      voteBtn[j].addEventListener('touchend', function(event) {
        var addId = this.parentNode.getAttribute('data-id')
        addNameplate(addId)
        voteAdd[j].style.display = 'flex'
        setTimeout(function(){voteAdd[j].style.display = 'none'}, 1000)
      })
    })(i)
  }
  // 网红资料
  var prev = getId('prev')
  var next = getId('next')
  var rotation = getId('rotation')
  prev.addEventListener('touchend', function() {
    var transform = rotation.style.transform
    var x = transform.slice(11)
    var translateX = Number(x.substr(0, x.length-4)) + 6.12
    if (translateX > 0) {
      rotation.style.transform = 'translateX(-42.84rem)'
    } else if (translateX < 6.12){
      rotation.style.transform = 'translateX('+ translateX +'rem)'
    }
  })
  next.addEventListener('touchend', function() {
    console.log(rotation)
    var transform = rotation.style.transform
    console.log(transform)
    var x = transform.slice(11)
    var translateX = x.substr(0, x.length-4) - 6.12
    console.log('outer' + translateX)
    if (translateX < -42.839999999999996) {
      rotation.style.transform = 'translateX(0rem)'
    } else if (translateX > -48.96){
      rotation.style.transform = 'translateX('+ translateX +'rem)'
    }
  })
  //弹框各项事件
  var testbtn1 = getId('testbtn1')
  var testbtn2 = getId('testbtn2')
  var testbtn3 = getId('testbtn3')
  var mask = getId('mask')
  var close = getId('close')
  var late = getId('late')
  var goLottery = getId('goLottery')
  var writeMsgBtn = getId('writeMsgBtn')
  var msgSubmitBtn = getId('msgSubmitBtn')
  var noRewardBtn = getId('noRewardBtn')
  var reWriteBtn = getId('reWriteBtn')
  var sureSubmitBtn = getId('sureSubmitBtn')
  var sureBtn = getId('sureBtn')
  var tel = getId('tel')
  var name = getId('name')
  var address = getId('address')
  var sureTel = getId('sureTel')
  var sureName = getId('sureName')
  var sureAddress = getId('sureAddress')
  testbtn1.addEventListener('touchend', function() { popUp('explanation') })
  testbtn2.addEventListener('touchend', function() { popUp('lottery') })
  testbtn3.addEventListener('touchend', function() { popUp('reward') })
  // 抽奖及抽奖活动说明弹框事件
  close.addEventListener('touchend', function() {
    hidePop('explanation')
  })

  //抽奖机会弹框事件
  late.addEventListener('touchend', function() {
    hidePop('lottery')
  })
  goLottery.addEventListener('touchend', function() {
    hidePop('lottery')
    scrollTo(0, 800) //要页面足够长
  })
  //获得奖品弹框事件
  writeMsgBtn.addEventListener('touchend', function() {
    hidePop('reward')
    popUp('writeMsg')
  })
  noRewardBtn.addEventListener('touchend', function() {
    hidePop('no-reward')
    // popUp('writeMsg')
  })
  // 填写信息弹框事件
  msgSubmitBtn.addEventListener('touchend', function() {
    hidePop('writeMsg')
    popUp('makesureMsg')
    sureTel.innerHTML = tel.value
    sureName.innerHTML = name.value
    sureAddress.innerHTML = address.value
  })

  //确认信息事件
  reWriteBtn.addEventListener('touchend', function() {
    hidePop('makesureMsg')
    popUp('writeMsg')
  })
  sureSubmitBtn.addEventListener('touchend', function() {
    hidePop('makesureMsg')
    console.log(tel.value)
    popUp('getMsg')
    var msg = {
      name: name.value,
      phone: tel.value,
      address: address.value
    }
    axios({
      url: '/lobster/userinfos',
      data: msg,
      method: 'post',
      withCredentials: true
    }).then(function() {
      console.log('success')
    })
  })
  //已经收到信息事件
  sureBtn.addEventListener('touchend', function() {
    hidePop('getMsg')
  })
  //点击蒙层，消灭所有弹框
  mask.addEventListener('touchend', function() {
    hidePop('explanation')
    hidePop('lottery')
    hidePop('reward')
    hidePop('writeMsg')
    hidePop('makesureMsg')
    hidePop('getMsg')
    hidePop('no-reward')
  })
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
})()
