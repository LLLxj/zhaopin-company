// job/record/record.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    userInfo: app.globalData.userInfo,
    validation: app.globalData.validation,
    count: '',
    width:'',
    height: '',
    showOrDisplay: false,
    tempUserInfo: '',
    status: '',
    code: '',
    user_id: '',
    hasRun: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var companyStatus = wx.getStorageSync('companyStatus');
    var userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userInfo
    })
    this.setData({
      width: wx.getSystemInfoSync().windowWidth,
      height: wx.getSystemInfoSync().windowHeight
    })
    this.getComStatus()
    if (app.globalData.userInfo) {
      this.realtime()
    }
    
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
    var hasRun = this.data.hasRun
    this.getResumeNum()
    if(hasRun == false){
      this.realtime()
    }
  },
  getResumeNum: function () {
    var mythis = this
    var userInfo = mythis.data.userInfo
    wx.request({
      url: app.globalData.apiurl + 'Position/realtime.html',
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
            count: res.data.data.count
          })
        }
      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();
        // wx.hideLoading();

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  certification: function () {

    this.getOpenId()
    var mythis = this
    var status = mythis.data.status
    if (status == 4 || status == 3 || status == 5) {
      //审核中
      wx.navigateTo({
        url: '../audit/audit'
      })
    }
    if (status == 6) {
      //认证通过
      app.showsuccessMsg('已认证')
    } 
    if (status == 0) {
      wx.navigateTo({
        url: '../certification1/certification1',
      })
    }
    if (status == 1) {
      wx.navigateTo({
        url: '../certification2/certification2',
      })
    }
    if (status == 2) {
      wx.navigateTo({
        url: '../certification3/certification3',
      })
    }
  },
  toLogin () {
    wx.showToast({
      title: '请先登录',
      // icon: 'success',
      image: '../../images/loginerror.png',
      duration: 1500
    })
  },
 
  onGotUserInfo: function (res) {
    var mythis = this
    if (res.detail.errMsg == "getUserInfo:ok") {
      //同意授权
      var userinfo = res.detail
      mythis.setData({
        tempUserInfo: userinfo,
        showOrDisplay: true
      })
    } else {
      //不同意授权
      mythis.setData({
        showOrDisplay: false
      })
    }
  },
  onGotUserInfo1: function (res) {
    var mythis = this
    var userInfo = mythis.data.userInfo
    if(!userInfo){
      this.toLogin
    }
    if (res.detail.errMsg == "getUserInfo:ok") {
      //同意授权
      // var userinfo = mythis.data.userInfo
      //获取code
      // wx.showLoading({
      //   title: '加载中',
      // })
      wx.login({
        success: function (res) {
          //调用登录接口成功
          if (res.errMsg == 'login:ok') {
            var code = res.code;
          }
          //发起网络请求登录
          wx.request({
            url: app.globalData.apiurl + 'Login/getOpenid.html',
            method: 'POST',
            dataType: 'json',
            data: {
              validation: app.globalData.validation,//验证
              code: code,
              user_id: userInfo.user_id
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              //请求成功
              if (res.data.code == 200) {
                //登录成功
                var status = mythis.data.status
                console.log(status)
                if (status == 4 || status == 3 || status == 5) {
                  //审核中
                  wx.navigateTo({
                    url: '../audit/audit'
                  })
                }
                if (status == 6) {
                  //认证通过
                  app.showsuccessMsg('已认证')
                }
                if (status == 0) {
                  wx.navigateTo({
                    url: '../certification1/certification1',
                  })
                }
                if (status == 1) {
                  wx.navigateTo({
                    url: '../certification2/certification2',
                  })
                }
                if (status == 2) {
                  wx.navigateTo({
                    url: '../certification3/certification3',
                  })
                }
              } else {
                //请求失败
                wx.showToast({
                  title: res.data.msg,
                  // icon: 'success',
                  image: '../../images/loginerror.png',
                  duration: 3000
                })
              }
            },
            fail: function (res) {             
            }

          })
        },
        fail: function (res) {
          //调用登录接口失败
          app.showNetworkError();
        }
      })
    } else {
      //不同意授权

    }
  },
  // 编辑个人信息
  reuserinfo: function () {
    wx.navigateTo({
      url: '../userinfo/userinfo',
    })
  },
  unlogin: function () {
    //退出登录
    var mythis = this;
    wx.showModal({
      title: '提示',
      content: '您确定要退出登录吗',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          mythis.setData({
            userInfo: null,
            status: '',
            count: 0
          })
          app.onLaunch();
        } else if (res.cancel) {
        }
      }
    })
    wx.closeSocket()
  },
  reposition: function () {
    var status = this.data.status
    if (status == 0 || status == 1 || status == 2) {
      wx.navigateTo({
        url: '../auditerror/auditerror',
      })
    } else if (status == 6) {
      //认证通过
      //跳转职位管理
      wx.navigateTo({
        url: '../positionManage/positionManage',
      })
    } else if (status == 5 || status == 4 || status == 3) {
      wx.navigateTo({
        url: '../audit/audit',
      })
    } 
    
  },
  management: function () {
    var status = this.data.status
    if (status == 0 || status == 1 || status == 2) {
      wx.navigateTo({
        url: '../auditerror/auditerror',
      })
    } else if (status == 6) {
      //认证通过
      //跳转职位管理
      wx.navigateTo({
        url: '../management/management',
      })
    } else if (status == 5 || status == 4 || status == 3) {
      wx.navigateTo({
        url: '../audit/audit',
      })
    } 
    
  },
  refeedback: function (res) {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  realtime: function () {
    var mythis = this;
    //实时获取新简历数量
    // var userInfo = wx.getStorageSync('userInfo')
    var userInfo = mythis.data.userInfo
    var userId = userInfo.userid
    if (userId) {
      wx.connectSocket({
        url: 'wss://zhaopin.heigrace.com/wss?userId=' + userId,
      })
      wx.onSocketMessage(function (res) {
        mythis.setData({
          count: res.data,
          hasRun: true
        })
      })
      wx.onSocketClose(function(res){
        mythis.setData({
          hasRun: false
        })
      })
    
    }
  },
  getPhoneNumber: function (e) {
    var mythis = this
    var userInfo = this.data.tempUserInfo
    wx.login({
      success: res => {
        mythis.setData({
          code: res.code
        })
        wx.request({
          url: app.globalData.apiurl + 'Login/mobileLogin.html',
          data: {
            'validation': app.globalData.validation,
            'encryptedData': e.detail.encryptedData,
            'iv': e.detail.iv,
            'code': res.code,
            'userinfo': userInfo
          },
          method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data && res.data.code == 200) { 
              //存入缓存即可
              mythis.setData({
                showOrDisplay: false,
                userInfo: res.data.data
              })
              wx.setStorage({
                key: "userInfo",
                data: res.data.data,
                success(res) {
                  // console.log(res)
                },
                fail(err) {
                  // console.log(err)
                }
              })
              mythis.getComStatus()
               // 获取简历数量信息
              mythis.realtime()
              wx.setStorage({
                key: "token",
                data: res.data.data,
                success(res) {
                  console.log(res)
                },
                fail(err) {
                  console.log(err)
                }
              })
              app.showsuccessMsg('登录成功')
            } else {
              app.showErrorMsg(res.data.msg)
            }
          },
          fail: function (err) {
            console.log(err);
          }
        })
      }
    })
  }, 
  // 取消弹窗
  calcleLogin () {
    this.setData({
      showOrDisplay: false
    })
  }, 
  getOpenId () {
    var code = this.data.code
    var userInfo = this.data.userInfo
    wx.request({
      url: app.globalData.apiurl + 'Login/getOpenid.html',
      method: 'GET',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: userInfo.user_id,
        code: code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          console.log(res)
        } else {
          // app.showErrorMsg('加载失败')
        }
      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();
      }
    })
  },
  // websocket
  // 获取简历信息
  getResumeInfo: function () {
    var userId = this.data.userInfo.user_id
    console.log(userId)
    wx.connectSocket({
      url: 'wss://zhaopin.heigrace.com/wss',
      data: {
        userId: userId
      },
      header: {
        'content-type': 'application/json'
      },
      protocols: ['protocol1'],
      method: 'GET',
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }
})
