const app = require('../app');
const moment = require('moment');
let database = app.db;
let trayekCollection = database.collection('tb_angkot_trayek');
let penumpangCollection = database.collection('tb_angkot_penumpang');
let trayekPathCollection = database.collection('tb_angkot_trayek_bandung_test');

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


getTryekPath = async() =>{
    return new Promise(async(resolve, reject) => {
        try{
            let path = await trayekPathCollection.find({}).toArray();
            resolve(path);
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
         let penumpang_forward_flag = await penumpangCollection.find({
             "trayek_id" : parseInt(query['trayek_id']),
             "flag" : 0,
             "time": {
                 $gte : new Date(new Date().getTime() - 1000 * 60 * 30)
             }
         }).toArray();
         let penumpang_backward_flag = await penumpangCollection.find({
             "trayek_id" : parseInt(query['trayek_id']),
             "flag" : 1,
             "time": {
                 $gte : new Date(new Date().getTime() - 1000 * 60 * 30)
             }
         }).toArray();
         result = result[0];
         let forward_flag_count = 0;
         for(let i = 0; i < penumpang_forward_flag.length; i++){
             forward_flag_count += penumpang_forward_flag[i]['jumlah_penunggu'];
         }
         let backward_flag_count = 0;
         for(let i = 0; i < penumpang_backward_flag.length; i++){
             backward_flag_count += penumpang_backward_flag[i]['jumlah_penunggu'];
         }
         result['Arah'][0]['JumlahPenunggu'] = forward_flag_count;
         result['Arah'][1]['JumlahPenunggu'] = backward_flag_count;
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
    getTrayek:getTrayek,
    getTryekPath:getTryekPath
};