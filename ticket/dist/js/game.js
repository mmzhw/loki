'use strict';

switch (location.hash.slice(1)) {
  case 'b':
    createPic('b');
    break;
  case 'c':
    createPic('c');
    break;
  case 'd':
    createPic('d');
    break;
  default:
    createPic('a');
}

var reduceTime = setInterval(function () {
  var currWidth = document.getElementById('progress-content').offsetWidth;

  if (currWidth > 0) {
    document.getElementById('heart').style.left = currWidth - 9 + 'px';
    document.getElementById('progress-content').style.width = currWidth - 9 + 'px';
  }
}, 300);

function createPic(letter) {
  var picEl = document.createElement('img');
  picEl.setAttribute('src', 'img/star-' + letter + '.jpg');
  document.querySelector('.star-pic').appendChild(picEl);
  document.querySelector('.pic-corner').innerText = letter.toUpperCase();
}

function createLip(color, count, oppoFlag) {
  var imgEl = document.createElement('img');
  imgEl.setAttribute('src', 'img/kiss-' + color + '.png');
  if (oppoFlag) {
    imgEl.setAttribute('class', 'lip lip-' + color + ' lip-' + count + ' lip-fly-oppo');
  } else {
    imgEl.setAttribute('class', 'lip lip-' + color + ' lip-' + count + ' lip-fly');
  }
  document.querySelector('.click-area').appendChild(imgEl);
}

// 点击计数
var clickCount = 0;
document.getElementById('click-button').addEventListener('touchstart', function () {
  var currWidth = document.getElementById('progress-content').offsetWidth;

  // console.log('currWidth', currWidth)

  if (currWidth === 9 * 9) {
    document.getElementById('alert-note').innerText = '10个，对心凌的爱还不够哦！';
    document.getElementById('alert-note').style.display = 'block';
    var tipTimer = setTimeout(function () {
      document.getElementById('alert-note').style.display = 'none';
    }, 1200);
  }
  if (currWidth === 9 * 24) {
    document.getElementById('alert-note').innerText = '25个，继续努力吻，吻女神！';
    document.getElementById('alert-note').style.display = 'block';
    setTimeout(function () {
      document.getElementById('alert-note').style.display = 'none';
    }, 1200);
  }
  if (currWidth === 9 * 39) {
    document.getElementById('alert-note').innerText = '40个，离抽门票的机会就差一点点啦！';
    document.getElementById('alert-note').style.display = 'block';
    setTimeout(function () {
      document.getElementById('alert-note').style.display = 'none';
    }, 1200);
  }

  if (currWidth >= 468) {
    clearInterval(reduceTime);
    location.href = 'lottery.html';
  } else {
    document.getElementById('heart').style.left = currWidth + 9 + 'px';
    document.getElementById('progress-content').style.width = currWidth + 9 + 'px';
  }

  clickCount++;
  switch (clickCount % 4) {
    case 1:
      createLip('red', clickCount, true);
      break;
    case 2:
      createLip('purple', clickCount, false);
      break;
    case 3:
      createLip('yellow', clickCount, true);
      break;
    default:
      createLip('blue', clickCount, false);
  }
  var currCount = clickCount;
  setTimeout(function () {
    (function (num) {
      console.log(num);
      document.querySelector('.lip-' + num).remove();
    })(currCount);
  }, 2000);
});