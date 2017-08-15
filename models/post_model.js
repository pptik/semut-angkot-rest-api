const app = require('../app');
const moment = require('moment');
let database = app.db;
let postCollection = database.collection('tb_post_angkot');

/** buat laporan **/
createPost = (query) =>{
  return new Promise(async(resolve, reject) =>{
      try{
          let result = await postCollection.insertOne(query);
          resolve(result);
      }catch (err) {
          reject(err);
      }
  });
};


/** get laporan by date**/
getPosts = () =>{
    return new Promise(async(resolve, reject) =>{
        try {
            //let dateNow = new Date();
            let dateNow = moment().format("YYYY-MM-DD")+" 00:00:00";
            //console.log(dateNow);
            let response = await postCollection.find(
                {
                    tanggal : { $gte : new Date(dateNow)}
                }
            ).toArray();
            resolve(response);
        }catch (err){
            console.log(err);
            reject(err);
        }
    });
};


module.exports = {
    createPost:createPost,
    getPosts:getPosts
};