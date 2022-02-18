// pages/map/map.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.request({
      url: app.globalData.httpUrl+'iotapi/wechat_map', 
      header: {
        'content-type': 'application/json', // 默认值
        'sessionToken': app.globalData.token//读取cookie // 默认值
      },
      success(res) {
        wx.hideLoading()
        if( res.statusCode == 200 ){
        var mList = res.data.results
        for (const key in mList) {
          mList[key].deviceId = mList[key].id,
          mList[key].id =  parseInt(key)
        }
        that.setData({
          markers:mList
        })
      }else if(res.statusCode == 401){
        wx.reLaunch({
            url: '../../pages/index/index' 
          })
       }
    }
    })

  },

    showPop:function(e){
  var that = this
  that.onQueryDeviceType(e)
  },

   //查询设备信息··············
   onQueryDeviceType: function (e) {
    var mIdList = [];
    var that = this;
    mIdList.push(e)
    var mDataStr = {
      "order": "-createdAt",
      "where": {
        "objectId": {
          "$in": mIdList
        }
      }
    }
    wx.showLoading()
    wx.request({
      url: app.globalData.httpUrl + 'iotapi/device', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: mDataStr,
      header: {
        'content-type': 'application/json', // 默认值
        'sessionToken': app.globalData.token //读取cookie // 默认值
      },
      success(res) {
        wx.hideLoading();
        var mType = '';
        if (res.data.results != 'undefined' && res.data.results.length > 0) {
          var mTimeList = res.data.results;
          if (mTimeList[0].status == 'ONLINE') {
            mType = "在线"
          } else {
            mType = "离线"
          }
          var role = '';
          for (var key in mTimeList[0].ACL) {
            role = key ? key.substr(5) : ''
          }
          that.setData({
            visible2: true,
            deviceType: mType,
            deviceName: mTimeList[0].name,
            deviceCode: mTimeList[0].devaddr,
            deviceCompany: role
          })
        }
      }
    })
  },

  /**
 * 跳转到设备详情
 */
goInfo:function(e){
  var that = this;
  wx.navigateTo({
    url: '../../pages/deviceInfo/deviceInfo?deviceId='+that.data.deviceId
  })
},
 
  clickMarker:function(e){
    var id = e.detail.markerId
    var that = this;
    for (const key in that.data.markers) {
      if (that.data.markers[key].id == id) {
        that.setData({
          deviceId:that.data.markers[key].deviceId
        })
       that.showPop(that.data.markers[key].deviceId)
      }
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})