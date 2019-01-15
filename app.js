//app.js
App({
  onLaunch: function () {
    var mythis = this;
    var userInfo = wx.getStorageSync('userInfo');
    mythis.globalData.userInfo = userInfo;
    // console.log(userInfo)
  },
  typedetection: function () {
    var mythis = this;
    var userInfo = this.globalData.userInfo;
    if (userInfo) {
      //发起网络请求登录
      wx.request({
        url: mythis.globalData.apiurl + 'User/getUserTtype.html',
        method: 'get',
        dataType: 'json',
        data: {
          validation: mythis.globalData.validation,//验证
          user_id: userInfo.user_id,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          //请求成功
          if (res.data.code == 200) {
            console.log(res)
            var utype = res.data.utype;
            if (utype == 2) {
              userInfo.utype == utype
              // wx.redirectTo({
              //   url: '../personCenter/personCenter'
              // })
            }

          } else {
          }

        },
        fail: function (res) {
          //请求失败
          app.showNetworkError();
          wx.removeStorageSync('userinfo');
        }
      })
    }

  },
  reuser: function () {
    // //如果没有登录跳转到user
    // console.log(this.globalData.userInfo)
    // if (!this.globalData.userInfo) {
    //   // 跳转到登录
    //   wx.navigateTo({
    //     url: '../mobile/mobile',
    //   })
    //   // this.showErrorMsg('请登录！');
    //   // return;
    // }
    // // return 1;

  },

  // onShow: function () {

  //   //登录后 如果没有绑定手机 跳转到绑定手机页面
  //   if (this.globalData.userInfo) {
  //     if (!this.globalData.userInfo.mobile) {
  //       setTimeout(function () {
  //         wx.redirectTo({
  //           url: '../mobile/mobile'
  //         })
  //       }, 1000)
  //     }


  //   }
  // },
  globalData: {
    userInfo: null,
    islogin: false,
    validation: 'kc5RyOttNzNsfPSxSvSANQCM7S3GffgBnDxbNbXXH3YYkObtV4Apo5EBPo4R1sn8',
    domain: "https://zhaopin.heigrace.com",
    iconpath: "https://zhaopin.heigrace.com/public/static/xiaochengxu/icon/",
    apiurl: 'https://zhaopin.heigrace.com/xcx/',
    alert: null,
    mobile: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  },
  showErrorMsg: function (msg) {
    wx.showToast({
      title: msg,
      // icon: 'success',
      image: '../../images/loginerror.png',
      duration: 3000
    })
  },
  showsuccessMsg: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 2000
    })
  },
  showNetworkError: function () {
    wx.showToast({
      title: '网络异常',
      // icon: 'success',
      image: '../../images/loginerror.png',
      duration: 3000
    })
    setTimeout(function () {
      wx.switchTab({
        url: '../personCenter/personCenter',
      })
    }, 3000)

  }
})