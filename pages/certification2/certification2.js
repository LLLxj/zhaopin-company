const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    formarray: ['单个', '连锁'],
    form: '',
    data: [],
    icon: '',
    domain: app.globalData.domain,
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
    wx.showLoading({
      title: '加载中...',
    })
    
    var mythis = this;
    //发起网络请求登录
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
          var status = res.data.data.status;
          if (status == 4) {
            //审核中
            wx.redirectTo({
              url: '../audit/audit'
            })
          } else if (status == 5) {
            //未通过
            wx.redirectTo({
              url: '../auditerror/auditerror'
            })
          } else if (status == 6) {
            //认证通过
            wx.redirectTo({
              url: '../personCenter/usepersonCenterr'
            })
          } else {
            //继续填写资料
            mythis.getdata();

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
    this.getdata()
    this.setData({
      disButton: false
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



  formchange: function (event) {
    // 公司形式
    var mythis = this;
    mythis.setData({
      form: mythis.data.formarray[event.detail.value]
    })
    // console.log(event)

  }, 
  getdata: function () {


    var mythis = this
    var userInfo = mythis.data.userInfo
    //发起网络请求
    wx.request({
      url: app.globalData.apiurl + 'Company/two.html',
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
            data: res.data.data
          })
        }
      },
      fail: function (res) {
        //请求失败
        app.showNetworkError()
      }
    })


  },
  formSubmit: function (res) {
    var data = res.detail.value

    if (!data.contact) {
      app.showErrorMsg('请填写姓名'); return;
    }
    // if (!data.idcard) {
    //   app.showErrorMsg('请填写身份证'); return;
    // }
    if (!data.position) {
      app.showErrorMsg('请填写职位'); return;
    }
    if (!data.mobile) {
      app.showErrorMsg('请填写手机号'); return;
    }
    if (!app.globalData.mobile.test(data.mobile)) {
      app.showErrorMsg('手机号格式错误'); return;
    }
    // if (!data.icon || data.icon == app.globalData.domain) {
    //   app.showErrorMsg('请上传头像'); return;
    // }

    var mythis = this;
    wx.showLoading({
      title: '提交中...',
    })
    mythis.setData({
      disButton: true
    })
    var userInfo = mythis.data.userInfo
    //发起网络请求
    wx.request({
      url: app.globalData.apiurl + 'Company/two.html',
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
          console.log(res)
          wx.navigateTo({
            url: '../certification3/certification3'
          })
          
        
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          wx.hideLoading()
          
        }
      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      },
      complete: function () {
        mythis.setData({
          disButton:false
        })
      }
    })
    
  },
  uploadfile: function () {
    var mythis = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // 上传图片
        wx.showLoading({
          title: '上传中...',
        })
        const uploadTask = wx.uploadFile({
          url: app.globalData.apiurl + 'Upload/uploadFile.html', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'coverurl',
          formData: {
            validation: app.globalData.validation,//验证
            user_id: app.globalData.userInfo.user_id,
          },
          success: function (res) {
            var data = JSON.parse(res.data)
            if (data.code == 200) {
              mythis.setData({
                icon: data.data.filePath
              })
              setTimeout(function () {
                wx.hideLoading()
              }, 1000)
              app.showsuccessMsg(data.msg);
            } else {
              wx.showToast({
                title: data.msg,
                icon: 'none',
                duration: 3000
              })
            }

          }
        })
      }
    })
  }
})