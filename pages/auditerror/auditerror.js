const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    msg: '企业认证大概需要2~3天时间，请耐心等候',
    statusmsg: '审核中',
    userInfo: app.globalData.userInfo,
    status: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getComStatus()
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
    this.getComStatus()
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
  // 获取认证状态
  getComStatus: function () {
    var mythis = this
    // 获取认证状态
    wx.request({
      url: app.globalData.apiurl + 'Company/status.html',
      method: 'GET',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          mythis.setData({
            status: res.data.data.status
          })
        } else {
          // app.showErrorMsg('加载失败')
        }
      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();
        wx.hideLoading()
      }
    })
  },
  again: function (res) {
    //重新认证
    var mythis = this;
    var status = mythis.data.status
    if(status == 0){
      wx.navigateTo({
        url: '../certification1/certification1'
      })
    }
    if(status == 1){
      wx.navigateTo({
        url: '../certification2/certification2'
      })
    }
    if (status == 2) {
      wx.navigateTo({
        url: '../certification3/certification3'
      })
    }
   

    //发起网络请求登录
    // wx.request({
    //   url: app.globalData.apiurl + 'Company/changeStatus.html',
    //   method: 'get',
    //   dataType: 'json',
    //   data: {
    //     validation: app.globalData.validation,//验证
    //     user_id: app.globalData.userInfo.user_id,
    //     status: '1'
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res)
    //     //请求成功
    //     if (res.data.code == 200) {
    //       wx.redirectTo({
    //         url: '../certification1/certification1'
    //       })
    //       wx.hideLoading()

    //     } else {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     }
    //     setTimeout(function () {
    //       wx.hideLoading()
    //     }, 1000)
    //   },
    //   fail: function (res) {
    //     //请求失败
    //     app.showNetworkError();
    //     wx.hideLoading()
    //   }
    // })

  },
  fangqi: function (res) {
    wx.switchTab({
      url: '../personCenter/personCenter',
    })
  }
})