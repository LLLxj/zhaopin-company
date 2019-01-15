
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    iconpath: app.globalData.iconpath,
    other: [],
    club_list: [],
    p: 1,
    prompt_msg: '没有更多了',
    prompt_display: 'block',
    domain: app.globalData.domain,
    userInfo: app.globalData.userInfo,
    // 判断认证是否通过
    pass_vali: [],
    status: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userInfo
    })
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
    var mythis = this
    mythis.getComStatus()
    mythis.getClubList()
  },
  // 获得俱乐部信息
  getClubList: function() {
    var mythis = this
    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Club/index.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        p: mythis.data.p
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          var data = mythis.data.data
          if (res.data.data) {
            mythis.setData({
              p: mythis.data.p + 1
            })
          }
          for (var index in res.data.data) {
            data.push(res.data.data[index])
          }
          mythis.setData({
            data: data,
          })
          if (res.data.prompt) {
            mythis.setData({
              prompt_msg: res.data.prompt,
              prompt_display: 'block'
            })
          }
        } else {
          // app.showErrorMsg(res.data.msg)
          mythis.setData({
            prompt_msg: res.data.msg,
            prompt_display: 'block'

          })
        }
      },
      fail: function (res) {
        //请求失败
        app.showNetworkError()
      }
    })
  },
  // 获取认证状态
  getComStatus: function () {
    var mythis = this
    var userInfo = mythis.data.userInfo
    // 获取认证状态
    wx.request({
      url: app.globalData.apiurl + 'Company/status.html',
      method: 'GET',
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
    var mythis = this
    mythis.setData({
      p:1,
      data: [],
    })
    mythis.getClubList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var mythis = this;
    mythis.onShow()
  },

  // 未登录提示
  // 验证是否登录
  toLogin: function() {
    wx.showToast({
      title: '请先登录',
      // icon: 'success',
      image: '../../images/loginerror.png',
      duration: 1500
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  to_club_info: function (res) {
    var id = res.currentTarget.dataset.id
    var status = this.data.status
    if (status == 0 || status == 1 || status == 2){
      wx.navigateTo({
        url: '../auditerror/auditerror',
      })
    } 
    if(status == 6) {
      wx.navigateTo({
        url: '../clubDetail/clubDetail?id=' + id,
      })
    }
    if (status == 5 || status == 4 || status == 3) {
      wx.navigateTo({
        url: '../audit/audit',
      })
    }  
    
  },
  talent: function (res) {
    wx.switchTab({
      url: '../talent/talent',
    })
  },
  clubList: function (res) {
    wx.switchTab({
      url: '../club/club',
    })
  },
  user: function (res) {
    wx.redirectTo({
      url: '../personCenter/personCenter',
    })
  },
})