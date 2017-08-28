const app = require('../app');
const moment = require('moment');
let database = app.db;
let trayekCollection = database.collection('tb_angkot_penumpang');



insertPenumpang = (query) => {
  return new Promise( async(resolve, reject) => {
      query['time'] = new Date();
      query['trayek_id'] = parseInt(query['trayek_id']);
      query['flag'] = parseInt(query['flag']);
      query['jumlah_penunggu'] = parseInt(query['jumlah_penunggu']);
      try {
          let result = await trayekCollection.insert(query);
         // console.log(result);
          resolve(result['ops'][0]['_id']);
      }catch (err){
          reject(err);
      }

  });
};


module.exports = {
    insertPenumpang: insertPenumpang
};