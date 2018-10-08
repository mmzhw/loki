function loadLotteryEvent() {
  let currAward = 'none'

  document.querySelector('.lottery-click').addEventListener('click', function() {
    document.querySelector('.lottery-mask').style.display = 'block'
    ajax.post(
      '/api/lottery',
      {
        userKey: localstroage.getItem('userKey')
      },
      function (res) {
        if (typeof res !== 'Object') {
          res = JSON.parse(res)
        }
        console.log(res)
        if (res.status) {
          // res.data.awards = 'poster'
          document.querySelector('.after-lottery').style.display = 'block'
          document.querySelector('.before-lottery').style.display = 'none'
          if (res.data.awards === 'ticket') {
            document.querySelector('.no-lottery').style.display = 'none'
            document.querySelector('.qrcode-area').style.display = 'none'

            document.querySelector('.get-awards').style.display = 'block'
            document.querySelector('.lottery-awards').style.display = 'block'
            document.querySelector('.award-ticket').style.display = 'block'
            document.querySelector('.lottery-awards-name').innerText = '演唱会门票一张'
            document.querySelector('.lottery-awards-name').style.display = 'block'

            currAward = 'ticket'
          } else if (res.data.awards === 'cd') {
            document.querySelector('.no-lottery').style.display = 'none'
            document.querySelector('.qrcode-area').style.display = 'none'

            document.querySelector('.get-awards').style.display = 'block'
            document.querySelector('.lottery-awards').style.display = 'block'
            document.querySelector('.award-cd').style.display = 'block'
            document.querySelector('.lottery-awards-name').innerText = '王心凌CD一张'
            document.querySelector('.lottery-awards-name').style.display = 'block'

            currAward = 'cd'
          } else if (res.data.awards === 'poster') {
            document.querySelector('.no-lottery').style.display = 'none'
            document.querySelector('.qrcode-area').style.display = 'none'

            document.querySelector('.get-awards').style.display = 'block'
            document.querySelector('.lottery-awards').style.display = 'block'
            document.querySelector('.award-poster').style.display = 'block'
            document.querySelector('.lottery-awards-name').innerText = '演唱会海报一张'
            document.querySelector('.lottery-awards-name').style.display = 'block'

            currAward = 'poster'
          }
        } else {
          alert(res.data)
        }
        document.querySelector('.lottery-mask').style.display = 'none'
      }
    )
  })

  document.querySelector('.get-awards').addEventListener('click', function() {
    document.querySelector('.get-awards').style.display = 'none'

    document.querySelector('.qrcode-area').style.display = 'block'
    document.querySelector('.awards-info').style.display = 'block'
    document.querySelector('.result-box').style.display = 'none'
    document.querySelector('.result-title').innerText = '领取奖品'

    if (currAward === 'poster') {
      document.querySelector('.info-address').style.display = 'none'
      document.querySelector('.get-address').style.display = 'block'
      document.querySelector('.get-tel').style.display = 'block'
    }
  })

  document.querySelector('.confirm-button').addEventListener('click', function() {
    const username = document.querySelector('.username').value
    const tel = document.querySelector('.tel').value
    const address = document.querySelector('.address').value

    if (username.length === 0 || username.trim() === '') {
      alert('姓名不能为空！')
    } else if (!/^\d{8,12}$/.test(tel)) {
      alert('电话号码不正确！')
    } else if (currAward !== 'poster' && (address.length === 0 || address.trim() === '')) {
      alert('地址不能为空！')
    } else {
      ajax.post(
        '/api/userinfos',
        {
          userKey: localstroage.getItem('userKey'),
          name: username,
          phone: tel,
          address: address
        },
        function (res) {
          if (typeof res !== 'Object') {
            res = JSON.parse(res)
          }
          console.log(res)
          if (res.status) {
            if (currAward === 'poster') {
              location.href = 'get-success.html#poster'
            } else {
              location.href = 'get-success.html'
            }
          } else {
            alert(res.data)
          }
        }
      )
    }
  })
}

if (typeof window.WeixinJSBridge == 'undefined') {
  document.addEventListener('WeixinJSBridgeReady', function() {
    loadLotteryEvent()
  })
} else {
  loadLotteryEvent()
}

