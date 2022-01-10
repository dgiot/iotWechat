import {
  request
} from './config/request';
import{
  ProductQuery,
  ReportQuery,
  DeviceQuery,
  EvidenceQuery,
  UpLoad
} from "./config/api"
//查询证据管理
export function QueryEvidence(data) {
  return new Promise(function (resolve, reject) {
    request({
      url: EvidenceQuery,
      data,
    }).then(res=>{
      // console.log("query",res);
      if(res.statusCode==200||res.statusCode==201){
        resolve(res);
      } else {
        reject(res);
      }
    }).catch(err=>{
      reject(err);
    })
  });
}
//查询报告
export function QueryReport(data) {
  return new Promise(function (resolve, reject) {
    request({
      url: ReportQuery,
      data,
    }).then(res=>{
      // console.log("query",res);
      if(res.statusCode==200||res.statusCode==201){
        resolve(res);
      } else {
        reject(res);
      }
    }).catch(err=>{
      reject(err);
    })
  });
}
//查询设备
export function QueryDevice(data) {
  return new Promise(function (resolve, reject) {
    request({
      url: DeviceQuery,  //iotapi/classes/Device
      data,
    }).then(res=>{
      // console.log("query",res);
      if(res.statusCode==200||res.statusCode==201){
        resolve(res);
      } else {
        reject(res);
      }
    }).catch(err=>{
      reject(err);
    })
  });
}
//删除设备
export function DelDevice(id) {
  return new Promise(function (resolve, reject) {
    request({
      url: DeviceQuery+`/${id}`,  //iotapi/classes/Device
      method:"DELETE"
    }).then(res=>{
      // console.log("query",res);
      if(res.statusCode==200||res.statusCode==201){
        resolve(res);
      } else {
        reject(res);
      }
    }).catch(err=>{
      reject(err);
    })
  });
}
//文件上传
export function upLoad(data,header) {
  return new Promise(function (resolve, reject) {
    request({
      url: UpLoad,
      data,
      method:'POST',
      header
    }).then(res=>{
      // console.log("create",res);
      if(res.statusCode==201 ||res.statusCode==200){
        resolve(res);
      } else {
        reject(res);
      }
    }).catch(err=>{
      reject(err);
    })
  });
}
//保存数据
export function saveData(id,data) {
  return new Promise(function (resolve, reject) {
    request({
      url: DeviceQuery+`/${id}`,  //iotapi/classes/Device
      data,
      method:"PUT"
    }).then(res=>{
      // console.log("query",res);
      if(res.statusCode==200||res.statusCode==201){
        resolve(res);
      } else {
        reject(res);
      }
    }).catch(err=>{
      reject(err);
    })
  });
}
//删除保存现有数据
export function savenowData(id,data) {
  return new Promise(function (resolve, reject) {
    request({
      url: EvidenceQuery+`/${id}`,  //iotapi/classes/Device
      data,
      method:"PUT"
    }).then(res=>{
      // console.log("query",res);
      if(res.statusCode==200||res.statusCode==201){
        resolve(res);
      } else {
        reject(res);
      }
    }).catch(err=>{
      reject(err);
    })
  });
}