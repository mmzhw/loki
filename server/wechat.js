var express = require('express')
var request = require('request')
var co = require('co')
var sign = require('./sign.js')

var router = express.Router()

const APPID = 'wxc89ca66545c2df54'
const APPSECRET = '593590c860627f899debb69611cc3191'

router.post('/get_params', function (req, res) {
    var app = require('./app')
    var client = app.redisClient

    checkTicket(client).then(function (val) {
        var signData = sign(val.ticket, req.headers.referer)
        res.json(signData)
    }).catch(function (data) {
        res.json(data)
    })
})

function getAccessToken(client) {
    return new Promise(function (resolve, reject) {
        client.get('wechat_datas', function (err, reply) {
            resolve(JSON.parse(reply))
        })
    })
}

function checkTicket(client) {
    return new Promise(function (resolve, reject) {
        client.get('wechat_datas', function (err, reply) {
            if (reply) {
                var data = JSON.parse(reply)
                var expire = data.expire_time
                var time = new Date().getTime()
                if (expire > time) {
                    console.log('not request')
                    resolve({ticket: data.ticket, expire})
                } else {
                    setTicket(client).then(function (val) {
                        resolve({
                            ticket: val.ticket,
                            status: true
                        })
                    })
                }
            } else {
                setTicket(client).then(function (val) {
                    resolve({
                        ticket: val.ticket,
                        status: true
                    })
                })
            }
        })
    })
}

function setTicket(client) {
    console.log('request ticket')
    return new Promise(function (resolve, reject) {
        request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`, function (err, rep, body) {
            var data = JSON.parse(body)
            var time = new Date().getTime()
            data.expire_time = time + 3600000
            request(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${data.access_token}&type=jsapi`, function (err, rep, atBody) {
                var atBodyJson = JSON.parse(atBody)
                data.ticket = atBodyJson.ticket
                client.set('wechat_datas', JSON.stringify(data))
                resolve(data)
            })
        })
    })
}

module.exports = router

