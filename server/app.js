var express = require('express')
var path = require('path')
var favicon = require('static-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var redis = require('redis')
var session = require('express-session')
var RedisStore = require('connect-redis')(session)
var mongojs = require('mongojs')
var aesjs = require('aes-js')
var nodemailer = require('nodemailer')

var wechatModule = require('./wechat')
var lobster = require('./lobster')

var { DBURL } = require('./bin/constant')

var app = express()

var db = mongojs(DBURL)
// var db = mongojs('page-mongodb-prod:JydG3PK6RsvRC2rz2alSkXtmOMKDWMFhqgHO7AcK3Hqq9srjLjH6cd4ThVzGcv0LdNHqRaz4GiOpYkGi4WdtMg==@page-mongodb-prod.documents.azure.cn:10250/activities?ssl=true')


var client = redis.createClient({
  host: '172.19.0.60',
  password: 'dx0210.com'

})
client.on("error", function(error) {
    console.log(error);
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(favicon())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
// app.use(cookieParser())
app.use(cookieParser('lobster'))
// app.use(express.static(path.join(__dirname, 'public')))

var redisSessionStore = new RedisStore({
  client: client,
  ttl: 1800
})

// app.use(session({
//   store: redisSessionStore,
//   secret: 'cyndiwants',
//   resave: false,
//   saveUninitialized: true,
// }))

app.use(session({
  // store: redisSessionStore,
  cookie: { path: '/', httpOnly: true, secure: false },
  secret: 'lobster',
  resave: false,
  saveUninitialized: true,
}))

if (app.get('env') === 'development') {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    // res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
  })
}

var router = express.Router()

router.get('/countlove', function(req, res) {
  client.get('love_mark', function(err, reply) {
    res.json({status: 'success', data: reply})
  })
})

router.get('/online', function(req, res){
  redisSessionStore.ids( function(err, arr) {
    res.json({status: 'success', data: arr.length})
  })
})

router.post('/countlove', function(req, res) {
  var count = 0
  client.get('love_mark', function(err, reply) {
    count = +reply + 1
    res.json({status: 'success', data: count})
    client.set('love_mark', count)
  })
})

/*
 * 送演唱会门票活动
 *
 * 抽奖
 * 10000人，奖品数量225
 * mongo collections:
 *    wxl_awards, // 奖品
 *    ticket: 10, cd: 20, poster: 200
 *    users, // 参与用户
 *    award_records, // 中奖领奖信息
 */
router.get('/finished', function(req, res) {
  if (new Date() >= new Date('2017-05-13')) {
    res.json({status: true, data: true})
    return
  }
  db.wxl_awards.count({amount: {$gt: 0}}, function (err, count){
    if (!count) {
      res.json({status: true, data: true})
    }
    else {
      res.json({status: true, data: false})
    }
  })
})

router.post('/lottery', function(req, res) {
  var amount = 10000
  var userKey = req.body.userKey
  if (!userKey) {
    res.json({status: false, data: '无效用户'})
    return
  }

  try {
    // aes-js: https://github.com/ricmoo/aes-js
    var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
    var encryptedBytes = aesjs.utils.hex.toBytes(userKey);
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    var uk = decodeURI(decryptedText)
  }
  catch (e) {
    res.json({status: false, data: '无效用户'})
    return
  }
  if (!uk.startsWith('呵呵') || uk.length !== 18) {
    res.json({status: false, data: '无效用户'})
    return
  }

  var awardsPromise = new Promise( function(resolve, reject) {
    db.wxl_awards.find({amount: {$gt: 0}}, function( err, docs) {
      if (docs.length === 0) {
        res.json({status: true, data: {
          awards: 'none'
        }})
        return
      } else {
        var awardsList = {}
        for(let i=0,j=docs.length; i<j; i++){
          awardsList[docs[i].award] = docs[i].amount
        }
        resolve(awardsList)
      }
    })
  })

  awardsPromise.then( function(awards) {
    db.users.findOne({
      userKey
    }, function (err, doc) {
      if (doc) {
        res.json({status: true, data: {
          awards: 'none'
        }})
        return
      } else {
        goLottery(awards)
      }
    })
  })

  function goLottery(awards) {
    var promise = new Promise( function(resolve, reject) {
      db.users.count({}, function (err, res){
        var random = Math.floor(Math.random() * (amount - res + 1))
        resolve(random)
      })
    })
    promise.then(function( value) {
      var allAwards = Array(230)
      var startIndex = 0
      for(let key in awards) {
        allAwards.fill(key, startIndex, awards[key])
        startIndex = awards[key]
      }

      if (allAwards[value]) {
        minusAward(allAwards[value])
        insertAwardInfo(allAwards[value])
        return
      }
      else {
        res.json({status: true, data: {
          awards: 'none'
        }})
        insertAwardInfo('none')
        return
      }
    })
  }

  function minusAward(award) {
    db.wxl_awards.findAndModify({
      query: { award },
      update: { $inc: { amount: -1 } },
    }, function (err, doc, lastErrorObject) {
      if (doc.amount >= 1) {
        res.json({status: true, data: {
          awards: award
        }})
      } else {
        res.json({status: true, data: {
          awards: 'none'
        }})
      }
    })
  }

  function insertAwardInfo(award) {
    db.users.insert({
      userKey,
      award,
      time: new Date().toLocaleString(),
      ua: req.headers['user-agent'],
      ip: req.ip
    })
  }
})

router.post('/userinfos', function(req, res) {
  var userKey = req.body.userKey
  if (!userKey) {
    res.json({status: false, data: '无效用户'})
    return
  }
  var phone = req.body.phone
  if (!phone || !/^1\d{10}$/.test(phone)) {
    res.json({status: false, data: '请正确输入手机号码'})
    return
  }
  var name = req.body.name
  if (!name) {
    res.json({status: false, data: '请输入姓名'})
    return
  }

  var promise = new Promise( function( resolve, reject) {
    db.users.findOne({
      userKey
    }, function (err, doc) {
      if (!doc) {
        res.json({status: false, data: '无效用户'})
        return
      }
      else {
        if (doc.award === 'none') {
          res.json({status: false, data: '您没有中奖哦'})
          return
        }
        resolve(doc)
      }
    })
  })

  promise.then( function(value) {
    var addr = req.body.address || ''
    if (['ticket', 'cd'].indexOf(value) > -1) {
      if (!addr) {
        res.json({status: false, data: '请填写有效地址'})
        return
      }
    }

    db.award_records.findOne({
      userKey
    }, function (err, doc) {
      if (doc) {
        res.json({status: false, data: '您已经填写过中奖信息，无需重复提交'})
        return
      }
      else {
        db.award_records.insert({
          userKey,
          award: value.award,
          name,
          phone,
          address: addr,
          time: new Date().toLocaleString(),
        })
        res.json({status: true, data: {}})
      }
    })
  })
})


router.post('/taigumail', function(req, res) {
  let name = req.body.name,
    no = req.body.no,
    email = req.body.email,
    mobile = req.body.mobile,
    content = req.body.content;
  if (!name || !no || !email || !mobile || !content) {
    res.json({status: false, data: '请输完整信息'})
    return
  }

  db.taigu.insert({
    name,
    no,
    email,
    mobile,
    content,
    time: new Date().toLocaleString(),
    ua: req.headers['user-agent'],
    ip: req.ip
  })

  // let transporter = nodemailer.createTransport({
  //   host: 'smtp.sohu.com',
  //   port: 465,
  //   secure: true, // secure:true for port 465, secure:false for port 587
  //   auth: {
  //     user: 'jctaigu@sohu.com',
  //     pass: 'jctaigu1212'
  //   }
  // });

  // // setup email data with unicode symbols
  // let mailOptions = {
  //     from: '太古报名<jctaigu@sohu.com>',
  //     to: 'maoyj@jcgroup.com.cn', // TODO:上线地址
  //     subject: '太古报名',
  //     html: `
  //       <p>姓名：${name}</p>
  //       <p>工号： ${no}</p>
  //       <p>公司邮箱：${email}</p>
  //       <p>联系方式：${mobile}</p>
  //       <p>入门理由：${content}</p>
  //     `
  // };

  // // send mail with defined transport object
  // transporter.sendMail(mailOptions, (error, info) => {
  //     if (error) {
  //         return console.log(error);
  //     }
  //     console.log('Message %s sent: %s', info.messageId, info.response);
  // });
  res.json({status: true, data: {}})
})

app.use('/api', router)
app.use('/wechat', wechatModule)
app.use('/lobster', lobster)

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
      message: err.message,
      error: {}
  })
})

module.exports = {
  redisClient: client,
  app
}

