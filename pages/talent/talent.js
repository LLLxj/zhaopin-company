// job/intention/intention.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    userInfo: app.globalData.userInfo,
    data: [],
    other: [],
    p: 1,
    domain: app.globalData.domain,
    prompt_msg: '没有更多了',
    prompt_display: 'none',
    adlist: [
      // { 'src': app.globalData.iconpath + 'jlbanner.gif' }
    ],
    status: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getComStatus()
    this.getad()
  },

  /**
   * 获取 人才列表信息
   */
  getData () {
    var mythis = this
    var userInfo = mythis.data.userInfo
    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Resume/talentlist.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: userInfo.user_id,
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
          mythis.setData({
            prompt_msg: res.data.msg,
            prompt_display: 'block'
          })

        }

      },
      fail: function (res) {
        //请求失败
        app.showNetworkError()
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData()
    var userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userInfo
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var mythis = this;
    mythis.onShow()
  },
  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    var mythis = this;
    mythis.setData({
      p: 1,
      data: [],
      prompt_display: 'none',
    })
    // 获取人才信息
    mythis.getData()
    mythis.getComStatus()
    wx.stopPullDownRefresh()
  },

  url: function (res) {
    var userid = res.currentTarget.dataset.userid
    var status = this.data.status
    if(status == 0 || status == 1 || status == 2){
      wx.navigateTo({
        url: '../auditerror/auditerror'
      })
    } 
    if(status == 6) {
      wx.navigateTo({
        url: '../resumeDetail/resumeDetail?userid=' + userid,
      })
    }
    if(status == 5 || status == 4 ||status == 3){
      wx.navigateTo({
        url: '../audit/audit'
      })
    }
    
  },
  getad: function () {
    var mythis = this
    var userInfo = mythis.data.userInfo
    //获取轮播图广告
    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Positionlist/companyad.html',
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
        console.log(res)
        //请求成功
        if (res.data.code == 200) {
          console.log(res)
          mythis.setData({
            adlist: res.data.data
          })
        }

      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();

      }
    })
  },
  clubList: function (res) {
    wx.switchTab({
      url: '../club/club',
    })
  },
  user: function (res) {
    wx.redirectTo({
      url: '../user/user',
    })
  },

  // 验证是否登录
  toLogin () {
    wx.showToast({
      title: '请先登录',
      // icon: 'success',
      image: '../../images/loginerror.png',
      duration: 1500
    })
  },
  jump: function (res) {
    var userid = res.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../resumeDetail/resumeDetail?userid=' + userid,
    })
  }
})