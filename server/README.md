### 接口

####6.12 龙虾节
##### 获取中奖信息
```javascript
url: /lobster/rewards_info,
method: 'get',
return: {
  status: true,
  data: [{
    telephone: 123840435,
    name: '',
    time: '',
    awards:''
  }]
}
```
#####获取中奖次数
```javascript
url: /lobster/rewards_num,
method: 'get',
return: {
  status: true,
  rewards_num: 3
}
```
##### 铭牌人数
```javascript
url: /lobster/nameplate,
method: 'get',
return: {
  status: true,
  data: [{
    id: '',
    name: '',
    imgUrl: '',
    number: 122
  }]
}
```
##### 投票，增加铭牌人数
```javascript
url: /lobster/nameplate,
method: 'post',
data: {
    id: 443
},
return: {
  status: true,
  vote_num: 0  //投过了几票，默认是0
  rewards_num: 0 //还有几次抽奖机会
}
```

#####抽奖
```javascript
url: /lobster/lottery,
method: 'post',
return: {
  status: true, // false, 直接读取data返回字符串展示
  data: {
    awards: 'none', // 0 1 2 3 4  0对应特等奖，数字分别代表相应奖项（1-一等奖）
    rewards_num: 0   //抽奖次数，  和awards只有一个会出现；正常应该为0
  }
}

```
##### 用户信息
```javascript
url: /lobster/userinfos,
method: 'post',
data: {
  name: 'aaa',
  phone: 13939393939,
  address: ''
},
return: {
  status: true, // false, 直接读取data返回字符串展示
  data: 'ok' || 'invalid' || err  ok代表输入成功，invalid代表该session不是有效的中奖者
}
```

##### 微博

```javascript
url: /lobster/weibo,
method: 'get',
return: {
  status: true, // false, 直接读取data返回字符串展示
  data: [{
    nickName: '',
    time: '',
    content: ''
  }]
}
```


####6.12之前接口

##### 获取在线人数
```javascript
url: /api/online,
method: 'get',
return: {
  status: 'success',
  data: 1000 // 在线人数
}
```

##### 获取点赞的数量
```javascript
url: /api/countlove,
method: 'get',
return: {
  status: 'success',
  data: 40 // 数量
}
```

##### 点赞
```javascript
url: /api/countlove,
method: 'post',
return: {
  status: 'success',
  data: 41 // 点赞后的数量
}
```



### 抽奖活动

##### 活动结束或奖品抽完

```javascript
url: /api/finished
method: 'get'
return: {
  status: true,
  data: true // 活动已结束，false: 活动未结束
}
```

##### 抽奖

```javascript
url: /api/lottery,
method: 'post',
data: {
  userKey: '****', // 字符串
},
return: {
  status: true, // false, 直接读取data返回字符串展示
  data: {
    awards: 'none', // ticket, cd, poster
  }
}

```

##### 用户信息

```javascript
url: /api/userinfos,
method: 'post',
data: {
  userKey: '****',
  name: 'aaa',
  phone: 13939393939, 
  address: '', // 字符串
},
return: {
  status: true, // false, 直接读取data返回字符串展示
  data: {}
}
```

