/**
 * Created by yiming on 2017/6/2.
 */
var express = require('express');
var router = express.Router();

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
  next();
  console.log('Time: ', Date.now());

});
// 定义网站主页的路由
router.get('/', function(req, res) {
  console.log('22222')
  res.send('Birds home page');
});
// 定义 about 页面的路由
router.get('/about', function(req, res) {
  res.send('About birds');
});

var app = express()
app.use('/birds', router);

app.listen(3000)