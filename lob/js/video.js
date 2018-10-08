  var vOptions = {
    sources: [{
      src: 'https://video.youxiangtv.com/lobsterfestival.mp4',
      type: 'video/mp4'
    }],
    // sources: [{
    //   src: 'http://pili-live-hls.itangchao.me/test-activety-live/l2187157009712128.m3u8',
    //   type: 'application/x-mpegURL'
    // }],
    controls: true,
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
