const app = require('../app');
const moment = require('moment');
let ObjectId = require('mongodb').ObjectId;
let database = app.db;
let penumpangCollection = database.collection('tb_angkot_penumpang');
let logPenumppangCollection = database.collection('tb_angkot_log_penumpang');


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


/** cek status penumpang **/
checkStatusPenumpang = (query) =>{
  return new Promise(async(resolve, reject) =>{
      try{
          let result = await penumpangCollection.find({
              "_id" : new ObjectId(query['object_id']),
              "time": {
                  $gte : new Date(new Date().getTime() - 1000 * 60 * 30)
              }
          }).toArray();
         // console.log(result);
          resolve(result);
      }catch (err){
          console.log(err);
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

insertLogPenumpang = (query) => {
    return new Promise(async(resolve, reject) => {
        let trayek_id = parseInt(query['trayek_id']);
        let state = parseInt(query['state']);
        let longitude = query['longitude'];
        let latitude = query['latitude'];
		let no_angkot = "N/A";
		
		if(query['plat_nomor'] !== undefined)		
			no_angkot = query['plat_nomor'];
		
		let logQuery = {
			"trayek_id" : trayek_id,
			"angkot" : no_angkot,
			"state" : state,
			"longitude" : longitude,
			"latitude" : latitude,
			"datetime" : new Date()
		}
        try{
            let result = await logPenumppangCollection.insertOne(logQuery);
            resolve(result);
        }catch(err){
            reject(err);
        }
    });
};

module.exports = {
    insertPenumpang: insertPenumpang,
    updateStatusPenumpang:updateStatusPenumpang,
    checkStatusPenumpang:checkStatusPenumpang,
    insertLogPenumpang: insertLogPenumpang
};