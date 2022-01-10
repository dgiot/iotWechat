import {
  request
} from './config/request';
import{
  SaveEvidence,
  EvidenceQuery,
  Head,
  drawxnqx
} from "./config/api"
//查询证据管理
export function saveEvidence(id,data) {
  return new Promise(function (resolve, reject) {
    request({
      url: SaveEvidence+`/?id=${id}`,
      data,
      method:"POST"
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
//删除上传证据
export function DelEvidence(id) {
  return new Promise(function (resolve, reject) {
    request({
      url: EvidenceQuery+`/${id}`,  //iotapi/classes/Device
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

//修改证据管理
export function updateEvidence(id,data) {
  return new Promise(function (resolve, reject) {
    request({
      url: EvidenceQuery+`/${id}`,
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
//获取平均数值 EvidenceQuery
export function getAllAveData(data) {
  return new Promise(function (resolve, reject) {
    request({
      url: EvidenceQuery,
      data
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
//Head 获取数据列表表头
export function GetHead(data) {
  return new Promise(function (resolve, reject) {
    request({
      url: Head,
      data,
      method:"POST"
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
//drawxnqx 计算平均数据
export function GetAveData(data) {
  return new Promise(function (resolve, reject) {
    request({
      url: drawxnqx,
      data,
      method:"POST"
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