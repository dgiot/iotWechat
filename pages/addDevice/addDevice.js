// pages/addDevice/addDevice.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewWidth:0,
    idx : 0,
    codeValue: '',
    mLatitude:'',
    mLongitude:'',
    deviceTypeList:[],
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
           viewWidth:res.windowWidth - 87
         });
     }
 });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this

    that.setData({
      deviceTypeList:app.globalData.productList,
    })

    wx.getLocation({
      type: 'wgs84',
      success (res) {
        console.log(res)
        var getAddressUrl = "https://apis.map.qq.com/ws/geocoder/v1/?location=" 
        + res.latitude + "," + res.longitude + "&key=TMWBZ-DBTRR-DQLWD-WRH4K-2VSGT-7RBK3";
        that.longitude = res.longitude;
        that.latitude = res.latitude
        wx.request({          
          url: getAddressUrl,
          success: function (result) {        
          console.log(result.data.result.address )      
           that.setData({
             mAddress: result.data.result.address,
              mLatitude:res.latitude,
              mLongitude:res.longitude
           })
          }        
        })
      }
     })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  onOpenMap:function(){
    var that = this
    console.log("111");
    wx.chooseLocation({
      success: function (res) {
        console.log("res",res)
        that.setData({
          mAddress:res.address + res.name,
          mLatitude:res.latitude,
          mLongitude:res.longitude
        })
      }
    })
  },

  /**
   * 选择产品类型
   */
  goIndex (e) {
    let index = e.currentTarget.dataset.index; 
    // console.log('每个index',index)
    this.setData({
      idx: index
     })
   },

   /**
    * 去扫码
    */
   onQrScan:function(){
     var that = this;
    wx.scanCode({
      success (res) {
        console.log(res)
        that.setData({
          codeValue:res.result
        })
      }
    })
   },

     //输入框事件
     codeInput:function(e){
    this.setData({
      codeValue:e.detail.value
    })
  },

  /**
   * 去添加设备
   */
  goAddDevice:function(){
    var that = this;

    if (that.data.codeValue.trim().length == 0) {
      that.anniu("请输入序列号");
      return;
    }

    if( that.data.mAddress.trim().length == 0 ){
      that.anniu("请先选择位置")
    }


    wx.showLoading()
    wx.request({
      url: app.globalData.httpUrl+'iotapi/adddevice', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        devaddr:that.data.codeValue,
        latitude: that.data.mLatitude,
        longitude: that.data.mLongitude,
        productid:that.data.deviceTypeList[that.data.idx].objectId
      },
      header: {
        'content-type': 'application/json',// 默认值
        'sessionToken': app.globalData.token//读取cookie // 默认值
      },
      success(res) {
        wx.hideLoading({
          success: (res) => {},
        })
        if( res.statusCode == 200 ){
          setTimeout(item => {
            wx.navigateBack({
             delta: 1 //返回上一级页面
            })
           },1000)
      }else{
        wx.showToast({
          title: '添加设备失败'
        })
      }
      }
    })

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

  }
})