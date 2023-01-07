// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },

  onLoad() {
    this.onLogin()
    //this.onLoginTest();
  },

  onLoginTest: function () {
    var that = this;
    wx.request({
      url: app.globalData.httpUrl + 'iotapi/login', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        password: "dgiot_admin",
        username: "dgiot_admin"
      },
      header: {
        'content-type': 'text/plain' // 默认值
      },
      success(res) {

        app.globalData.token = res.data.sessionToken
        app.globalData.tag = res.data.tag
        app.globalData.info = res.data
        wx.switchTab({
          //url: '../../pages/home/home'
          url: '../../pages/goWork/goWork'
        })
      }
    })
  },

  onLogin: function () {
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.httpUrl + 'iotapi/wechat?jscode=' + res.code,
            success(res) {
              console.log(res)
              if (res.statusCode == 200) {
                if (res.data.status == "unbind") {
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../../pages/login/login?openid=' + res.data.openid
                    })
                  }, 2000)
                } else {
                  app.globalData.token = res.data.sessionToken
                  app.globalData.tag = res.data.tag
                  app.globalData.info = res.data;
                  wx.setStorageSync('sessionToken', res.data.sessionToken)
                  wx.switchTab({
                    url: '../../pages/home/home'
                  })
                }
              } else {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../../pages/login/login?openid=' + res.data.openid
                  })
                }, 2000)
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

})