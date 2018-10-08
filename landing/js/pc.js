window.onload = function() {
  var math_floor = Math.floor
  var $ = function(id) {
    return document.getElementById(id)
  };
  var fixNum = function(num) {
    if (num > 9) {
      return num
    } else {
      return '0' + num
    }
  };
  var countdown = function(timestamp) {
    var timeLeft = math_floor((timestamp - Date.now()) / 1000)

    return {
      days: fixNum(math_floor(timeLeft / 86400)),
      hours: fixNum(math_floor((timeLeft / 3600) % 24)),
      mins: fixNum(math_floor((timeLeft / 60) % 60)),
      secs: fixNum(math_floor(timeLeft % 60))
    }
  }

  var timer = setInterval(function() {
    var startTime = new Date('May 20,2017 19:30:00').getTime()
    if (startTime <= Date.now()) {
      clearInterval(timer)
      return false
    };
    var time = countdown(startTime)

    $('days').innerText = time.days
    $('hours').innerText = time.hours
    $('mins').innerText = time.mins
    $('secs').innerText = time.secs
  }, 1000)

  var loveFlag = true
  $('love').addEventListener('click', function() {
    if(!/love-fly/g.test(document.querySelector('.love-copy').className)) {
      document.querySelectorAll('.love-copy')[0].className += ' love-fly-1'
      document.querySelectorAll('.love-copy')[1].className += ' love-fly-2'
      document.querySelectorAll('.love-copy')[2].className += ' love-fly-3'
      document.querySelectorAll('.love-copy')[3].className += ' love-fly-4'
      document.querySelectorAll('.love-copy')[4].className += ' love-fly-5'
      document.querySelectorAll('.love-copy')[5].className += ' love-fly-6'
    }
    if (loveFlag) {
      ajax.post(
        '/api/countlove',
        {},
        function (res) {
          if (typeof res !== 'Object') {
            res = JSON.parse(res)
          }
          $('count-love-num').innerText = res.data
        }
      )
      loveFlag = false
      var loveTimer = setTimeout(function() {
        loveFlag = true
      }, 1000)
    }
  })

  var claritys = ['240P', '480P']

  var controlBar = {
    children: [
      'playToggle',
      'currentTimeDisplay',
      'timeDivider',
      'durationDisplay',
      'progressControl',
      'fullscreenToggle',
      'volumeControl',
      'muteToggle'
    ]
  }

  var vOption = {
    // sources: [{
    //   src: 'http://dx-video-test.itangchao.me/cyndiwants1_720p.mp4',
    //   type: 'video/mp4',
    //   res: '720P',
    //   label: '高清'
    // }, {
    //   src: 'http://dx-video-test.itangchao.me/cyndiwants1_480p.mp4',
    //   type: 'video/mp4',
    //   res: '480P',
    //   label: '标清'
    // }, {
    //   src: 'http://dx-video-test.itangchao.me/cyndiwants1_360p.mp4',
    //   type: 'video/mp4',
    //   res: '240P',
    //   label: '流畅'
    // }],
   sources: [
     {
       src: 'rtmp://pili-publish.itangchao.me/test-activety-live/l2187157009712128?e=1495255616&token=a762XYT8HlgpWDluacAC6Gvy_8kofwzgdF75Dk3A:MIC2Abb74AmngI18KOGvtFfdXX4=',
       type: 'video/rtmp'
     }
    ],
    // sources: [{
    //   src: 'rtmp://pili-live-rtmp.itangchao.com/testdx/test',
    //   type: 'video/rtmp',
    //   res: '720P',
    //   label: '高清'
    // }],
    controls: true,
    autoplay: true,
    loop: true,
    width: 748,
    height: 421,
    techOrder: ['html5', 'flash'],
    // flash: { hls: { withCredentials: false }},
    // html5: {
    //   hls: { withCredentials: false }
    // },
    controlBar: controlBar,
    errorDisplay: false, // 使用自定义错误框
    loadingSpinner: false, // 使用自定义错误框
    plugins: {
      videoJsResolutionSwitcher: {
        default: 'high',
        dynamicLabel: true
      }
    }
  }

  //格式化参数
  function formatParams(data) {
    var arr = []
    for (var name in data) {
      arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]))
    }
    arr.push(('v=' + Math.random()).replace('.', ''))
    return arr.join('&')
  }

  function buildLoadingSpinner() {
    var loadingComponent = videojs.getComponent('LoadingSpinner')
    var Loading = videojs.extend(loadingComponent, {
      constructor: function(player, options) {
        loadingComponent.apply(this, arguments)
      },
      createEl: function() {
        return videojs.createEl('div', {
          innerHTML: '<div class="content-wrap">' +
              '<img class="loading-gif" src="img/player-loading.gif" alt="">' +
              '<span class="loading-text">努力载入中.....</span>' +
            '</div>',
          className: 'vjs-fullscreen-modal vjs-elephant-loading vjs-hidden'
        })
      },
    })
    videojs.registerComponent('Loading', Loading)
  }
  function buildErrorModal() {
    var modal = videojs.getComponent('ClickableComponent')
    var theComponent = videojs.extend(modal, {
      name: function() {
        return 'JCErrorDisplay'
      },
      constructor: function(player, options) {
        modal.apply(this, arguments)
      },
      createEl: function() {
        return videojs.createEl('div', {
          innerHTML: '<div class="content-wrap" style="cursor: pointer;">' +
              '<img src="img/player-error.png" alt="">' +
              '<span class="error-text">加载失败，点击刷新</span>' +
            '</div>',
          className: 'vjs-fullscreen-modal vjs-hidden'
        })
      },
      handleClick: function() {
        location.reload()
      }
    })
    videojs.registerComponent('JCErrorDisplay', theComponent)
  }
  // function parseHlsList() {
  //   var videoBaseUrl = 'http://dx-video-test.itangchao.me/'

  //   var hlsPlayList = []

  //   ajax({
  //     url: vOption.sources[0].src,
  //     type: 'POST',
  //     data: {},
  //     dataType: 'json',
  //     success: function (res, xml) {
  //     },
  //     fail: function (status) {
  //     }
  //   }, function(res) {
  //     res = String(res)
  //     var parser = new m3u8Parser.Parser()

  //     parser.push(res)
  //     parser.end()


  //     var parsedManifest = parser.manifest
  //     if (parsedManifest.playlists) {
  //       hlsPlayList = parsedManifest.playlists
  //     }
  //   })

  //   return hlsPlayList
  // }

  var videoBaseUrl = 'http://dx-video-test.itangchao.me/'

  var hlsPlayList = []

  // ajax.post(
  //   vOption.sources[0].src,
  //   {},
  //   function (res) {
  //     res = String(res)
  //     var parser = new m3u8Parser.Parser()

  //     parser.push(res)
  //     parser.end()

  //     var parsedManifest = parser.manifest
  //     if (parsedManifest.playlists) {
  //       hlsPlayList = parsedManifest.playlists
  //     }

  //     playerInit()
  //   }
  // )

  playerInit()

  function playerInit() {
    var player = videojs(document.getElementById('pc-player').getElementsByTagName('video')[0], vOption, function() {
      buildLoadingSpinner()
      this.addChild('Loading')

      buildErrorModal()
      this.addChild('JCErrorDisplay')

      var repLabelMap = {
        '240P': '流畅',
        '480P': '标清',
        '720P': '高清',
        '1080P': '1080P',
      }
      var videoBaseUrl = 'https://dx-video-test.itangchao.me/'
      var sourcesList = claritys
      var levels = hlsPlayList

      if (levels.length > 0) {
        var hlsSourcesList = []
        for (var i = 0, j = sourcesList.length; i < j; i++) {
          hlsSourcesList.push({
            url: videoBaseUrl + levels[i].uri,
            label: repLabelMap[sourcesList[i]],
            type: 'application/x-mpegURL',
            res: sourcesList[i]
          })
        }
        this.updateHlsSrc(hlsSourcesList, 0)
      }

      this.on('loadedmetadata', function() {
        this.childNameIndex_.Loading.hide()
      })

      this.on('seeking', function() {
        // this.childNameIndex_.Loading.show()
        // 让拖动的时候，进度条能够跟上
        this.controlBar.progressControl.seekBar.update()
        // 让拖动的时候，播放按钮一直显示在播放的状态
        if (this.controlBar.playToggle.hasClass('vjs-paused')) {
          this.controlBar.playToggle.handlePlay()
        }
      })

      this.on('seeked', function() {
        this.play()
      })

      this.on('waiting', function() {
        this.childNameIndex_.Loading.show()
      })

      this.on('error', function() {
        // FIXME 暂时没有找到直接获取的方法?
        this.childNameIndex_.JCErrorDisplay.show()
        this.childNameIndex_.Loading.hide()
      })

      this.on('play', function() {
        this.childNameIndex_.JCErrorDisplay.hide()
        this.childNameIndex_.Loading.hide()
      })

      // loading
      var loadingHideList = ['playing', 'canplay']
      for (var i = 0, j = loadingHideList.length; i < j; i++) {
        this.on(loadingHideList[i], function() {
          this.childNameIndex_.Loading.hide()
        })
      }

      this.on('fullscreenchange', function(screen) {
        if (this.isFullscreen()) {
          this.addClass('vjs-elephant-fullscreen')
        } else {
          this.removeClass('vjs-elephant-fullscreen')
        }

        // 去掉button相关的title
        var hoverButtons = ['playToggle', 'muteToggle']
        for (var i = 0, j = hoverButtons; i < j; i++) {
          this.controlBar[i].el_.removeAttribute('title')
        }
      })
    })
    // player.updateSrc(vOption.sources)
    player.volume(0.5)
  }

  function updateOnlineCount() {
    ajax.get(
      '/api/online',
      {},
      function (res) {
        if (typeof res !== 'Object') {
          res = JSON.parse(res)
        }
        $('watch-count-num').innerText = res.data
      }
    )
  }

  function updateLoveCount() {
    ajax.get(
      '/api/countlove',
      {},
      function (res) {
        if (typeof res !== 'Object') {
          res = JSON.parse(res)
        }
        $('count-love-num').innerText = res.data
      }
    )
  }

  updateOnlineCount()
  updateLoveCount()

  setInterval(function() {
    updateOnlineCount()
    updateLoveCount()
  }, 10000)
}
