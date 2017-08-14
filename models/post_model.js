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
getPost = () =>{

};


module.exports = {
    createPost:createPost
};