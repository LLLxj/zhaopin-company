const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textlen: 0,
    text: '',
    title: '',
    m: '',
    disButton: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


  textchange: function (event) {
    //个人简介
    var mythis = this;
    mythis.setData({
      textlen: event.detail.cursor
    })
  },
  formSubmit: function (res) {
    var mythis = this
    var data = res.detail.value
    if (!data.opinion) {
      app.showErrorMsg('请填写反馈问题'); return;
    }
    if (data.opinion.length < 10) {
      wx.showToast({
        title: '反馈问题不能小于10个字符',
        icon: 'none',
        duration: 2000
      })
      return;

    }
    if (!data.contact) {
      app.showErrorMsg('请填写联系方式'); return;
    }
    if (!app.globalData.mobile.test(data.contact) && !app.globalData.email.test(data.contact)) {
      app.showErrorMsg('联系方式格式错误！'); return;
    }


    wx.showLoading({
      title: '提交中...',
    })
    var userInfo = mythis.data.userInfo
    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Feedback/index.html',
      method: 'POST',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: userInfo.user_id,
        data: data
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          app.showsuccessMsg(res.data.msg)
          wx.navigateBack()
        } else {
          app.showErrorMsg(res.data.msg)
        }

      },
      fail: function (res) {
        //请求失败
        app.showNetworkError()
      },
      complete: function () {
        wx.hideLoading()
      }
    })


  }
})