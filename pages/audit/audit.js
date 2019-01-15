const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    msg: '企业认证大概需要2~3天时间，请耐心等候',
    statusmsg: '审核中',
    status: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mythis = this;
    wx.showLoading({
      title: '加载中...',
    })

    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Company/status2.html',
      method: 'get',
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
          var data = res.data.data;
          if (data.status == 4) {
            var statusmsg = '审核中';
            var msg = '企业认证大概需要2~3天时间，请耐心等候';
          } else if (data.status == 6) {
            var statusmsg = '通过审核';
            var msg = '审核已通过,正在跳转到企业端...';
          }
          mythis.setData({
            msg: msg,
            statusmsg: statusmsg,
            status: res.data.data.status
          })
          if (data.status == 5) {
            // setTimeout(function () {
              // wx.switchTab({
              //   url: '../personCenter/personCenter',
              // })
            // }, 3000)
          }
          if (data.status == 6) {
            setTimeout(function () {
              wx.redirectTo({
                url: '../personCenter/personCenter'
              })
            }, 3000);
          }

        } else {
          app.showErrorMsg('加载失败')
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
    var mythis = this
    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Company/status2.html',
      method: 'get',
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
          console.log(res)
          var data = res.data.data;
          if (data.status == 4) {
            var statusmsg = '审核中';
            var msg = '企业认证大概需要2~3天时间，请耐心等候';
          } else if (data.status == 5) {
            var statusmsg = '审核未通过';
            var msg = data.msg;
          } else if (data.status == 6) {
            var statusmsg = '通过审核';
            var msg = '审核已通过,正在跳转到企业端...';
          }
          mythis.setData({
            msg: msg,
            statusmsg: statusmsg
          })
          if (data.status == 5) {
            // setTimeout(function () {
            // wx.switchTab({
            //   url: '../personCenter/personCenter',
            // })
            // }, 3000)
          }
          if (data.status == 6) {
            setTimeout(function () {
              wx.redirectTo({
                url: '../personCenter/personCenter'
              })
            }, 3000);
          }

        } else {
          app.showErrorMsg('加载失败')
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
  // 重新验证
  again () {
    wx.request({
      url: app.globalData.apiurl + 'Company/changeStatus.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
        status: '0'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '../certification1/certification1',
          })
          wx.hideLoading()

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();
        wx.hideLoading()
      }
    })
    
  },
  // 放弃验证
  fangqi: function () {
    wx.switchTab({
      url: '../personCenter/personCenter',
    })
  }


})