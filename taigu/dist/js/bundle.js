(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

console.log(axios);

var fetch = axios.create({
  baseURL: 'https://activity.youxiangtv.com'
});

var subBtn = document.querySelector('#submit');

var nameInput = document.querySelector('#name');
var noInput = document.querySelector('#no');
var emailInput = document.querySelector('#email');
var mobileInput = document.querySelector('#mobile');
var contentInput = document.querySelector('#content');

subBtn.addEventListener('click', function () {
  alert('报名已截止！');
  /*
  subBtn.disabled = true
   let nameInputValue = nameInput.value
  let noInputValue = noInput.value
  let emailInputValue = emailInput.value
  let mobileInputValue = mobileInput.value
  let contentInputValue = contentInput.value
   if (nameInputValue === '' || noInputValue === '' || emailInputValue === '' || mobileInputValue === '' || contentInputValue === '') {
    alert('字段不能为空!')
    subBtn.disabled = false
    return
  }
  // if (!isEmail(emailInputValue)) {
  //    alert("您输入的邮箱有误,请重新核对后再输入!")
  // }
  if (flag === true) {
    let data = {
      name: nameInputValue,
      no: +noInputValue,
      email: emailInputValue,
      mobile: mobileInputValue,
      content: contentInputValue,
    }
    // data: {
    //   name: '', // 姓名
    //   no: 12222, // 工号
    //   email: '', // 公司邮箱
    //   mobile: '', // 联系方式
    //   content: '', // 入门理由
    // }
    console.log(data)
    fetch.post('/api/taigumail', data).then(res =>
      console.log(res)
      if (res.result.restatus) {
        alert('报名成功！')
        flag = false
      } else {
        alert('请输入完整信息！')
      }
    }).catch(err => {
      alert(err)
      subBtn.disabled = false
    })
  } else {
    nameInput.value = ''
    noInput.value = ''
    emailInput.value = ''
    mobileInput.value = ''
    contentInput.value = ''
    alert('您已报名！')
  }
  */
});

// 报名成功
// return: {
//   status: true,
//   data: {}
// }
// // 错误时
// return: {
//   status: false,
//   data: '请输入完整信息'
// }

})));
//# sourceMappingURL=bundle.js.map
