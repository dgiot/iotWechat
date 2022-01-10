// pages/deviceList/deviceList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    viewH:0,
    deviceList:[],
    typeList:['全部设备','在线设备','离线设备'],
    productList:app.globalData.productList,
    index:0,
    index2:0,
    title1:'所有部门',
    scrollViewHeight:0,
    viewWidth:0,
    mSkip:0,
    sessionToken:'',
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.title1)
    console.log(app.globalData.token);
    
    // 先取出页面高度 windowHeight
    wx.getSystemInfo({
     success: function(res) {
         that.setData({
          viewH:res.windowHeight - (res.statusBarHeight +35),
          sessionToken:app.globalData.token,
         });
     }
 });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var pList = app.globalData.productList;
    var pList2 = ["全部"]
    for (const key in pList) {
      pList2.push(pList[key].name)
    }
   
    var dList = [{ 'label': '所有部门','value': '110000'}];
    dList = dList.concat(app.globalData.departmentList)
    console.log(dList)
    
    that.setData({
      productList:pList,
      productList2:pList2,
      options1:dList
    })

    

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      mSkip:0
    })

    if( app.globalData.toUser ){
      that.setData({
        title1:app.globalData.title1
      })
      app.globalData.toUser = false
      that.data.title1 = app.globalData.title1;
      that.onReqToken(that.data.title1)
    }else{
      that.onQueryDevice()
    }

  },




    /**
     * 跳转到添加设备
     */
    onAddDevice: function () {
      wx.navigateTo({
          url: '../device/pages/addDevice/addDevice'
      })
  },


  /**
   * 所属部门
   */
  onOpen1:function() {
    this.setData({ visible1: true })
  },
  onClose1:function(){
    this.onReqToken(this.data.title1)
  },

  /**
   * 去换取部门token
   */
  onReqToken:function(e){
    var that = this;
    console.log(e)

    if( e != '所有部门' ){

    wx.showLoading()
    wx.request({
      url: app.globalData.httpUrl+'iotapi/token?name='+e, 
      header: {
        'content-type': 'application/json', // 默认值
        'sessionToken': that.data.sessionToken//读取cookie // 默认值
      },
      success(res) {
        wx.hideLoading()
        if( res.statusCode == 200){
          that.setData({
            dToken:res.data.access_token,
            visible1: false,
            mSkip:0
          })
          that.onQueryDevice()
        }else if(res.statusCode == 401){
          wx.reLaunch({
              url: '../../pages/index/index' 
            })
         }
      }
    })
    }else{
      that.setData({
        visible1: false,
        mSkip:0
      })
      that.onQueryDevice()
    }
  },
  
  onChange1(e) {
  // this.setData({ title1: e.detail.options.map((n) => n.label).join('/') })
  this.setData({
    title1:e.detail.options[e.detail.options.length - 1].label,
    mDepartment:e.detail.options[e.detail.options.length - 1].objectId
   })
   console.log('onChange1', e.detail.options[e.detail.options.length - 1].label)
  },

  /**
   * 选择产品类型
   */
  bindPickerChange2: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      mSkip:0
    })
    this.onQueryDevice();
  },

   /**
   * 选择设备状态
   */
  bindPickerChange3: function(e) {
    this.setData({
      index2: e.detail.value,
      mSkip:0
    })
    this.onQueryDevice();
  },

  //查询设备列表
