(function() {
  var math_floor = Math.floor;
  var $ = function(id) {
    return document.getElementById(id);
  };
  var fixNum = function(num) {
    if (num > 9) {
      return num;
    } else {
      return '0' + num;
    }
  };
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
  var ajax = function(url, method, params, success, fail) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var status = xhr.status;
        if (status >= 200 && status < 300) {
          var response;
          try {
            response = JSON.parse(xhr.responseText);
          } catch (e) {
            response = {};
          }
          success && success(response);
        } else {
          fail && fail();
        }
      }
    };

    if (method.toLowerCase() == 'get') {
      var query;
      var arr = [];
      for (var key in params) {
        arr.push(key + '=' + params[key])
      }
      if (key !== undefined) {
        query = '?';
      } else {
        query = '';
      }
      query += arr.join('&');
      xhr.open('GET', url + query, true);
      xhr.send();
    } else if (method.toLowerCase() == 'post') {
      xhr.open('POST', url, true);
      //设置表单提交时的内容类型
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(params);
    }
  }
  var vOptions = {
    // sources: [{
    //   src: 'http://pili-live-hls.itangchao.com/testdx/test.m3u8',
    //   type: 'application/x-mpegURL'
    // }],
    // sources: [{
    //   src: 'http://dx-video-test.itangchao.me/cyndiwants1_480p.mp4',
    //   type: 'video/mp4'
    // }],
    sources: [{
      src: 'http://pili-live-hls.itangchao.me/test-activety-live/l2187157009712128.m3u8'
      type: 'application/x-mpegURL'
    }],
    controls: true,
    width: 702,
    height: 396,
    poster: '',
  };
  var init = function() {
    var controlBar = {
      children: [
        'playToggle',
        'currentTimeDisplay',
        'progressControl',
        'durationDisplay',
        'fullscreenToggle',
      ]
    };

    var options = vOptions;
    var videoOpiton = {
      controls: options.controls, // 控制按钮
      autoplay: true,
      width: options.width,
      height: options.height,
      poster: options.poster || '', // 海报
      techOrder: ['html5', 'flash'],
      sources: options.sources || [],
      controlBar: controlBar,
      errorDisplay: false, // 使用自定义错误框
      loadingSpinner: false, // 使用自定义错误框
      loop: true
    };

    var player = null;
    player = videojs(document.querySelector('.video-js'), videoOpiton, function() {
      buildLoadingSpinner();
      buildErrorModal(this);
      buildModalComp();

      this.addChild('Loading');
      this.addChild('ErrorDisplay');
      this.addChild('EndDisplay');

      this.on('error', function() {
        this.childNameIndex_.ErrorDisplay.show();
        this.childNameIndex_.Loading.hide();
        // that.childNameIndex_.EndDisplay.hide();
      });

      this.on('seeking', function() {
        this.childNameIndex_.Loading.show();
      });
      this.on('waiting', function() {
        this.childNameIndex_.Loading.show();
      });
      this.on('seeked', function() {
        this.childNameIndex_.Loading.hide();
      })

      this.on('loadstart', function() {
        this.childNameIndex_.Loading.hide();
      });

      this.on('play', function() {
        this.childNameIndex_.ErrorDisplay.hide();
        this.childNameIndex_.Loading.hide();
        // that.childNameIndex_.EndDisplay.hide();
      });

      this.on('ended', function() {
        // that.childNameIndex_.EndDisplay.show();
        this.childNameIndex_.Loading.hide();
      });

      this.on('fullscreenchange', function(screen) {
        if (!this.isFullscreen()) {
          this.childNameIndex_.ErrorDisplay.hide();
          this.childNameIndex_.Loading.hide();
          // that.childNameIndex_.EndDisplay.hide();
        }
      });

      var loadingHideList = ['canplay', 'playing'];
      for (var i = 0, j = loadingHideList.length; i < j; i++) {
        this.on(loadingHideList[i], function() {
          this.childNameIndex_.Loading.hide()
        });
      }
    });
  };
  function buildLoadingSpinner() {
    var loadingComponent = videojs.getComponent('LoadingSpinner')
    var Loading = videojs.extend(loadingComponent, {
      constructor: function(player, options) {
        loadingComponent.apply(this, arguments);
      },
      createEl: function() {
        return videojs.createEl('div', {
          innerHTML: '<div class="content-wrap"><img class="loading-gif" src="../../assets/loading.gif" alt=""></div>',
          className: 'vjs-m-fullscreen vjs-melephant-loading vjs-hidden'
        });
      },
    })
    videojs.registerComponent('Loading', Loading);
  }
  function buildErrorModal(player) {
    var modal = videojs.getComponent('ClickableComponent')
    var theComponent = videojs.extend(modal, {
      name: function() {
        return 'ErrorDisplay';
      },
      constructor: function(player, options) {
        modal.apply(this, arguments)
      },
      createEl: function() {
        return videojs.createEl('div', {
          innerHTML: '<div class="content-wrap"><p class="error-text">视频加载失败</p><p class="error-reload"><i class="iconfont icon-refresh"></i>刷新重试</p></div>',
          className: 'vjs-m-fullscreen vjs-melephant-error vjs-hidden'
        });
      },
      handleClick: function() {
        player.play();
      }
    })
    videojs.registerComponent('ErrorDisplay', theComponent);
  }

  function buildModalComp() {
    var modal = videojs.getComponent('ClickableComponent');
    var theComponent = videojs.extend(modal, {
      name: function() {
        return 'EndDisplay';
      },
      constructor: function(player, options) {
        modal.apply(this, arguments);
      },
      createEl: function() {
        return videojs.createEl('div', {
          innerHTML: '',
          className: 'vjs-m-fullscreen vjs-melephant-ended vjs-hidden'
        });
      },
      handleClick: function() {}
    });
    videojs.registerComponent('EndDisplay', theComponent);
  };

  init();

  var timer = setInterval(function() {
    var startTime = new Date('May 20,2017 19:30:00').getTime();
    if (startTime <= Date.now()) {
      clearInterval(timer);
      return;
    };
    var time = countdown(startTime);

    $('days').innerText = time.days;
    $('hours').innerText = time.hours;
    $('mins').innerText = time.mins;
    $('secs').innerText = time.secs;
  }, 1000);

  var log = function() {
    ajax('/api/online', 'get', '', function() {
      console.log(1);
    }, function() {
      console.log(2);
    });
  }

  log();

  setInterval(function() {
    log();
  }, 20000);

  document.querySelector('.download').addEventListener('click', function() {
    location.href = 'jcgroup://youxiang.com/go?action=livePlay&id=test'
    var now = Date.now()
    setTimeout(function() {
      if (Date.now() - now < 2550) {
        location.href = 'https://fir.im/liveiOS'
      }
    }, 2500)
  })
})();
