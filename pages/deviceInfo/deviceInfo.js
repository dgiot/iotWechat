// pages/deviceInfo/deviceInfo.js
import * as echarts from '../../ec-canvas/echarts.min.js';
var util = require('../../utils/util.js');
const app = getApp()
let chart = null;
let chart2 = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: function (canvas, width, height, dpr) {
        chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        canvas.setChart(chart);

      }
    },
    ec2: {
      onInit: function (canvas, width, height, dpr) {
        chart2 = echarts.init(canvas, null, {
          width: width,
          height: 300,
          devicePixelRatio: dpr // new
        });
        canvas.setChart(chart2);

      }
    },
    choiceList: [],
    textIndex:0,
    choiceTextList:[],
    displayValue1: '开始时间',
    displayValue2: '结束时间',
    itemStyle: {
      normal: {
        label: {
          show: true, //柱子上显示值
          position: 'inside', //值在柱子上方显示
          textStyle: {
            color: '#000000', //值得颜色,
            size: 18
          }
        }
      }
    },
    deviceType: '',
    vHeight: 0,
    deviceId: '',
    productid:'',
    devaddr:'',
    listdata: [],
    value1: [],
    value2: [],
    lang: 'zh_CN',
    chartsDataDay: [],
    chartsCategoriesDay: [],
    current: 'tab1',
    tabs: [{
        key: 'tab1',
        title: '实时状态',
        content: 'Content of tab 1',
      },
      // {
      //   key: 'tab2',
      //   title: '实时数据',
      //   content: 'Content of tab 2',
      // },
      {
        key: 'tab3',
        title: '历史数据',
        content: 'Content of tab 3',
      },
    ],
    realtime:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 先取出页面高度 windowHeight
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceId: options.deviceId,
          productid:options.productid,
          devaddr:options.devaddr,
          vHeight: res.windowHeight - (res.statusBarHeight + 130)
        });
      }
    });
  },

  onConfirm: function (e) {
    this.setData({
      visible: true
    })
    const {
      index,
      mode
    } = e.currentTarget.dataset
    this.setValue(e.detail, 1, mode)
    console.log(`onConfirm${index}`, e.detail)
  },
  onVisibleChange: function (e) {
    this.setData({
      visible: e.detail.visible
    })
  },
  setValue: function (values, key, mode) {
    if( values.date =='undefined' || values.date == null ){
      return
    }
    var that = this;
    this.setData({
      displayValue1Num:values.date,
      value1: values.value,
      displayValue1: values.label,
    })
    that.onChartTimeData();
  },


  onConfirm2: function (e) {
    this.setData({
      visible2: true
    })
    const {
      index,
      mode
    } = e.currentTarget.dataset
    this.setValue2(e.detail, 2, mode)
  
  },
  onVisibleChange2: function (e) {
    this.setData({
      visible2: e.detail.visible
    })
  },
  setValue2: function (values, key, mode) {
    console.log(`onConfirm2`,values)
    if( values.date =='undefined' || values.date == null ){
      return
    }
    var that = this;
    this.setData({
      choiceList:[],
      choiceTextList:[],
      displayValue2Num:values.date,
      value2: values.value,
      displayValue2: values.label,
    })
    wx.showLoading()
    that.onChartTimeData();
  },
  onClick: function () {
    this.setData({
      visible: true
    })
    this.setValue(e.detail, 2, mode)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.onQueryDeviceType();
    this.onDeviceType();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // var time2Num = Date.parse(new Date());
    // console.log('time2Num=' + time2Num)
    // var time2Text = util.formatTime(new Date());
    // var time1Num = time2Num - 604800000;
    // var time1Text = util.formatTimes(time1Num, 'Y-M-D h:m');
    this.data.realtime = setInterval(that.onDeviceType,3000);
    // that.setData({
    //   displayValue2: time2Text,
    //   displayValue1: time1Text,
    //   displayValue1Num:time1Num,
    //   displayValue2Num:time2Num,
    //   value1:time1Text,
    //   value2:time2Text,
    // })
    wx.showLoading()
    this.onChartTimeData();
  },

  onChartTimeData:function(){
    var that = this;
    wx.request({
      url: app.globalData.httpUrl + 'iotapi/echart/' + that.data.deviceId + '?starttime=' + that.data.displayValue1Num +
        '&endtime=' + that.data.displayValue2Num + '&interval=1d&keys=*&limit=10&function=last&style=line',
      header: {
        'sessionToken': app.globalData.token //读取cookie // 默认值
      },
      success(res) {
        wx.hideLoading()
        if( res.statusCode == 200 ){
        if (res.data.chartData.child.length > 0) {

          var childData = res.data.chartData.child;

          var cList = [];
          var textList = [];

          for (var i = 0; i < childData.length; i++) {

            var legendData = [];
            var seriesData = [];
            var itemData = [];
            var seriesItem = {};
            var xAxisData = [];
            legendData.push(childData[i].columns[1])
            textList.push(childData[i].columns[1])

            for (const key in childData[i].rows) {
              xAxisData.push(childData[i].rows[key]['日期'])
              itemData.push(childData[i].rows[key][childData[i].columns[1]])
            }

           // seriesItem.name = childData[i].columns[1];
            seriesItem.type = 'bar';

            seriesItem.data = itemData;
            seriesItem.itemStyle = that.data.itemStyle
            seriesData.push(seriesItem)

            var option = {
              title: {},
              tooltip: {},
              legend: {
                data: legendData
              },
              xAxis: {
                data: xAxisData
              },
              yAxis: {},
              series: seriesData
            };
            cList.push(option)
          
          }
          // 使用刚指定的配置项和数据显示图表。
          
          that.setData( {
            choiceTextList:textList,
            choiceList:cList
          } )
          setTimeout(item => {
            chart2.setOption(that.data.choiceList[0]);
           },1000)
        }
      }else if(res.statusCode == 401){
        wx.reLaunch({
            url: '../../pages/index/index' 
          })
       }
      }
    })


  },

  bindPickerChange: function(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      textIndex: e.detail.value
    })
    chart2.setOption(that.data.choiceList[e.detail.value]);
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
    clearInterval(this.data.realtime)
  },
  onChange(e) {
    console.log('onChange', e)
    this.setData({
      current: e.detail.key,
    })
  },
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)

    this.setData({
      key,
      index,
    })
  },
  onSwiperChange(e) {
    console.log('onSwiperChange', e)
    const {
      current: index,
      source
    } = e.detail
    const {
      key
    } = this.data.tabs[index]

    if (!!source) {
      this.setData({
        key,
        index,
      })
    }
  },
