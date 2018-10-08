'use strict';

// 从10张随机图片中插入6张
var list = document.querySelector('.list');
var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
for (var i = 0; i < 6; i++) {
	var number = Math.ceil(Math.random() * 10);
	arr[number]++;
	var html = '<img class="img1" src="/huajiao/img/' + number + '.jpg" alt=""> <img class="img2" src="/huajiao/img/play.png" alt="">';
	var div = document.createElement('div');
	div.innerHTML = html;
	if (arr[number] === 1) {
		list.appendChild(div);
	} else {
		i--;
	}
}
// 处理数据的函数
function getUrlParamWithHash(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
	var r = window.location.href.split('?')[1].match(reg);
	return r !== null ? decodeURIComponent(r[2].replace(/(\+)+/g, ' ')) : null;
}
//处理location.href数据
if (location.search !== '') {
	var title = getUrlParamWithHash('name');
	var title1 = decodeURI(title.split('.').join('%'));
	var url = getUrlParamWithHash('cover');
	document.title = title1 + '正在有象直播';
	var imgurl = document.querySelector('section .img2');
	imgurl.src = url;

	axios.post('/wechat/get_params').then(function (res) {
		wx.config({
			// debug: true,
			appId: 'wxc89ca66545c2df54',
			timestamp: res.data.timestamp,
			nonceStr: res.data.nonceStr,
			signature: res.data.signature,
			jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ']
		});

		wx.ready(function () {
			wx.onMenuShareAppMessage({
				title: '忍不住分享【' + title1 + '】的直播',
				desc: '我在有象视频看直播，就问你来不来',
				imgUrl: url
			});
			wx.onMenuShareTimeline({
				title: '忍不住分享【' + title1 + '】的直播',
				imgUrl: url
			});
		});
	}).catch(function (error) {});
}

// 设置title 和 封面图片
var openApp = function openApp() {
	location.href = 'jcgroup://youxiang.com/go?action=livePlay&id=' + getUrlParamWithHash('roomid') + '&roomType=2';
	var now = Date.now();
	setTimeout(function () {
		if (Date.now() - now < 2550) {
			location.href = 'http://www.youxiangtv.com/m-index.html';
		}
	}, 2500);
};
//绑定点击事件
var listitem = document.querySelectorAll('.list div');
for (var i = 0; i < 6; i++) {
	listitem[i].onclick = openApp;
}
//section 绑定点击事件
var section = document.querySelector('section');
section.onclick = openApp;
console.log(location.search);