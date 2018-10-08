/**
 * Created by yiming on 2017/6/1.
 */
const express = require('express')
const mongojs = require('mongojs')
const {ENDDATE, DBURL, VOTELIMIT, REWARD_HOUR} = require('./bin/constant')

const router = express.Router()
const dbUrl = DBURL;
const db = mongojs(dbUrl)

router.use(function timeLog(req, res, next) {
  next();
  console.log('Time: ', Date.now());
});
//刚进入，在数据库找这个session；

//找到的话，与上次时间对比；更新时间，更新投票次数
//投票机会只有三次

//没找到的话保存
//点击查看，找到session；增加抽奖机会
//接口返回当前session拥有的抽奖机会

//准备抽奖，拿当前session判断是否还有抽奖机会
//抽完奖，减少抽奖机会，如果中奖；在这个session中加入中奖的产品id，中多个奖的话；前一个会被覆盖(正常应该分两个表)
//提交用户信息，在数据库比对；看是否中奖
// router.use('/rewards_num', (req, res, next) => {
router.use((req, res, next) => {
  let sessionID = req.sessionID
  findSession(sessionID)
    .then( session => {
      if(!session){
        console.log('创建session')
        console.log(sessionID)
        return createSession(sessionID)
          .then(next)
      } else {
        console.log('已有session')
        console.log(sessionID)
        if(new Date(session.time).getDate() > new Date().getDate()){
          console.log("更新session时间及投票次数")
          updateSessionTime(sessionID)
            .then(() => updateSessionVoteNum(sessionID))
        }
        next()
      }
    })
    .catch( err => {
      console.error(err)
      dealResData(res, err)
    })
})



const addWardToSession = function(sessionID, leavel){
  return findSession(sessionID)
     .then((session) => {
      console.log(sessionID)
       db
         .lobster_seesions
         .update(
           {session_id: String(sessionID)},
           // {$inc: {award_leavel: 1}}
           {$set: {award_leavel: String(leavel)}}
         )
     })
}

const addChance = function(sessionID){
  return new Promise( (resolve, reject) => {
    db
      .lobster_seesions
      .update(
        { session_id: String(sessionID)},
        { $inc: {rewards_num: 1}},
        resolve
      )
  })
}

const reduceChance = function(sessionID){
  return new Promise( (resolve, reject) => {
    db
      .lobster_seesions
      .update(
        { session_id: String(sessionID) },
        { $inc: {rewards_num: -1}},
        resolve
      )
  })
}

const addVoteNum = (sessionID) => {
  return new Promise( (resolve, reject) => {
    db
      .lobster_seesions
      .update(
        { session_id: String(sessionID) },
        { $inc: {vote_num: 1}},
        resolve
      )
  })
}

const findSession = function(sessionID){
  return new Promise( (resolve, reject) => {
    db.lobster_seesions.findOne({session_id: String(sessionID)}, (err, session) => {
      if(err){
        reject(err)
      } else {
        resolve(session)
      }
    })
  })
}

const updateSessionTime = function(sessionID){
  return new Promise( (resolve, reject) => {
    db
      .lobster_seesions
      .update(
        { session_id: String(sessionID)},
        { $set: {time: Date.now()}},
        resolve
      )
  })
}

const updateSessionVoteNum = (sesssionID) => {
  return new Promise( (resolve, reject) => {
    db
      .lobster_seesions
      .update(
        { session_id: String(sessionID)},
        { $set: {vote_num: 0}},
        resolve
      )
  })
}


const createSession = function(sessionID) {
  return new Promise( (resolve, reject) => {
    db.lobster_seesions.save({
      session_id: String(sessionID),
      time: Date.now(),
      rewards_num: 0,
      award_leavel: 'none',
      vote_num: 0
    },
    resolve)
  })
}

const dealResData = function(res, err, data) {
  if(err){
    res.json({
      status: false,
      data: err
    })
  } else {
    res.json({
      status: true,
      data
    })
  }
}

const validateRequreData = function(data, ...args) {
  for(let value of args){
    if(!data[value]){
      return `${value}不存在`
    }
  }
  return true
}


router.get('/rewards_info', (req, res) => {
  db.lobster_user_infos.find().toArray((err, infos) => {
    let newInfos = infos.map( info => {
      let phone = String(info.phone)
      let preString = phone.slice(0, 3)
      let lastString = phone.slice(7 ,11)
      info.phone = preString + '****' + lastString;
      return info
    })
    dealResData(res, null, newInfos)
  })
})

router.get('/rewards_num', (req, res) => {
  let sessionID = req.sessionID;
  console.log(sessionID);
  findSession(sessionID)
    .then( session => {
      res.json({
        status: true,
        rewards_num: session.rewards_num,
        vote_num: session.vote_num
      })
    })
    .catch( err => {
      console.error(err)
    })
})

