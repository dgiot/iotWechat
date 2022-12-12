// pages/alarm/alarm.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index1: 0,
    index2: 0,
    productid: 'all',
    isprocess: 'all',
    mSkip: 0,
    typeList: ['全部告警', '未确认', '误报', '手动恢复', '自动恢复']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          viewH: res.windowHeight - (res.statusBarHeight + 85),
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

    that.setData({
      productList: pList,
      productList2: pList2,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onMainWork()
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
   * 选择产品类型
   */
  bindPickerChange2: function (e) {
    var that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let mT = 'all'
    if (e.detail.value != 0) {
      mT = e.detail.value - 1
    }
    // if( e.detail.value == 1 ){
    //   mT = 'true'
    // }else if( e.detail.value == 2 ){
    //   mT = 'false'
    // }else{
    //   mT = 'all'
    // }
    this.setData({
      isprocess: mT,
      index2: e.detail.value,
      mSkip: 0
    })
    this.onMainWork();
  },

  /**
   * 选择设备状态
   */
  bindPickerChange: function (e) {
    var that = this
    this.setData({
      index1: e.detail.value,
      productid: that.data.productList[e.detail.value - 1].objectId,
      mSkip: 0,
    })
    this.onMainWork();
  },

  /**
   * 获取告警列表
   */
  onMainWork: function () {
    var that = this;
    wx.showLoading({
      title: '正在请求',
    })
    let data = {
      where: {
        "content._productid": {
          "$regex": that.data.productid,
        },
        status:that.data.isprocess
      },
      count: 'objectId',
      // productid:that.data.productid,
      skip: that.data.mSkip,
      limit: 10,
      order: '-createdAt',
      // isprocess:that.data.isprocess
    }
    if (that.data.productid == 'all') {
      delete data.where["content._productid"]
    }
    if (that.data.index2 == 0) {
      delete data.where["status"]
    }
    // {
    //   where:{
    //     "content._productid":{
    //       "$regex":that.data.productid,
    //     }
    //   },
    //   // productid:that.data.productid,
    //   skip: that.data.mSkip,
    //   limit:10,
    //   order:'-createdAt',
    //   // isprocess:that.data.isprocess
    // }
    wx.request({
      url: app.globalData.httpUrl + 'iotapi/classes/Notification',
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        'sessionToken': app.globalData.token //读取cookie // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.statusCode == 200) {
          var tList = res.data.results;
          if (tList.length == 0) {
            wx.showToast({
              title: '没有数据',
            })

          }
          console.log('tList', tList);
          // for (const key in tList) {
          //   tList[key].con = []
          //   for (const key1 in tList[key].dynamicform) {
          //   // console.log(tList[key].dynamicform[key1])
          //   var aa = JSON.stringify(tList[key].dynamicform[key1])
          //  var str1 = aa.replace(/"/g, '');
          //  var str1 = str1.substring(1, str1.length - 1);
          //  console.log(str1)
          //  tList[key].con.push(str1)
          //   }
          // }

          if (that.data.mSkip == 0) {
            that.setData({
              workList: tList,
            })
          } else {
            that.setData({
              workList: that.data.workList.concat(tList)
            })
          }
        } else if (res.statusCode == 401) {
          wx.reLaunch({
            url: '../../pages/index/index'
          })
        }
      }
    })
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

  showPop: function (e) {
    var that = this;
    let _index = e.currentTarget.dataset.index;
    var mId = that.data.workList[_index].objectId
    that.setData({
      visible2: true,
      orderId: mId
    })
  },
  /**
   * 获取输入信息
   */
  inputTilte2: function (e) {
    let that = this;
    that.data.memo = e.detail.value;
  },


  //滑动到底部
  onDownListener: function () {
    console.log("==========")
    var that = this;
    if (that.data.mSkip > that.data.workList.length) {
      return
    }

    that.setData({
      mSkip: that.data.mSkip + 1
    })
    that.onMainWork();
  },


  onPut: function () {
    var that = this;
    wx.request({
      url: app.globalData.httpUrl + 'iotapi/classes/Notification/' + that.data.orderId,
      method: 'PUT',
      data: {
        public: true,
        process: that.data.memo,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'sessionToken': app.globalData.token //读取cookie // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.statusCode == 200) {
          that.setData({
            mSkip: 0,
            visible2: false
          })
          that.onMainWork()
        }


      }
    })
  },

  goInfo: function (e) {
    var that = this;
    let _index = e.currentTarget.dataset.index;
    var process = that.data.workList[_index].process;
    var mItem = that.data.workList[_index]
    that.setData({
      visible3: true,
      mProcess: process,
      mItem: mItem
    })
  }

})