onQueryDevice:function(){
  wx.showLoading({
    title: '请求中',
  })
  var that = this;
  
  var mUrl = ''

   var mToken = ''

   if( that.data.mSkip == 0 ){
     that.setData({
      deviceList:[]
     })
   }

   if( that.data.title1 == '所有部门' ){
     mToken = that.data.sessionToken
   }else{
    mToken = that.data.dToken
   }

  if( that.data.index == 0 ){
    mUrl = app.globalData.httpUrl+'iotapi/classes/Device?limit=10&skip='+that.data.mSkip+'&order=-createdAt&count=objectId&include=product' 
  
    if( that.data.index2 == 1 ){
      mUrl = app.globalData.httpUrl+'iotapi/classes/Device?limit=10&skip='+that.data.mSkip
      +'&order=-createdAt&count=objectId&include=product&where={"status":"ONLINE"}'
    }
  
    if( that.data.index2 == 2 ){
      mUrl = app.globalData.httpUrl+'iotapi/classes/Device?limit=10&skip='+that.data.mSkip
      +'&order=-createdAt&count=objectId&include=product&where={"status":"OFFLINE"}'
    }
  }else{
    mUrl = app.globalData.httpUrl+'iotapi/classes/Device?limit=10&skip='+that.data.mSkip+'&order=-createdAt&count=objectId&include=product&where={"product":"'+
    that.data.productList[that.data.index-1].objectId+'"}'

    if( that.data.index2 == 1 ){
      mUrl = app.globalData.httpUrl+'iotapi/classes/Device?limit=10&skip='+that.data.mSkip+'&order=-createdAt&count=objectId&include=product&where={"product":"'+
      that.data.productList[that.data.index-1].objectId+'","status":"ONLINE"}'
    }
  
    if( that.data.index2 == 2 ){
      mUrl = app.globalData.httpUrl+'iotapi/classes/Device?limit=10&skip='+that.data.mSkip+'&order=-createdAt&count=objectId&include=product&where={"product":"'+
      that.data.productList[that.data.index-1].objectId+'","status":"OFFLINE"}'
    }
  }


  wx.request({
    url: mUrl, 
    header: {
      'content-type': 'application/json', // 默认值
      'sessionToken': mToken//读取cookie // 默认值
    },
    success(res) {
      wx.hideLoading()

   

      if( res.statusCode != 200 ){
        wx.showToast({
          title: '服务器报错了',
          icon: 'error',
          duration: 2000
        })
        return
      }
      var mList = res.data.results;
      //formatTimeTwo(sjc,'Y-M-D h:m:s') endTimeStr
      for (let i = 0; i < mList.length ; i++){
        //mList[i].createdAt = util.formatTimeTwo(mList[i].createdAt, 'Y-M-D');
       // mList[i].basedata.expirationTime = util.formatTimeTwo(mList[i].basedata.expirationTime * 1000, 'Y-M-D');
        mList[i].type1 = "";mList[i].type2 = "";
       
      for( var key in mList[i].ACL ){
        console.log('-----'+ key ? key.substr(5):'')
        mList[i].role = key ? key.substr(5):''
      }
        
      }
      if( that.data.mSkip == 0 ){
      that.setData({
        deviceList: mList,
      })
    } else{
      that.setData({
        deviceList:that.data.deviceList.concat(mList)
      })
    }
    }
  })
},



//滑动到底部
onDownListener: function () {
 console.log("==========")
 var that = this;
 if( that.data.mSkip > that.data.deviceList.length ){
  return
 }

 that.setData({
   mSkip: that.data.mSkip + 10
 })
 that.onQueryDevice();
},

/**
 * 跳转到设备详情
 */
goInfo:function(e){
  var _this = this;
  let _index = e.currentTarget.dataset.index;
  var mList = _this.data.deviceList;
  var mId = mList[_index].objectId;
  wx.navigateTo({
    url: '../../pages/deviceInfo/deviceInfo?deviceId='+mId
  })
},

/**
 * 跳转到设置
 */
goSetting:function(e){
  var _this = this;
  let _index = e.currentTarget.dataset.index;
  var mList = _this.data.deviceList;
  var mId = mList[_index].objectId;
  var pId = mList[_index].product.objectId
  wx.navigateTo({
    url: '../../pages/deviceSetting/deviceSetting?deviceId='+mId+'&productid='+pId+'&devaddr='+mList[_index].devaddr
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

})