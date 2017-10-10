const app = require('../app');
const moment = require('moment');
let database = app.db;
let cctvCollection = database.collection('tb_cctv');

getBandungCctv = async() =>{
  return new Promise(async(resolve, reject) =>{
      try {
          let cctvs = await cctvCollection.find({
              "CityID": 1
          }).toArray();
          resolve(cctvs);
      }catch (err){
          reject(err);
      }
  });
};


module.exports = {
    getBandungCctv:getBandungCctv
};