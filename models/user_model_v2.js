const app = require('../app');
const moment = require('moment');
let database = app.db;
let userCollection = database.collection('tb_user');
const https = require('https');
const FACEBOOK_TOKEN_CHECKER_URI = "https://graph.facebook.com/app?access_token=";
const GOOGLE_TOKEN_CHECKER_URI = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=";
const AVAILABLE_STRATEGIES = {
    FACEBOOK : "facebook",
    GOOGLE : "google"
};

const requisition = require('requisition');
let profileUtils = require('../utilities/profile_utils');


/** insert user V2 **/
insertUserV2 = (query) =>{
    return new Promise(async(resolve, reject) =>{
        let strategies = [];
        strategies.push(query['Strategy']);
        let user = {
            "Version" : 2,
            "Email" : query['Email'],
            "Strategies" : strategies,
            "CreatedAt" : new Date(),
            "Profile" : {
                "CheckPoint" : 1,
                "Picture" : query['Image'],
                "DisplayName" : query['Name']
            }
        };
        try{
            let result = await userCollection.insertOne(user);
            resolve(result["ops"][0]);
        }catch (err){
            reject(err);
        }
    });
};

/** Login **/
loginv2 = (query) => {
  return new Promise(async(resolve, reject) => {
      try {
          let strategy = query['Strategy'];
          let invalid;
          let tokenResult = {};
          let userPropic;
          switch (strategy){
              case AVAILABLE_STRATEGIES.FACEBOOK:
                  console.log(strategy);
                  tokenResult = await requisition('https://graph.facebook.com/me?access_token='+query['Token']);
                  tokenResult = await tokenResult.json();
                  invalid = (tokenResult.hasOwnProperty('error'));
                  if(!invalid) userPropic = profileUtils.facebookProfic(tokenResult['id']);
                  break;
              case AVAILABLE_STRATEGIES.GOOGLE:
                  /* gplus api not store access_token */

                  break;
          }
          if(invalid)resolve(false);
          else {
              let users = await userCollection.find({
                  "Version": 2,
                  "Email": query['Email'],
                  "Profile.CheckPoint": 1
              }).toArray();
              if(users.length > 0){
                  resolve(users[0]);
              }else {
                  switch (strategy){
                      case AVAILABLE_STRATEGIES.FACEBOOK:
                          query['Image'] = profileUtils.facebookProfic(query['id']);
                          break;
                      case AVAILABLE_STRATEGIES.GOOGLE:
                          query['Image'] = await profileUtils.gplusProfic(query['id']);
                          break;
                  }
                  users = await insertUserV2(query);
                  resolve(users);
              }

              resolve(tokenResult);
          }
      }catch (err){
          reject(err);
      }
  });
};


module.exports = {
    insertUserV2:insertUserV2,
    loginv2:loginv2
};