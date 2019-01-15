// job/record/record.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    userInfo: app.globalData.userInfo,
    p: 1,
    data: [],
    prompt_msg: '没有更多了',
    prompt_display: 'none',
    width: '',
    height: '',
    noData: false,
    hasData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // if (!app.reuser()) {
    //   return;
    // }
    var mythis = this
    var userInfo = wx.getStorageSync('userInfo')
    wx.showLoading({
      title: '加载中...',
    })
    mythis.setData({
      width: wx.getSystemInfoSync().windowWidth,
      height: wx.getSystemInfoSync().windowHeight,
      userInfo: userInfo
    })
    mythis.getManageList()
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
    var mythis = this;
    this.setData({
      p: mythis.data.p + 1,
    })
    mythis.onLoad()
  },


  showresume: function (res) {
    var mythis = this
    var userid = res.currentTarget.dataset.userid
    var delivery_id = res.currentTarget.dataset.delivery_id
    var index = res.currentTarget.dataset.index
    var userInfo = mythis.data.userInfo
    wx.navigateTo({
      url: '../resumeDetail/resumeDetail?userid=' + userid,
      success: function (res) {
        //改变为已查看
        //发起网络请求登录
        wx.request({
          url: app.globalData.apiurl + 'Position/changestatus.html',
          method: 'get',
          dataType: 'json',
          data: {
            validation: app.globalData.validation,//验证
            user_id: userInfo.user_id,
            delivery_id: delivery_id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            //请求成功
            var data = mythis.data.data;
            var data2 = [];
            for (var i in data) {
              if (i == index) {
                data2[i] = data[i];
                data2[i].status = '已查看';
                data2[i].status2 = 1;
              } else {
                data2[i] = data[i];
              }
            }
            mythis.setData({
              data: data2
            })
          },
          fail: function (res) {
            //请求失败
            app.showNetworkError()
          }
        })
        wx.hideLoading()
      }
    })
  },
  // 请求管理列表
  getManageList: function () {
    var mythis = this
    var userInfo = mythis.data.userInfo
    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Position/management.html',
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
            mythis.setData({
              noData: false,
              hasData: true
            })
            var data = mythis.data.data;
            var top = 36;
            for (var index in res.data.data) {
              data.push(res.data.data[index]);
            }
            mythis.setData({
              data: data
            })
          wx.hideLoading();
        } else {
          mythis.setData({
            noData: true,
            hasData: false
          })
          wx.hideLoading()
        }

      },
      fail: function (res) {
        //请求失败
        app.showNetworkError()
        wx.hideLoading()
      }
    })
  }
})