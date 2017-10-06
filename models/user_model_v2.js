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
        strategies.push(query['strategy']);
        let user = {
            "Version" : 2,
            "Email" : query['Email'],
            "Strategies" : strategies,
            "CreatedAt" : new Date(),
            "CheckPoint" : 1
        };
        try{
            let result = await userCollection.insertOne(user);
            resolve(result);
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
                  tokenResult = await requisition('https://graph.facebook.com/app?access_token='+query['Token']);
                  tokenResult = await tokenResult.json();
                  //console.log(tokenResult);
                  invalid = (tokenResult.hasOwnProperty('error'));
                  if(!invalid) userPropic = profileUtils.facebookProfic(query['id']);
                  break;
              case AVAILABLE_STRATEGIES.GOOGLE:
                  tokenResult = await profileUtils.validateGoogleToken(query['Token']);
                  tokenResult = JSON.stringify(tokenResult);
                  console.log(tokenResult);
                  invalid = (tokenResult.hasOwnProperty('failed'));
                  break;
          }
          if(invalid)resolve(false);
          else {
              /*let users = await userCollection.find({
                  "Email": query['Email']
              }).toArray();*/
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