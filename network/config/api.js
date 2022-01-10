var WxApiRoot =   'https://pump.dgiotcloud.com/' // 'http://101.35.187.227:5080' //http://test.hgjzt.com //'https://prod.dgiotcloud.com'; //cover.zjzhxx.com/
module.exports = {

  //用户相关
  // AuthLogin: WxApiRoot + '/iotapi/login', //账号登录
    // 产品相关
    ProductQuery:WxApiRoot+'iotapi/classes/Product',
   
    DeviceQuery:WxApiRoot+"iotapi/classes/Device",
    ReportQuery:WxApiRoot+"iotapi/classes/View",  //报告
    EvidenceQuery:WxApiRoot+'iotapi/classes/Evidence',
    SaveEvidence:WxApiRoot+'iotapi/evidence',
    UpLoad:WxApiRoot+'upload',
    Head:WxApiRoot+'iotapi/head',
    drawxnqx:WxApiRoot+'iotapi/drawxnqx'  //平均数据
};