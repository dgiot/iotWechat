// pages/deviceSetting/deviceSetting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceInfo: {},
    sessionToken: '',
    form: {},
    list: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      deviceInfo: options,
      sessionToken: app.globalData.token,
    })

    // that.setData({
    //   viewH:res.windowHeight - (res.statusBarHeight +85),
    //   sessionToken:app.globalData.token,
    //  });
  },
  handleSubmit() {
    let that = this
    let data = {
      profile: that.data.form
    }
    wx.showLoading()
    wx.request({
      url: app.globalData.httpUrl + 'iotapi/classes/Device/' + this.data.deviceInfo.deviceId,
      method: 'put',
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        'sessionToken': that.data.sessionToken //读取cookie // 默认值
      },
      success(res) {
        wx.hideLoading()
        console.log(res);
        if (res.statusCode == 200) {
          wx.showToast({
            title: '发送成功',
          })
          // that.onQueryDevice()
        } else if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
      }
    })
  },
  // 下拉框选项
  bindSelectEvent(e) {
    let that = this
    console.log(e);
    let {
      value
    } = e.detail //选中的下拉框索引
    let {
      index,
      name
    } = e.target.dataset //当前的列表索引以及变量名称
    for (let i = 0; i < that.data.list.length; i++) {
      if (that.data.list[i].name == name) {
        console.log('相同');
        var change = "list[" + i + "].index";
        that.setData({
          [change]: value
        })
        that.setData({
          [`form.${name}`]: that.data.list[i].options[value].value
        })
        // that.data.list[i].index = value
      }
    }

  },
  // 单选框选项
  bindRadioChange(e) {
    console.log('单选框', e);
    let that = this
    let {
      value
    } = e.detail //选中的下拉框索引
    let {
      name
    } = e.target.dataset //当前的列表索引以及变量名称
    that.setData({
      [`form.${name}`]: value
    })
  },
  // 文本框控制
  handleInputText(e){
    console.log(e);
    let that = this
    let {
      value
    } = e.detail //选中的下拉框索引
    let {
      name
    } = e.target.dataset //当前的列表索引以及变量名称
    that.setData({
      [`form.${name}`]: value
    })
  },
   // 数字输入框控制
   handleInputNumber(e){
    console.log(e);
    let that = this
    let {
      value
    } = e.detail //选中的下拉框索引
    value = Number(value)
    let {
      name
    } = e.target.dataset //当前的列表索引以及变量名称
    that.setData({
      [`form.${name}`]: value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this
    wx.showLoading()
    // 查询设备详情
    wx.request({
      url: app.globalData.httpUrl + 'iotapi/classes/Device/' + this.data.deviceInfo.deviceId,
      method: 'get',
      // data: data,
      header: {
        'content-type': 'application/json', // 默认值
        'sessionToken': that.data.sessionToken //读取cookie // 默认值
      },
      success(res) {
        // wx.hideLoading()
        console.log(res);
        if (res.statusCode == 200) {
          let profile = res.data.profile || {}
          let productid =
            that.setData({
              form: profile
            })
          let params = {
            where: {
              class: 'Product',
              type: {
                "$in": ['Profile']
              },
              key: that.data.deviceInfo.productid
            }
          }
          wx.request({
            url: app.globalData.httpUrl + 'iotapi/classes/View',
            method: 'get',
            data: params,
            // data: data,
            header: {
              'content-type': 'application/json', // 默认值
              'sessionToken': that.data.sessionToken //读取cookie // 默认值
            },
            success(res) {
              wx.hideLoading()
              console.log(res);
              if (res.statusCode == 200) {
                let data = res.data.results[0].data
                let list = data.body[0].body
                list.forEach((element) => {
                  if (element.type == "select") {
                    // 判断是否填写了该值
                    element.index = -1
                    if (that.data.form[element.name]) {
                      element.options.forEach((item,i) => {
                        if(item.value == that.data.form[element.name]){
                          element.index = i
                        }
                      })
                    }
                  }else if(element.type == "input-text" || element.type == "input-number"){
                    if (that.data.form[element.name] || that.data.form[element.name] == 0) {
                      console.log(element.type);
                      element.value = that.data.form[element.name]
                    }else if(element.value){
                      that.setData({
                        [`form.${element.name}`]:element.value
                      })
                    }
                  }
                })
                that.setData({
                  list
                })
                // let profile = res.data.profile || {} 
                // that.setData({
                //   form:profile
                // })

              }
            }
          })

          // that.onQueryDevice()
        } else if (res.statusCode == 401) {
          wx.hideLoading()
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})