/**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("111");
    //  this.getTimeArr();
    // this.ChooseTime(this.data.dataTime);
    // wx.stopPullDownRefresh()
    //  this.get
  },

  //获取实时状态
  
  onDeviceType: function () {
    
    var that = this;
    wx.request({
      url: app.globalData.httpUrl + 'iotapi/devicecard/' + that.data.deviceId, //仅为示例，并非真实的接口地址
      header: {
        'sessionToken': app.globalData.token //读取cookie // 默认值
      },
      success(res) {
        if (res.data.data.length > 0) {
          var legendData = [];
          var seriesData = [];
          for (var i = 0; i < res.data.data.length; i++) {
            var seriesItem = {};
            legendData.push(res.data.data[i].name)
            seriesItem.name = res.data.data[i].name;
            seriesItem.type = 'bar';
            var itemData = [];
            itemData.push(res.data.data[i].number)
            seriesItem.data = itemData;
            seriesItem.itemStyle = that.data.itemStyle
            seriesData.push(seriesItem)
          }

          that.setData({
            listdata: res.data.data,
    
          })

          // var option = {
          //   title: {},
          //   tooltip: {},
          //   legend: {
          //     data: legendData
          //   },
          //   xAxis: {
          //     data: legendData
          //   },
          //   yAxis: {},
          //   series: seriesData
          // };

          // // 使用刚指定的配置项和数据显示图表。
          // chart.setOption(option);


        }
      }
    })
  },


  /**
 * 跳转到设备详情
 */
goZt:function(e){
  var that = this;
  wx.navigateTo({
    url: '../../pages/zutai/zutai?devaddr='+that.data.devaddr+'&productid='+that.data.productid 
  })
},

  //查询设备信息··············
  onQueryDeviceType: function () {
    var mIdList = [];
    var that = this;
    mIdList.push(that.data.deviceId)
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
            deviceType: mType,
            deviceName: mTimeList[0].name,
            deviceCode: mTimeList[0].devaddr,
            deviceCompany: role,
          
          })
        }
      }
    })
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})