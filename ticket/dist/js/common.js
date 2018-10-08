'use strict';

if (!document.referrer) {
  location.href = 'index.html';
}

var localstroage = window.localStorage;

if (!localstroage.getItem('userKey')) {
  location.href = 'index.html';
}

// 判断是否在微信浏览器
var ua = navigator.userAgent.toLowerCase();
var isWeixin = ua.match(/MicroMessenger/i) == 'micromessenger';

if (!isWeixin) {
  location.href = 'index.html';
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