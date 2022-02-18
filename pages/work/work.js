// pages/work/work.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceList:[],
    workList:[],
    workTypeList:['全部','故障维修','设备移位'],
    orderTypeList:['全部','待派单','已派单','已处理','已结单'],
    viewH:0,
    scrollViewHeight:0,
    visible2:false,
    sessionToken:'',
    mSkip:0,
    whereType:{"$ne":""},
    whereStatus:{"$ne":9},
    index1:0,
    index2:0,
    index5:0,
   
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
          viewH:res.windowHeight - (res.statusBarHeight +85),
          sessionToken:app.globalData.token
         });
     }
 });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    that.onReqRole()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      mSkip : 0
    })
    that.onMainWork();
    that.onMyWorkList();

  },

  bindPickerChange: function(e) {
    var that = this;
    var mValue = '';
    if( e.detail.value == 0 ){
      mValue = {"$ne":""}
    }else(
      mValue = that.data.workTypeList[e.detail.value]
    )
    console.log('picker发送选择改变，携带值为', mValue)

    this.setData({
     whereType:mValue,
     index1:e.detail.value,
     mSkip : 0
    })

    wx.showLoading()
    that.onMainWork()
  },
  onClose1() {
    this.setData({
        visible2: false,
    })
},
onClose2() {
  this.setData({
      visible3: false,
  })
},
  bindPickerChange3: function(e) {
    var mValue = '';
    var that =this;
    if( e.detail.value == 0 ){
      mValue = {"$ne":9}
    }else if(e.detail.value == 1){
      mValue = '0'
    }else if(e.detail.value == 2){
      mValue = '1'
    }else if(e.detail.value == 3){
      mValue = '2'
    }else if(e.detail.value == 4){
      mValue = '3'
    }
    console.log('picker发送选择改变，携带值为', mValue)

    this.setData({
     whereStatus:mValue,
     index2:e.detail.value,
     mSkip : 0
    })

    wx.showLoading()
    that.onMainWork()

  },

  /**
   * 获取工单列表
   */
  onMainWork:function(){
    var that = this;
    var whereItem = {}
    whereItem.status=that.data.whereStatus
    whereItem.type = that.data.whereType
    console.log(whereItem )
    wx.request({
      url: app.globalData.httpUrl+'iotapi/classes/Maintenance', 
      data: {
        skip: that.data.mSkip,
        limit:10,
        include:'device,user',
        order:'-createdAt',
        where:whereItem
      },
      header: {
        'content-type': 'application/json', // 默认值
        'sessionToken': that.data.sessionToken//读取cookie // 默认值
      },
      success(res) {
        wx.hideLoading()
        if( res.statusCode == 200 ){
        var tList = res.data.results;
        for (const i in tList) {
          tList[i].createdAt = util.formatTimeTwo(tList[i].createdAt, 'Y-M-D h:m');
         // tList[i].deviceName = tList[i].device.name
        }

        if( that.data.mSkip == 0 ){
          that.setData({
            workList: tList,
          })
        } else{
          that.setData({
            workList:that.data.workList.concat(tList)
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


   /**
   * 获取我的工单列表
   */
  onMyWorkList:function(){
    var that = this;
    var whereItem =  {'info.receiveuseid': app.globalData.info.objectId}
    wx.request({
      url: app.globalData.httpUrl+'iotapi/classes/Maintenance', 
      data: {
        skip: 0,
        limit:10,
        order:'-createdAt',
        keys:'count(*)',
        where:whereItem
      },
      header: {
        'content-type': 'application/json', // 默认值
        'sessionToken': that.data.sessionToken//读取cookie // 默认值
      },
      success(res) {
        that.setData({
          mCount:res.data.count
        })
     
        }
      })
  },


  /**
   * 跳转到详情
   */
  goInfo:function(e){
    var _this = this;
    let _index = e.currentTarget.dataset.index;
    var mList = _this.data.workList;
    var mItemData = JSON.stringify(mList[_index] );
    wx.navigateTo({
      url: '../../pages/workInfo/workInfo1?item='+mItemData
  })
  },

  /**\
   * 跳转到分配给我的工单
   */
  goMyWork:function(){
    wx.navigateTo({
      url: '../../pages/myWork/myWork'
  })
  },

  /**
   * 根据设备id查设备名称
   */
  getDeviceName:function(e){
   var that = this; var mName = '';

   for (const item of that.data.deviceList) {
    if (item.objectId === e) {
      mName = item.name;
     }
   }

   return mName;
  },

  showPop:function(e){
    var that =this
    let _index = e.currentTarget.dataset.index;
    this.setData({
      visible2: true,
      item:that.data.workList[_index]
  })
  },
  showPop2:function(e){
    var that =this
    let _index = e.currentTarget.dataset.index;
    this.setData({
      visible3: true,
      item:that.data.workList[_index]
  })
  },


//滑动到底部
onDownListener: function () {
  console.log("==========")
  var that = this;
  if(  that.data.mSkip > that.data.workList.length ){
   return
  }
 
  that.setData({
    mSkip: that.data.mSkip + 10
  })
  that.onMainWork();
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
  * 获取输入信息
  */
 inputTilte2: function (e) {
  let that = this;
  that.data.memo = e.detail.value;
},
  /**
  * 获取输入信息
  */
 inputTilte3: function (e) {
  let that = this;
  that.data.memo2 = e.detail.value;
},

/**
   * 指派
   */
  onMaintenance:function(){
    wx.showLoading({
      title: '正在派单',
    })

    var that = this;
    // var mInfo = that.data.item.info
    // var mStep = {}
    // mStep.Remarks =  that.data.memo
    // mInfo.step1 = mStep
    // var timeItem={}
    // timeItem.timestamp = util.formatTime(new Date());
    // timeItem.h4='已分配'
    // timeItem.p= app.globalData.info.nick +' 分配给 '+that.data.cUserList[that.data.index]
    // mInfo.timeline.push(timeItem) 

    // mInfo.user = that.data.cUserList[that.data.index5]
    // var str1 = that.data.userList[that.data.index5].objectId
    // that.data.item.ACL[str1] = {"read":true,"write":true}
    // console.log( that.data.item.ACL)



    var mInfo = that.data.item.info
    var mStep = {}
    mStep.Remarks =  that.data.memo
    mInfo.step1 = mStep
    var timeItem={}
    timeItem.timestamp = util.formatTime(new Date());
    timeItem.h4='已分配'
    timeItem.p= app.globalData.info.nick +' 分配给 '+that.data.cUserList[that.data.index5]
    mInfo.timeline.push(timeItem) 
    mInfo.receiveuseid = that.data.userList[that.data.index5].objectId
    mInfo.receiveusername = that.data.cUserList[that.data.index5]
    mInfo.receiveuserphone = that.data.userList[that.data.index5].phone

    var str1 = that.data.userList[that.data.index5].objectId
    var acl = that.data.item.ACL
    acl[str1] = {"read":true,"write":true}
    console.log( that.data.item.ACL)

    var user =  {
      "objectId": that.data.userList[that.data.index5].objectId,
      "__type": "Pointer",
      "className": "_User"
  }


    wx.request({
      url: app.globalData.httpUrl+'iotapi/classes/Maintenance/'+that.data.item.objectId, //仅为示例，并非真实的接口地址
      method: 'PUT',
      data: {
        status: 1,
        info: mInfo,
        ACL:acl,
        user:user
      },
      header: {
        'content-type': 'application/json', // 默认值
        'sessionToken': app.globalData.token//读取cookie // 默认值
      },
      success(res) {
        wx.hideLoading({
          success: (res) => {},
        })
        if( res.statusCode == 200 ){
          that.onShow();
          that.onClose1();
      }else{
        wx.showToast({
          title: '派单失败'
        })
      }
    }
    })
  },
  /**
   * 结单
   */
  onEndOrder:function(){
    wx.showLoading({
      title: '正在结单',
    })
    var that = this;
    var mInfo = that.data.item.info
    var mStep = {}
    mStep.Remarks =  that.data.memo2
    mInfo.step3 = mStep
    var timeItem={}
    timeItem.timestamp = util.formatTime(new Date());
    timeItem.h4='已结单'
    timeItem.p= app.globalData.info.nick +' 已结束这条工单 '
    mInfo.timeline.push(timeItem) 
    wx.request({
      url: app.globalData.httpUrl+'iotapi/classes/Maintenance/'+that.data.item.objectId, //仅为示例，并非真实的接口地址
      method: 'PUT',
      data: {
        status: 3,
        info: mInfo,
        ACL:that.data.item.ACL
      },
      header: {
        'content-type': 'application/json', // 默认值
        'sessionToken': app.globalData.token//读取cookie // 默认值
      },
      success(res) {
        wx.hideLoading({
          success: (res) => {},
        })
        if( res.statusCode == 200 ){
         that.onShow();
         that.onClose2();
      }else{
        wx.showToast({
          title: '结单失败'
        })
      }
    }
    })
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
  onOpen1:function() {
    this.setData({ visible1: true })
  },
  onClose3:function(){
    this.setData({ visible1: false })
    this.onQueryUserList();
    },
  onChange2(e) {
    //this.setData({ title1: e.detail.options.map((n) => n.label).join('/') })
   this.setData({
     title1:e.detail.options[e.detail.options.length - 1].label,
     mDepartment:e.detail.options[e.detail.options.length - 1].objectId,
     index5:0
    })
    console.log('onChange1',e.detail.options.map((n) => n.label).join('/'))
   },

   
  /**
   * 选择维保人员
   */
  bindPickerChange5: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index5: e.detail.value
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
     var tList =  res.data.users
     var uList = []
     for (const i in tList) {
       uList.push(tList[i].nick)
     }
      that.setData({
        userList: res.data.users,
        cUserList:uList
     })
   } 
  })
},


})