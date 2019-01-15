const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    data: [],
    domain: app.globalData.domain,
    textlen: 0,
    logo: '',
    photos: [],
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
    var mythis = this
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
          // console.log(res.data);
          if (status == 4) {
            //审核中
            wx.redirectTo({
              url: '/enterprise/audit/audit'
            })
          } else if (status == 5) {
            //未通过
            wx.redirectTo({
              url: '/enterprise/auditerror/auditerror'
            })
          } else if (status == 6) {
            //认证通过
            wx.redirectTo({
              url: '/enterprise/user/user'
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


  getdata: function () {


    var mythis = this
    var userInfo = mythis.data.userInfo
    //发起网络请求
    wx.request({
      url: app.globalData.apiurl + 'Company/three.html',
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
          // console.log(res.data);
          mythis.setData({
            data: res.data.data,
            photos: res.data.data.photos,
            textlen: res.data.data.introduction.length
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

    var data = res.detail.value;
    data['formid'] = res.detail.formId;
    data['photo'] = this.data.photos;
    if (!data.logo || data.logo == app.globalData.domain) {
      app.showErrorMsg('请上传LOGO'); return;
    }
    if (this.data.photos.length < 1) {
      app.showErrorMsg('请上传公司照片'); return;
    }
    if (this.data.photos.length < 6) {
      app.showErrorMsg('照片必须是6张'); return;
    }
    if (!data.introduction) {
      app.showErrorMsg('请填写公司简介'); return;
    }

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
      url: app.globalData.apiurl + 'Company/three.html',
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
        wx.hideLoading()
        //请求成功
        if (res.data.code == 200) {

          wx.showToast({
            title: '认证资料提交成功，请等待审核',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../personCenter/personCenter',
            })
          }, 3000)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();
        wx.hideLoading()
      },
      complete: function () {
        mythis.setData({
          disButton: true
        })
      }
    })
  },
  photos: function () {
    var mythis = this
    var userInfo = mythis.data.userInfo
    wx.request({
      url: app.globalData.apiurl + 'Company/getPhotoNum.html',
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
          var num = res.data.data.count;
          // console.log(num)

          wx.chooseImage({
            count: num, // 默认9
            sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths;
              // 上传图片
              for (var i = 0; i < tempFilePaths.length; i++) {

                wx.showLoading({
                  title: '上传中...',
                })
                const uploadTask = wx.uploadFile({
                  url: app.globalData.apiurl + 'Upload/uploadFile.html', //仅为示例，非真实的接口地址
                  filePath: tempFilePaths[i],
                  name: 'coverurl',
                  formData: {
                    validation: app.globalData.validation,//验证
                    user_id: userInfo.user_id,
                  },
                  success: function (res) {
                    var data = JSON.parse(res.data)
                    if (data.code == 200) {
                      var photos = mythis.data.photos;
                      photos.push(data.data.filePath)
                      mythis.setData({
                        photos: photos
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
            }
          })

        } else {
          app.showErrorMsg('网络异常');
          wx.hideLoading()
        }

      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })



  },
  putlogo: function (res) {
    var mythis = this
    var userInfo = mythis.data.userInfo
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
            user_id: userInfo.user_id,
          },
          success: function (res) {
            var data = JSON.parse(res.data)
            if (data.code == 200) {
              mythis.setData({
                logo: data.data.filePath
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

  },
  showimage: function (res) {
    var mythis = this;
    var src = res.target.dataset.src;
    var photos = [];
    photos[0] = src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: photos // 需要预览的图片http链接列表
    })
  },
  showimages: function (res) {

    var mythis = this;
    var src = res.target.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: mythis.data.photos // 需要预览的图片http链接列表
    })
  },
  textchange: function (event) {
    //个人简介
    var mythis = this;
    mythis.setData({
      textlen: event.detail.cursor
    })
  },
  photoone: function (res) {
    var src = res.currentTarget.dataset.src
    var mythis = this
    var userInfo = mythis.data.userInfo
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
            user_id: userInfo.user_id,
          },
          success: function (res) {
            var data = JSON.parse(res.data)
            if (data.code == 200) {
              var photos = mythis.data.photos;
              var photos2 = [];
              for (var index in photos) {
                if (photos[index] == src) {
                  photos2[index] = data.data.filePath;
                } else {
                  photos2[index] = photos[index];
                }
              }
              mythis.setData({
                photos: photos2
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