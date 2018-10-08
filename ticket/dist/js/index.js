'use strict';

// 判断是否在微信浏览器
var ua = navigator.userAgent.toLowerCase();
var isWeixin = ua.match(/MicroMessenger/i) == 'micromessenger';

if (!isWeixin) {
  document.querySelector('.tip-mask').style.display = 'block';
}

var localstroage = window.localStorage;

function randomString(len) {
  len = len || 16;
  var chars = 'abcdefghijklmnopqrstuvwxyz123456789';
  var maxPos = chars.length;
  var randomId = '';
  for (var i = 0; i < len; i++) {
    randomId += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return randomId;
}
console.log(localstroage.getItem('userKey'));

if (!localstroage.getItem('userKey')) {
  var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  var text = '%E5%91%B5%E5%91%B5' + randomString(16);
  var textBytes = aesjs.utils.utf8.toBytes(text);
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var encryptedBytes = aesCtr.encrypt(textBytes);
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  console.log(encryptedHex);

  var currKey = randomString(16);
  localstroage.setItem('userKey', encryptedHex);
}

function autoPlayAudio() {
  wx.config({
    // 配置信息, 即使不正确也能使用 wx.ready
    debug: false,
    appId: '',
    timestamp: 1,
    nonceStr: '',
    signature: '',
    jsApiList: []
  });
  wx.ready(function () {
    document.getElementById('audio').play();
  });
}

autoPlayAudio();

ajax.get('/api/finished', {}, function (res) {
  if (typeof res !== 'Object') {
    res = JSON.parse(res);
  }
  console.log(res);
  if (res.status) {
    if (res.data) {
      document.querySelector('.tip-mask').style.display = 'block';
      document.querySelector('.tip-mask p').innerText = '活动已结束～';
    }
  } else {
    alert(res.data);
  }
});