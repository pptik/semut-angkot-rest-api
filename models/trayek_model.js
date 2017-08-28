const app = require('../app');
const moment = require('moment');
let database = app.db;
let trayekCollection = database.collection('tb_angkot_trayek');
let penumpangCollection = database.collection('tb_angkot_penumpang');

/** tambah penumpang **/
tambahPenumpang = (query) => {
    return new Promise((resolve, reject) =>{
        try{
            let result = trayekCollection.updateOne(
                {
                    "TrayekID" : parseInt(query['trayek_id']),
                    "Arah.Flag" : parseInt(query['flag'])
                },
                {
                    $inc : {
                        "Arah.$.JumlahPenunggu" : parseInt(query['jumlah_penunggu'])
                    }
                }
            );
            resolve(result);
        }catch (err){
            reject(err);
        }
    });
};


/** get penumpang **/
getPenumpang = (query) =>{
  return new Promise(async(resolve, reject) =>{
     try {
         let result = await trayekCollection.find({
             "TrayekID" : parseInt(query['trayek_id'])
         }).toArray();
         let penumpang = await penumpangCollection.find({
             "trayek_id" : parseInt(query['trayek_id'])
         }).toArray();
         console.log(penumpang);
         result['test'] = penumpang;
         resolve(result);
     }catch (err){
         reject(err);
     }
  });
};


/** get trayek **/
getTrayek = () =>{
    return new Promise(async(resolve, reject)=>{
        try{
            let result = await trayekCollection.find({}).toArray();
            resolve(result);
        }catch (err){
            reject(err);
        }
    });
};



module.exports = {
    tambahPenumpang:tambahPenumpang,
    getPenumpang:getPenumpang,
    getTrayek:getTrayek
};