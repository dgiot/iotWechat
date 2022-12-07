var WxApiRoot =   'http://127.0.0.1:5080/' 
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