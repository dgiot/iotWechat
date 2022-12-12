## dgiot_wechat

### 介绍
基于dgiot的微信小程序设备接入演示demo

### 体验

 | 用户名      | 密码        |   体验二维码 |
  | ----------- | ----------- |-------------|
  | dgiot_dev | dgiot_dev |  ![](http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/dgiot_release/dgiot_wechat.jpg) |
  

### 页面展示

 | 首页      | 设备        |  
  | ----------- | ----------- |
  | ![](http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/dgiot_release/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E9%A6%96%E9%A1%B5.png)|![](http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/dgiot_release/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E8%AE%BE%E5%A4%87%E7%AE%A1%E7%90%86.png) | 


### 接口说明
#### 登录
  openid登录 -- (http://prod.dgiotcloud.cn/dgiot_swagger/#/_User/pput_classes_user_id)
  
  微信绑定账号登录 --（http://prod.dgiotcloud.cn/dgiot_swagger/#/Wechat/post_wechat）
  
  微信登录 --（http://prod.dgiotcloud.cn/dgiot_swagger/#/Wechat/get_wechat）
  
#### 设备 <br/>
   设备查询 --（http://prod.dgiotcloud.cn/dgiot_swagger/#/Device/get_classes_device）
   
--- 部门 <br/>
   部门查询 --（http://prod.dgiotcloud.cn/dgiot_swagger/#/_Role/get_roletree）
   
#### 产品 <br/>
  产品查询 --（http://prod.dgiotcloud.cn/dgiot_swagger/#/Product/get_classes_product）
  
#### 获取部门token <br/>
  拉取获取对应部门token--（http://prod.dgiotcloud.cn/dgiot_swagger/#/_User/get_token）

### 导入外部组件库
Wux Weapp  ----https://wux-weapp.github.io/wux-weapp-docs/#/introduce

### 联系方式

<!-- |联系方式 | 地址 |
|--------|---------|
|微信    | ![](https://dhiot.donghuanet.com:8000/group1/default/20220111/15/43/7/wx)      | -->
