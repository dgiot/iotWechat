// pages/home/home.js
var wxCharts = require('../../utils/wxcharts.js');
var ringChart = null;
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token: '',
        unPanalarmCount: '',
        offlineCount: 0,
        notificationCount: 0,
        onlineCount: 0,
        panalarmDevice: '',
        carousel: [],
        indicatorDots: true, // 是否显示面板指示点
        autoplay: true, // 是否自动切换
        interval: 5000, // 自动切换时间间隔
        duration: 500, // 滑动动画时长
        circular: true, // 是否采用衔接滑动
        latitude: 28.475997, //28.475997,121.331121
        longitude: 121.331121,
        scale: 11.8,
        markers: [{
            id: 2,
            latitude: 28.480371, //28.480371,121.240994
            longitude: 121.240994,
            iconPath: "../../images/mapcenter.png",
            width: 30,
            height: 30,
            callout: {},
            customCallout: {
                display: 'ALWAYS'
            }
        }, {
            id: 1,
            latitude: 28.475997,
            longitude: 121.331121,
            iconPath: "../../images/mapcenter.png",
            width: 30,
            height: 30,
            callout: {},
            customCallout: {
                display: 'ALWAYS'
            }
        }],
        // covers: [{
        //   latitude: 23.099994,
        //   longitude: 113.344520,
        //   iconPath: '/image/location.png'
        // }, {
        //   latitude: 23.099994,
        //   longitude: 113.304520,
        //   iconPath: '/image/location.png'
        // }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;

        that.setData({
            token: options.token
        })



    },

    onReady: function (e) {


    },


    onMsg: function () {
        if (wx.requestSubscribeMessage) {
            wx.requestSubscribeMessage({
                tmplIds: ['_g3WZTy50e6EtOBE2AqDrDMc1IbP8Osxirsz72-Nqlk'],
                success(res) {
                    console.log("订阅了" + res);
                },
                fail(res) {
                    console.log(res);
                }
            })
        } else {
            uni.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
                showCancel: false,
                success(res) {
                    console.log({});
                }
            });
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        wx.showLoading({
            title: '请求中',
        })
        that.onProduct()
        that.onReqRole()
        wx.request({
            url: app.globalData.httpUrl + 'iotapi/wechat_index',
            header: {
                'content-type': 'application/json', // 默认值
                'sessionToken': app.globalData.token //读取cookie // 默认值
            },
            success(res) {
                wx.hideLoading()
                console.log("home", res);
                if (res.statusCode == 200) {


                    that.setData({
                        carousel: res.data.carousel,
                        unPanalarmDevice: res.data.unPanalarmDevice,
                        offlineCount: res.data.offlineCount,
                        notificationCount: res.data.notificationCount,
                        onlineCount: res.data.onlineCount,
                        unPanalarmCount: res.data.unPanalarmCount,
                    })

                    var serList = []
                    var seriesList = [{
                        name: '在线数',
                        data: res.data.onlineCount,
                        color: '#2FC589',
                        stroke: false
                    }, {
                        name: '离线数',
                        data: res.data.offlineCount,
                        color: '#e44d44',
                        stroke: false
                    }, {
                        name: '报警数',
                        data: res.data.notificationCount,
                        color: '#99a3bb',
                        stroke: false
                    }]
                    if (res.data.onlineCount == 0) {
                        seriesList[0].data = 0.0001
                    }
                    serList.push(seriesList[0])

                    if (res.data.offlineCount == 0) {
                        seriesList[1].data = 0.0001
                    }
                    serList.push(seriesList[1])

                    if (res.data.panalarmDevice = 0) {
                        seriesList[2].data = 0.0001
                    }
                    serList.push(seriesList[2])


                    console.log(serList)
                    ringChart = new wxCharts({
                        animation: true,
                        canvasId: 'ringCanvas',
                        type: 'ring',
                        extra: {
                            ringWidth: 8,
                            pie: {
                                offsetAngle: 45
                            }
                        },
                        title: {
                            name: '设备总数',
                            color: '#000000',
                            fontSize: 12
                        },
                        subtitle: {
                            name: res.data.deviceCount,
                            color: '#000000',
                            fontSize: 25
                        },
                        series: serList,
                        disablePieStroke: true,
                        width: 130,
                        height: 130,
                        dataLabel: false,
                        legend: false,
                        background: '#f5f5f5',
                        padding: 0,

                    });
                    // ringChart.addEventListener('renderComplete', () => {
                    //     console.log('renderComplete');
                    // });
                    // setTimeout(() => {
                    //     ringChart.stopAnimation();
                    // }, 500);

                } else {
                    var serList = []
                    var seriesList = [{
                        name: '在线数',
                        data: 0.0001,
                        color: '#2FC589',
                        stroke: false
                    }, {
                        name: '离线数',
                        data: 0.0001,
                        color: '#e44d44',
                        stroke: false
                    }, {
                        name: '报警数',
                        data: 0.0001,
                        color: '#99a3bb',
                        stroke: false
                    }]

                    serList.push(seriesList[0])


                    serList.push(seriesList[1])


                    serList.push(seriesList[2])

                    ringChart = new wxCharts({
                        animation: true,
                        canvasId: 'ringCanvas',
                        type: 'ring',
                        extra: {
                            ringWidth: 8,
                            pie: {
                                offsetAngle: 45
                            }
                        },
                        title: {
                            name: '设备总数',
                            color: '#000000',
                            fontSize: 12
                        },
                        subtitle: {
                            name: 0,
                            color: '#000000',
                            fontSize: 25
                        },
                        series: serList,
                        disablePieStroke: true,
                        width: 130,
                        height: 130,
                        dataLabel: false,
                        legend: false,
                        background: '#f5f5f5',
                        padding: 0,

                    });
                }
            }
        })


    },

    goWeb: function (e) {
        var that = this;
        that.onMsg();

        var mIndex = e.target.dataset.index
        wx.navigateTo({
            url: '../../pages/webview/webview?newUrl=' + that.data.carousel[mIndex].webUrl
        })
    },

    onDeviceList: function () {
        var that = this;
        that.onMsg();

        wx.switchTab({
            url: '../../pages/deviceList/deviceList'
        })
    },

    goTab3: function () {
        var that = this;
        that.onMsg();
        wx.switchTab({
            url: '../../pages/alarm/alarm'
        })
    },

    /**
     * 跳转到添加设备
     */
    onAddDevice: function () {
        var that = this;
        that.onMsg();
        wx.navigateTo({
            url: '../device/pages/addDevice/addDevice' //'../../pages/addDevice/addDevice'
        })
    },

    /**
     * 跳转到地图
     */
    onMap: function () {
        var that = this;
        that.onMsg();
        wx.navigateTo({
            url: '../device/pages/map/map' //   '../../pages/map/map'
        })
    },


    /**
     * 跳转到工作
     */
    onWork: function () {
        var that = this;
        that.onMsg();
        wx.navigateTo({
            url: '../device/pages/work/work'
        })
    },

    /**
     * 跳转到用户管理
     */
    onUser: function () {
        var that = this;
        that.onMsg();
        wx.navigateTo({
            url: '../device/pages/userList/userList'
        })
    },

    /**
     * 获取所有部门
     */
    onReqRole: function () {
        var that = this;
        wx.request({
            url: app.globalData.httpUrl + 'iotapi/roletree',
            header: {
                'content-type': 'application/json', // 默认值
                'sessionToken': app.globalData.token //读取cookie // 默认值
            },
            success(res) {
                wx.hideLoading()
                var mTimeList = res.data.results;
                for (let i = 0; i < mTimeList.length; i++) {
                    mTimeList[i].value = mTimeList[i].label
                }
                app.globalData.departmentList = mTimeList
            }
        })
    },

    /**
     * 获取产品类型
     */
    onProduct: function () {
        wx.request({
            url: app.globalData.httpUrl + 'iotapi/classes/Product?count=objectId&order=-updatedAt&limit=1000&skip=0&keys=name',
            header: {
                'content-type': 'application/json', // 默认值
                'sessionToken': app.globalData.token //读取cookie // 默认值
            },
            success(res) {
                if (res.statusCode == 200) {
                    app.globalData.productList = res.data.results
                } else if (res.statusCode == 401) {
                    wx.reLaunch({
                        url: '../../pages/index/index'
                    })
                }

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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})