const app = require('../app');
const moment = require('moment');
let ObjectId = require('mongodb').ObjectId;
let database = app.db;
let penumpangCollection = database.collection('tb_angkot_penumpang');


/** update status penumpang **/
updateStatusPenumpang = (query) =>{
  return new Promise(async(resolve, reject) =>{
      try {
          let result = await penumpangCollection.updateOne(
              {
                "_id" : new ObjectId(query['object_id'])
              },
              {
                $set : {"jumlah_penunggu" : 0}
              });
          resolve(result);
      }catch (err){
          reject(err);
      }
  });
};



insertPenumpang = (query) => {
  return new Promise( async(resolve, reject) => {
      query['time'] = new Date();
      query['trayek_id'] = parseInt(query['trayek_id']);
      query['flag'] = parseInt(query['flag']);
      query['jumlah_penunggu'] = parseInt(query['jumlah_penunggu']);
      try {
          let result = await penumpangCollection.insert(query);
         // console.log(result);
          resolve(result['ops'][0]['_id']);
      }catch (err){
          reject(err);
      }

  });
};


module.exports = {
    insertPenumpang: insertPenumpang,
    updateStatusPenumpang:updateStatusPenumpang
};