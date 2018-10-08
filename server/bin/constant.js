/**
 * Created by yiming on 2017/6/2.
 */

var express = require('express')
var app = express()
//6.12龙虾节要用常量
const ENDDATE = '2017-6-9 23:59:59'
// 'page-mongodb-prod:JydG3PK6RsvRC2rz2alSkXtmOMKDWMFhqgHO7AcK3Hqq9srjLjH6cd4ThVzGcv0LdNHqRaz4GiOpYkGi4WdtMg==@page-mongodb-prod.documents.azure.cn:10250/activities?ssl=true'
// let DBURL = 'mongodb://maoyj:maoyj@dds-uf68545c99e884a42.mongodb.rds.aliyuncs.com:3717,dds-uf68545c99e884a41.mongodb.rds.aliyuncs.com:3717/activities?replicaSet=mgset-3525651'
let DBURL = 'page-mongodb-prod:JydG3PK6RsvRC2rz2alSkXtmOMKDWMFhqgHO7AcK3Hqq9srjLjH6cd4ThVzGcv0LdNHqRaz4GiOpYkGi4WdtMg==@page-mongodb-prod.documents.azure.cn:10250/activities?ssl=true'
if (app.get('env') === 'development') {
  DBURL = 'mongodb://localhost/activities'
  // DBURL = 'page-mongodb-prod:JydG3PK6RsvRC2rz2alSkXtmOMKDWMFhqgHO7AcK3Hqq9srjLjH6cd4ThVzGcv0LdNHqRaz4GiOpYkGi4WdtMg==@page-mongodb-prod.documents.azure.cn:10250/activities?ssl=true'
}
const VOTELIMIT = 3
const REWARD_HOUR = 15

module.exports = {
  ENDDATE,
  DBURL,
  VOTELIMIT,
  REWARD_HOUR
}
