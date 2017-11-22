const app = require('../app');
let database = app.db;
let notifCollection = database.collection('tb_notifikasi');


getNotif = () =>{
  return new Promise(async(resove, reject) =>{
      try {
          let notif = await notifCollection.find().sort({created_at: -1}).toArray();
          resove(notif[0]);
      }catch (err){
          reject(err);
      }
  });
};

module.exports = {
    getNotif:getNotif
};


