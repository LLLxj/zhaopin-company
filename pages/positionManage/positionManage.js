//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    iconpath: app.globalData.iconpath,
    data: [],
    domain: app.globalData.domain,
    left: [],
    start: 0,
    center: 0,
    stop: 0,
    del: {},
    noData: false,
    hasData: false,
  },

  onLoad: function () {
    var mythis = this
    var userInfo = wx.getStorageSync('userInfo')
    mythis.setData({
      userInfo: userInfo
    })
    if (!app.reuser()) {
      return;
    }
    
  },
  onShow: function () {
    var mythis = this;
    //发起网络请求登录
    mythis.getPositionList()
  },
  
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  loadfile: function (e) {

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
      }
    })
  },
  again: function (res) {
    wx.navigateTo({
      url: '../release/release',
    })
  },
  reeditor: function (res) {
    var id = res.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../release/release?recruitment_id=' + id,
    })
  },
  touchS: function (res) {
    // console.log(res.currentTarget.id)

    this.setData({
      start: res.changedTouches[0].clientX
    })
  },
  touchM: function (res) {
    var id = res.currentTarget.id;
    var left = this.data.left;
    var left2 = [];
    for (var index in left) {
      if (index == id) {
        left2[index] = left[index] + 4
      } else {
        left2[index] = left[index]
      }
    }
    this.setData({
      left: left2
    })
  },
  touchE: function (res) {
    var id = res.currentTarget.id;
    this.setData({
      stop: res.changedTouches[0].clientX
    })
    if (this.data.start - 100 > this.data.stop) {
      var left = this.data.left;
      var left2 = [];
      for (var index in left) {
        if (index == id) {
          left2[index] = 185
        } else {
          left2[index] = left[index]
        }
      }
      this.setData({
        left: left2
      })
    } else {
      var left = this.data.left;
      var left2 = [];
      for (var index in left) {
        left2[index] = 0
      }
      this.setData({
        left: left2
      })
    }
  },
  del: function (res) {
    var id = res.target.dataset.id;
    var mythis = this;
    var userInfo = mythis.data.userInfo
    wx.showModal({
      title: '提示',
      content: '您确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
          })
          //发起网络请求登录
          wx.request({
            url: app.globalData.apiurl + 'Position/del.html',
            method: 'get',
            dataType: 'json',
            data: {
              validation: app.globalData.validation,//验证
              user_id: userInfo.user_id,
              id: id
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              //请求成功
              if (res.data.code == 200) {
                var del = mythis.data.del;
                var del2 = {}
                for (var index in del) {
                  if (index == id) {
                    del2[index] = 'none';
                  } else {
                    del2[index] = del[index]
                  }
                }
                mythis.setData({
                  del: del2
                })
                app.showsuccessMsg(res.data.msg);

              } else {
                console.log(mythis.data.data)
                app.showErrorMsg(res.data.msg);
              }
              wx.hideLoading()
            },
            fail: function (res) {
              //请求失败
              app.showNetworkError();
              wx.hideLoading()
            }
          })

        } else if (res.cancel) {

        }
      }
    })
  },
  // 获取职位管理列表
  getPositionList: function () {
    var mythis = this
    var userInfo = mythis.data.userInfo
    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Position/index.html',
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
          if(res.data.data.data.length == 0){
            mythis.setData({
              noData: true,
              hasData: false
            })
          }else{
            mythis.setData({
              noData: false,
              hasData: true
            })
            var left = [];
            for (var i = 0; i < res.data.data.data.length; i++) {
              left.push(0)
            }
            var del = {};
            for (var index in res.data.data.data) {
              // console.log(            )
              del[res.data.data.data[index].recruitment_id] = 'block';
            }
            mythis.setData({
              data: res.data.data,
              left: left,
              del: del
            })
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
  }
})