router.post('/userinfos', (req, res) => {
  let data = req.body;
  let sessionID = req.sessionID;

  let validateMsg = validateRequreData(data, 'name','phone','address')
  if(typeof validateMsg !== 'boolean' && validateMsg){
    return dealResData(res, validateMsg)
  }
  findSession(sessionID)
    .then(session => {
      const award_leavel = session ? session.award_leavel : false;
      if(award_leavel && award_leavel !== 'none'){
        let time = Date.now();
        data.time = time;
        console.log('award_leavel' + award_leavel)
        data.awards = award_leavel;
        db.lobster_user_infos.save(data, (err, user) => {
          dealResData(res, null, 'ok')
        })
      } else {
        dealResData(res, null, 'invalid')
      }
    })
    .catch( err => {
      dealResData(res, null, 'invalid')
    })
})
router.get('/nameplate', (req, res) => {
  db.lobster_nameplates.find().map(
    (nameplate) => {
      let newData = nameplate;
      newData.id = nameplate._id;
      delete newData._id;
      return newData
    },
    dealResData.bind(null, res)
  )
})

router.post('/nameplate', (req, res) => {
  let id = req.body.id,
      sessionID = req.sessionID;
  findSession(sessionID)
    .then( session => {
      if(session.vote_num < VOTELIMIT){
        addVoteNum(sessionID)
          .then( () => {
            addChance(sessionID)
              .then( () => {
                db.lobster_nameplates.update({_id: mongojs.ObjectId(id)}, {$inc: {number: 1}}, {multi: true}, () => {
                  res.json({
                    status: true,
                    vote_num: session.vote_num + 1,
                    rewards_num: session.rewards_num + 1
                  })
                })
              })
              .catch( err => {
                dealResData(res, err)
              })
          })
      } else {
        res.json({
          status: true,
          vote_num: session.vote_num,
          rewards_num: session.rewards_num
        })
      }
    })
})

router.get('/weibo', (req, res) => {
  db.lobster_webo.find().toArray(dealResData.bind(null, res))
})

router.post('/lottery', (req, res) => {
  const sessionID = req.sessionID;
  //有没有方法使用promise，然后找到后还直接减少
  findSession(sessionID)
    .then( session => {
      let rewards_num = session.rewards_num
      if(rewards_num < 1){
        dealResData(res, null, {
          awards: 'none',
          rewards_num: rewards_num
        })
      } else {
        reduceChance(sessionID)
          .then( () => {
            if (isAward(REWARD_HOUR) && session.award_leavel === 'none') {
              return getAwards()
                .then((awards) => {
                  let rewardLeavel = 100
                  let awardTodayRemainings = awards.map(getTodayRemining);
                  awardTodayRemainings.forEach(awardTodayRemaining => {
                    if (awardTodayRemaining.todayRemining > 0) {
                      rewardLeavel = awardTodayRemaining.awardLeavel
                    }
                  })
                  if (rewardLeavel >= 100) {
                    dealAwardFalse(res, rewards_num - 1)
                  } else {
                    let reward = null;
                    for (let award of awards) {
                      if (award.award_leavel === rewardLeavel) {
                        reward = award;
                        break;
                      }
                    }
                    //修改数据库发送奖励信息
                    return Promise.all([
                      reduceAwardRemining(reward),
                      addWardToSession(sessionID, reward.award_leavel)
                    ])
                      .then(() => {
                        console.log("rewards_num:" + rewards_num)
                        res.json({
                          status: true,
                          data: {
                            awards: rewardLeavel,
                            rewards_num: rewards_num - 1
                          }
                        })
                      })
                  }
                })
                .catch( err => {
                  console.error(err)
                })
              //有抽奖次数但没有中奖
            } else {
              dealAwardFalse(res, rewards_num - 1)
            }
          })
      }
    })
    .catch(err => {
      dealResData(res, err)
    })
})

const dealAwardFalse = function(res, rewards_num){
  return res.json({
    status: true,
    data: {
      awards: 'none',
      rewards_num
    }
  })
}
const getTodayRemining = function(award){
  var curDate = new Date();
  var endDate = new Date(ENDDATE);
  let diffDate = endDate.getDate() - curDate.getDate();
  let shouldRemining = 0;
  switch(Number(award.award_leavel)){
    case 0:
    case 1:
      shouldRemining = diffDate;
      break;
    case 2:
      if(diffDate > 1){
        shouldRemining = 2 * 2 + ( diffDate - 2) * 3
      } else {
        shouldRemining = 2 * diffDate
      }
      break;
    case 3:
      shouldRemining = diffDate * 5;
      break;
    case 4:
      shouldRemining = diffDate * 10;
      break;
  }
  return {
    awardLeavel: award.award_leavel,
    todayRemining: award.remaining - shouldRemining
  }
}
const reduceAwardRemining = function(award){
  return new Promise((resolve, reject) => {
    db.lobster_awards.update({_id: mongojs.ObjectId(award._id)}, {$inc: {remaining: -1}}, {multi: true}, resolve)
  })
}
//判断是否中奖，判断是否有奖品，
const isAward = function(hour) {
  // let randomNum = Math.floor(Math.random() * 100)
  // if(new Date().getHours() > hour) return randomNum
  // return 'none'
  if(new Date().getHours() > hour) return true
  return false
}

//从数据库拿到各个奖项的奖品
const getAwards = function() {
  return new Promise((resolve, reject) => {
    db.lobster_awards.find().toArray((err, awards) => {
      if(err){
        reject(err)
      } else {
        resolve(awards)
      }
    })
  })
}


module.exports = router