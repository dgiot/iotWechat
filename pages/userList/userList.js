// pages/userList/userList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewH:0,
    userList:[],
    index:1000,
    title1:'',
    mSkip:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 先取出页面高度 windowHeight
    wx.getSystemInfo({
     success: function(res) {
         that.setData({
          viewH:res.windowHeight - (res.statusBarHeight + 46 * 2)
         });
     }
 });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.onReqRole();

  },


  onReqRole:function(){
    var that = this;
    that.setData({
      options1:app.globalData.departmentList,
      value1:app.globalData.departmentList[0].label,
      title1:app.globalData.departmentList[0].label
    })
    that.onQueryUserList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      mSkip:0
    })
    //that.onQueryUser();
  },

   //查询用户列表
onQueryUser:function(){
  var that = this;
  wx.showLoading({
    title: '请求中',
  })

  var that = this;
  wx.request({
    url: app.globalData.httpUrl+'iotapi/classes/_User?order=createdAt&limit=10&skip='+that.data.mSkip, 
    header: {
      'content-type': 'application/json', // 默认值
      'sessionToken': app.globalData.token//读取cookie // 默认值
    },
    success(res) {
     wx.hideLoading()
      if( that.data.mSkip == 0 ){
      that.setData({
        userList: res.data.results,
      })
    } else{
      that.setData({
        userList:that.data.userList.concat(mList)
      })
    }
    }
  })
},

/**
 * 查询部门下面的用户
 */
onQueryUserList:function(){
  var that = this;
  wx.showLoading({
    title: '请求中',
  })
  var that = this;
  wx.request({
  url: app.globalData.httpUrl+'iotapi/role?name='+that.data.title1, 
    header: {
      'content-type': 'application/json', // 默认值
      'sessionToken': app.globalData.token//读取cookie // 默认值
    },
    success(res) {
     wx.hideLoading()
     if(res.statusCode == 200){
      if( that.data.mSkip == 0 ){
      that.setData({
        userList: res.data.users,
     })
   } else{
      that.setData({
        userList:that.data.userList.concat(res.data.users)
      })
   }
   }else if(res.statusCode == 401){
    wx.reLaunch({
        url: '../../pages/index/index' 
      })
   }
  }
  })
},

onUnBind:function(){

 

  wx.showModal({
    title: '提示',
    content: '确定要解绑当前用户吗？',
    success (res) {
      if (res.confirm) {
       

        var that = this;
        wx.showLoading({
          title: '请求中',
        })
        wx.request({
        url: app.globalData.httpUrl+'iotapi/wechat_unbind', 
          header: {
            'content-type': 'application/json', // 默认值
            'sessionToken': app.globalData.token//读取cookie // 默认值
          },
          success(res) {
            if( res.statusCode ==  200 ){
             
              wx.login({
                success (res) {
                  if (res.code) {
                    //发起网络请求
                    wx.request({
                      url: app.globalData.httpUrl+'iotapi/wechat?jscode='+res.code,
                      success(res) {
                        console.log(res)
                        if( res.statusCode == 200){
                          if(  res.data.status == "unbind"){
           wx.hideLoading()

                            wx.reLaunch({
                              url: '../../pages/login/login?openid='+res.data.openid
                            })
                        }
                      }
                      }
                    })
                  } else {
           wx.hideLoading()

                    console.log('登录失败！' + res.errMsg)
                  }
                }
              })
         
         } else{
            wx.showToast({
              title: '服务器报错了',
            })
         }
         }
        })

      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
},

onOpen1:function() {
  this.setData({ visible1: true })
},
onClose1:function(){
this.setData({ visible1: false })
this.onQueryUserList();

},

onChange1(e) {
 //this.setData({ title1: e.detail.options.map((n) => n.label).join('/') })
this.setData({
  title1:e.detail.options[e.detail.options.length - 1].label,
  mDepartment:e.detail.options[e.detail.options.length - 1].objectId
 })
 console.log('onChange1',e.detail.options.map((n) => n.label).join('/'))
},
  

switch1Change:function(e){
var that = this;
var action = 'dsisable';
console.log(e)
var mIndex = e.target.dataset.index
var uId = that.data.userList[mIndex].objectId
if( e.detail.value ){
  action = 'enable'
}else{
  action = 'disable'
}
wx.showLoading({
  title: '请求中',
})
wx.request({
url: app.globalData.httpUrl+'iotapi/disableuser?userid='+uId+'&action='+action, 
  header: {
    'sessionToken': app.globalData.token//读取cookie // 默认值
  },
  success(res) {
   wx.hideLoading()
    if( res.statusCode != 200 ){
      that.anniu("权限不足，禁用失败");
      that.onQueryUserList()
 } else{
    
 }
 }
})
},

  /**
   * 添加用户
   */
  onAddUser:function(){
    wx.navigateTo({
      url: '../../pages/addUser/addUser?type=1'
    })
  },

  /**
   * 去设备列表
   */
  goDevice:function(){
    var that = this
    app.globalData.title1 = that.data.title1
    app.globalData.toUser = true
    wx.switchTab({
      url: '../../pages/deviceList/deviceList?title1='+that.data.title1
    })
  
  },
  /**
   * 修改用户
   */
  onUpdateUser:function(e){
    var _this = this;
    let _index = e.currentTarget.dataset.index;
    var mList = _this.data.userList;
    wx.navigateTo({
      url: '../../pages/editUser/editUser?type=2&name='+
       mList[_index].nick+'&phone='+mList[_index].phone+'&email='
       +mList[_index].email+'&username='+mList[_index].username+'&userId='+mList[_index].objectId
       +'&title1='+_this.data.title1+'&title1Id='+_this.data.mDepartment
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 显示错误信息
   */
  anniu: function (e) {
    if (!this.data.show) {
      let that = this;
      this.setData({
        show: 1,
        showMsg: e,
      })
      setTimeout(function () {
        that.setData({
          show: 0
        })
      }, 2000)
    }
  },
})