(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* eslint-disable */
var ua = {
  ios: /iPhone|iPad|iPod/i.test(navigator.userAgent),
  android: /Android/i.test(navigator.userAgent)
};
var callHandlers = [];
var registerHandlers = [];
var bridge = {
  call: function call() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    callHandlers.push(args);
  },
  register: function register() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    registerHandlers.push(args);
  }
};

/**
 * 获取ios 的bridge object
 * https://github.com/marcuswestin/WebViewJavascriptBridge
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function setupIphoneWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }

  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);

  return false;
}
/**
 * 获取android 的bridge object
 * https://github.com/lzyzsd/JsBridge
 * http://mp.weixin.qq.com/s?__biz=MzI1NjEwMTM4OA==&mid=2651231789&idx=1&sn=f11650ad0e18ddc12ece6e7559d5084c&scene=1&srcid=0513BWa7HuHjzPAeManB3w6C#rd
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function connectAndroidWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge);
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function () {
      callback(WebViewJavascriptBridge);
    }, false);
  }
}
/**
 * 根据环境暴露bridge object
 * @param  {[type]} bridgeObj [description]
 * @return {[type]}           [description]
 */
function exportBridge(bridgeObj) {
  bridgeObj.init && bridgeObj.init();
  if (bridgeObj) {
    bridge.call = bridgeObj.callHandler;
    bridge.register = bridgeObj.registerHandler;

    if (callHandlers.length) {
      callHandlers.forEach(function (call) {
        bridge.call.apply(bridge, _toConsumableArray(call));
      });
    }
    if (registerHandlers.length) {
      registerHandlers.forEach(function (register) {
        bridge.register.apply(bridge, _toConsumableArray(register));
      });
    }
  }
}

if (ua.ios) {
  setupIphoneWebViewJavascriptBridge(exportBridge);
} else if (ua.android) {
  // require('dir-util/AndroidWebViewJavascriptBridge.js')
  connectAndroidWebViewJavascriptBridge(exportBridge);
}



// bridge.call  调用native提供的方法
// - bridge.call('immediateExperience') 引导页，立即体验按钮
// - bridge.call('setTitle', title) header 设置title

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var wxShare = function wxShare() {
  var oReq = new XMLHttpRequest();
  oReq.onload = function (e) {
    var data = oReq.response;
    console.log(data, typeof data === 'undefined' ? 'undefined' : _typeof(data));
    if (data) {
      /* global wx:true */
      data = JSON.parse(data);
      wx.config({
        // debug: true,
        appId: 'wxc89ca66545c2df54',
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
      });

      // let url = window.location.href
      var shareTitle = '有象视频城市拍客招募 千万奖金等你来拿！';
      var desc = '用镜头记录城市，用画面留存记忆，探寻那些传闻已久，却不为人知的故事~';
      var image = 'https://activity.youxiangtv.com/pai/imgs/share.png';
      wx.ready(function () {
        wx.onMenuShareAppMessage({
          title: shareTitle,
          desc: desc,
          imgUrl: image
          // link: url
        });
        wx.onMenuShareTimeline({
          title: shareTitle,
          imgUrl: image
        });
      });
    }
  };
  oReq.open('POST', '/wechat/get_params');
  oReq.send();
};

wxShare();

// bridge.call('base_share', data, function (res) {});
bridge.register('base_getShareContent', function (data, responseCallback) {
  var responseData = {
    code: '0000', // string类型，固定值0000
    data: {
      title: '有象视频城市拍客招募 千万奖金等你来拿！', // string类型，分享主标题
      subTitle: '用镜头记录城市，用画面留存记忆，探寻那些传闻已久，却不为人知的故事~', // string类型，分享副标题
      // content: '网易网易网易', // string类型，分享描述内容
      imgUrl: 'https://activity.youxiangtv.com/pai/imgs/share.png', // string类型，分享图片url
      shareUrl: 'http://www.163.com/' // string类型，分享url
    },
    msg: ''
  };
  responseCallback(responseData);
});

})));
