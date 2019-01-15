// job/userinfo/userinfo.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    sexarray: ['女', '男'],
    workdatearray: ['1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年', '10年', '10年以上'],
    sex: '',//性别
    birthday: '',//生日
    workdate: '',//工作年限
    area: '',//工作城市
    textlen: 0,
    data: [],
    positio: '',
    positionlist: [],
    propertieslist: [],
    properties: '',
    salary: '',
    salarylist: [],
    degree: '',
    degreelist: [],
    experience: '',
    experiencelist: [],
    recruitment_id: '',
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
    if (options.recruitment_id) {
      this.setData({
        recruitment_id: options.recruitment_id
      })
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
    var mythis = this
    var recruitment_id = mythis.data.recruitment_id
    var userInfo = mythis.data.userInfo
    mythis.setData({
      disButton: false
    })
    // wx.showLoading({
    //   title: '加载中...',
    // })

    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Position/add.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: userInfo.user_id,
        recruitment_id: recruitment_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          var position = [];
          for (var index in res.data.data.position) {
            position.push(res.data.data.position[index]);
          }
          var properties = [];
          for (var index in res.data.data.properties) {

            properties.push(res.data.data.properties[index]);
          }
          var salary = [];
          for (var index in res.data.data.salary) {
            salary.push(res.data.data.salary[index])
          }
          var degree = [];
          for (var index in res.data.data.degree) {
            degree.push(res.data.data.degree[index])
          }
          var experience = [];
          for (var index in res.data.data.experience) {
            experience.push(res.data.data.experience[index]);
          }
          mythis.setData({
            data: res.data.data,
            positionlist: position,
            propertieslist: properties,
            salarylist: salary,
            degreelist: degree,
            experiencelist: experience
          })


        } else {
          app.showErrorMsg('加载失败')
        }
        // wx.hideLoading()
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


  bindPickerChange: function (event) {
    // 选择性别
    var mythis = this;
    mythis.setData({
      sex: mythis.data.sexarray[event.detail.value]
    })
  },

  birthdayChange: function (event) {
    // 出生日期
    var mythis = this;
    mythis.setData({
      birthday: event.detail.value
    })
    // console.log(event)

  },
  workdateChange: function (event) {
    //工作年限
    var mythis = this;
    mythis.setData({
      workdate: mythis.data.workdatearray[event.detail.value]
    })
  },
  areaChange: function (event) {
    //工作城市
    var mythis = this;
    mythis.setData({
      area: event.detail.value[0] + '-' + event.detail.value[1] + '-' + event.detail.value[2]
    })
  },
  textchange: function (event) {
    //个人简介
    var mythis = this;
    mythis.setData({
      textlen: event.detail.cursor
    })
  },

  birthdayChangeposition: function (res) {
    //选择职位
    var mythis = this;
    mythis.setData({
      position: mythis.data.positionlist[res.detail.value]
    })

  },
  birthdayChangeproperties: function (res) {
    var mythis = this;
    mythis.setData({
      properties: mythis.data.propertieslist[res.detail.value]
    })
  },
  birthdayChangesalary: function (res) {
    var mythis = this;
    mythis.setData({
      salary: mythis.data.salarylist[res.detail.value]
    })
  },
  birthdayChangedegree: function (res) {
    var mythis = this;
    mythis.setData({
      degree: mythis.data.degreelist[res.detail.value]
    })
  },
  birthdayChangeexperience: function (res) {

    var mythis = this;
    mythis.setData({
      experience: mythis.data.experiencelist[res.detail.value]
    })

  },
  formSubmit: function (res) {
    var data = res.detail.value;
    
    if (!data.position_id) {
      app.showErrorMsg('请选择招聘职位'); return;
    }
    if (!data.number) {
      app.showErrorMsg('请填写招聘人数'); return;
    }

    if (!data.properties) {
      app.showErrorMsg('请选择岗位性质'); return;
    }

    if (!data.salary_id) {
      app.showErrorMsg('请选择薪资范围'); return;
    }

    if (!data.degree) {
      app.showErrorMsg('请选择学历要求'); return;
    }
    if (!data.experience) {
      app.showErrorMsg('请选择经验要求'); return;
    }

    if (!data.position_id) {
      app.showErrorMsg('请选择招聘职位'); return;
    }

    if (!data.details) {
      app.showErrorMsg('请填写职位详情'); return;
    }

    if (!data.requirements) {
      app.showErrorMsg('请填写职位要求'); return;
    }

    if (!data.address) {
      app.showErrorMsg('请填写工作地址'); return;
    }

    var mythis = this;
    var recruitment_id = mythis.data.recruitment_id
    var userInfo = mythis.data.userInfo
    mythis.setData({
      disButton: true
    })
    wx.showLoading({
      title: '提交中...',
    })

    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Position/add.html',
      method: 'POST',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: userInfo.user_id,
        data: data,
        recruitment_id: data.recruitment_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          app.showsuccessMsg(res.data.msg);
            // wx.navigateBack();
          wx.navigateBack()
        } else {
          console.log(res)
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'none',
          //   duration: 3000
          // })
        }
        wx.hideLoading()
      },
      fail: function (res) {
        //请求失败
        app.showNetworkError()
        wx.hideLoading()
        mythis.setData({
          disButton: false
        })
      }
    })

  },
  numchnage: function (res) {
    var value = res.detail.value;
    var mythis = this;
    if (value) {
      mythis.setData({
        numchnageval: value
      })
    }
  }

})