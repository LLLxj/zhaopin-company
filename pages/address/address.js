const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textlen: 0,
    addlist: [],
    address: '',
    index: '',
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var mythis = this
    var userInfo = wx.getStorageSync('userInfo')
    mythis.setData({
      userInfo: userInfo
    })
    wx.showLoading({
      title: '加载中...',
    })

    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Position/address.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: userInfo.user_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          mythis.setData({
            address: res.data.data.address
          })
        }
        wx.hideLoading()
      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();
        wx.hideLoading()
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  textchange: function (event) {
    //个人简介
    var mythis = this;
    mythis.setData({
      textlen: event.detail.cursor
    })
  }, 
  getprompt: function (res) {
    this.setData({
      address: res.detail.value
    })
  },
  formSubmit: function (res) {
    if (!this.data.address) {
      app.showErrorMsg('请填写地址'); return;
    }
    var mythis = this
    var address = mythis.data.address
    wx.showLoading({
      title: '提交中...',
    })
    var userInfo = mythis.data.userInfo
    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Position/address.html',
      method: 'POST',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: userInfo.user_id,
        address: address
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          app.showsuccessMsg(res.data.msg);
          wx.navigateBack();

        } else {
          // app.showErrorMsg(res.data.msg)
        }
        wx.hideLoading()
      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();
        wx.hideLoading()
      }
    })
  }
})