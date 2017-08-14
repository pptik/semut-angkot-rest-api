const app = require('../app');
const moment = require('moment');
let database = app.db;
let userCollection = database.collection('tb_user');
let sessionCollection = database.collection('tb_session');
const autoIncrement = require("mongodb-autoincrement");
const md5 = require('md5');

/** find registered email **/
findEmail = (email) => {
    return new Promise((resolve, reject)=>{
        userCollection.find({Email :email}).toArray( (err, results) => {
            if(err)reject(err);
            else resolve(results);
        });
    });
};

/** find registered number **/
findPhoneNumber = (phoneNumber) => {
    return new Promise((resolve, reject) => {
        userCollection.find({PhoneNumber :phoneNumber}).toArray((err, results) => {
            if(err) reject(err);
            else resolve(results);
        });
    });
};

/** find registered platnomor **/
findPlatNomor = (platnomor) => {
    return new Promise((resolve, reject) => {
        userCollection.find({PhoneNumber :platnomor}).toArray((err, results) => {
            if(err) reject(err);
            else resolve(results);
        });
    });
};

/** find registered username **/
findUserName = (username) => {
    return new Promise((resolve, reject) =>{
        userCollection.find({username :username}).toArray( (err, results) => {
            if(err) reject(err);
            else resolve(results);
        });
    });
};


/** initial session **/
initSession = (userID) => {
    return new Promise((resolve, reject) =>{
        sessionCollection.find({"UserID": userID, "EndTime": "0000-00-00 00:00:00"})
            .toArray((err, results) => {
                if(err)reject(err);
                else {
                    if(results[0]){
                        sessionCollection.updateOne({ID: results[0].ID},{ $set: { EndTime : moment().format('YYYY-MM-DD HH:mm:ss')}},
                            (err, result) => {
                            if(err) reject(err);
                            else {
                                let _query = {UserID: userID, ID: md5(userID+"-"+moment().format('YYYYMMDDHHmmss')),
                                    StartTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                    LastTime:moment().format('YYYY-MM-DD HH:mm:ss'),
                                    EndTime: "0000-00-00 00:00:00"};
                                sessionCollection.insertOne(_query, (err, result) => {
                                    if (err) reject(err);
                                    else resolve(result);
                                });
                            }
                        });
                    }else {
                        let _query = {UserID: userID, ID: md5(userID+"-"+moment().format('YYYYMMDDHHmmss')),
                            StartTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                            LastTime:moment().format('YYYY-MM-DD HH:mm:ss'),
                            EndTime: "0000-00-00 00:00:00"};
                        sessionCollection.insertOne(_query, (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        });
                    }
                }
        });
    });
};


/** get session **/
getSession = (userID) => {
    return new Promise((resolve, reject) =>{
        sessionCollection.find({"UserID": userID, "EndTime": "0000-00-00 00:00:00"})
            .toArray((err, results) => {
                if(err) reject(err);
                else resolve(results[0].ID);
            });
    });
};


updateUserLocation = (query) => {
  return new Promise((resolve, reject) => {
      userCollection.updateOne({ID: query['ID']},{ $set:
          {
              Angkot : {
                  location:
                      {
                          type: 'Point',
                          coordinates:[query['longitude'], query['latitude']]
                      }
              }
          }
      }, function(err, result) {
          if(err){
              reject(err);
          }else {
             resolve(result);
          }
      });
  });
};


/** check session **/
checkSession = (sessid) => {
    return new Promise((resolve, reject) =>{
        sessionCollection.find({ID: sessid, "EndTime": "0000-00-00 00:00:00"})
            .toArray((err, results) => {
                if (err) reject(err);
                else
                    if(results[0]) resolve (results[0].UserID);
                    else resolve(null);
            });
    });
};





/** check complete session **/
checkCompleteSession = (sessid) => {
    return new Promise((resolve, reject) =>{
        sessionCollection.find({ID: sessid})
            .toArray((err, results) => {
            if (err) reject(err);
            else
                if(results[0]) {
                    userCollection.find({ID: results[0].UserID})
                        .toArray((err, ress) => {
                        if(err)reject(err);
                        else resolve({UserID: results[0].UserID, Name: ress[0].Name, Email: ress[0].Email});
                    });
                }else resolve(null);
        });
    });
};


/** change online status **/
changeOnlineStatus = (status, userID) => {
    return new Promise((resolve, reject) => {
        userCollection.updateOne({ID: userID}, {$set: {Status_online: status}}, (err, items) => {
            console.log(items);
            if(err) reject(err);
            else resolve(items);
        });
    });
};


/** get profile by id **/
getProfileById = (iduser) => {
    return new Promise((resolve, reject) =>{
        let _id = parseInt(iduser);
        userCollection.find({ID: _id})
            .toArray((err, results) => {
            if (err) reject(err);
            else
                if(results[0]) {
                    let data = results[0];
                    delete data['Password'];
                    delete data['_id'];
                    delete data['flag'];
                    delete data['foto'];
                    delete data['PushID'];
                    delete data['Path_foto'];
                    delete data['Nama_foto'];
                    delete data['Path_ktp'];
                    delete data['Nama_ktp'];
                    delete data['facebookID'];
                    //    delete data['ID_role'];
                    delete data['ID_ktp'];
                    delete data['Plat_motor'];
                    delete data['VerifiedNumber'];
                    delete data['Barcode'];
                    delete data['Status_online'];
                    resolve(data);
                }else resolve(null);
        });
    });
};



/** insert user**/
insertUser = (query) => {
    return new Promise((resolve, reject) =>{
        let email = query.Email;
        let phonenumber = query.Phonenumber;
        let gender = query.Gender;
        let birthday = query.Birthday;
        let password = query.Password;
        let name = query.Name;
        let username = query.Username;
        autoIncrement.getNextSequence(database, 'tb_user', 'ID', (err, autoIndex) => {
            if(err) reject(err);
            else {
                let userQuery = {
                    "ID" : autoIndex,
                    "Name" : name,
                    "username" : username,
                    "Email" : email,
                    "CountryCode" : 62,
                    "PhoneNumber" : phonenumber,
                    "Gender" : gender,
                    "Birthday" : birthday,
                    "Password" : md5(password),
                    "Joindate" : moment().format('YYYY-MM-DD HH:mm:ss'),
                    "Poin" : 100,
                    "PoinLevel" : 100,
                    "AvatarID" : gender,
                    "facebookID" : null,
                    "Verified" : 0,
                    "VerifiedNumber" : null,
                    "Visibility" : 0,
                    "Reputation" : 0,
                    "flag" : 1,
                    "Barcode" : "",
                    "deposit" : 0,
                    "ID_role" : null,
                    "Plat_motor" : null,
                    "ID_ktp" : null,
                    "foto" : null,
                    "PushID" : "no id",
                    "Status_online" : null,
                    "Path_foto" : null,
                    "Nama_foto" : null,
                    "Path_ktp" : null,
                    "Nama_ktp" : null
                };
                userCollection.insertOne(userQuery, (err, result) => {
                    if(err) reject(err);
                    else resolve(result);
                });
            }
        });
    });
};


/** insert user angkot**/
insertUserAngkot = (query) => {
    return new Promise((resolve, reject) =>{
        let email = query['email'];
        let phonenumber = query['phonenumber'];
        let trayek = query['trayek'];
        let trayekID = parseInt(query['trayek_id']);
        let gender = 3;
        let birthday = 'N/A';
        let password = query['password'];
        let name = query['name'];
        let username = query['platnomor'].toUpperCase();
        let platNomor = query['platnomor'].toUpperCase();
        autoIncrement.getNextSequence(database, 'tb_user', 'ID', (err, autoIndex) => {
            if(err) reject(err);
            else {
                let userQuery = {
                    "ID" : autoIndex,
                    "Name" : name,
                    "username" : username,
                    "Email" : email,
                    "CountryCode" : 62,
                    "PhoneNumber" : phonenumber,
                    "Gender" : gender,
                    "Birthday" : birthday,
                    "Password" : md5(password),
                    "Joindate" : moment().format('YYYY-MM-DD HH:mm:ss'),
                    "Poin" : 100,
                    "PoinLevel" : 100,
                    "AvatarID" : gender,
                    "facebookID" : null,
                    "Verified" : 0,
                    "VerifiedNumber" : null,
                    "Visibility" : 0,
                    "Reputation" : 0,
                    "flag" : 1,
                    "Barcode" : "",
                    "deposit" : 0,
                    "ID_role" : 20,
                    "Plat_motor" : null,
                    "ID_ktp" : null,
                    "foto" : null,
                    "PushID" : "no id",
                    "Status_online" : null,
                    "Path_foto" : null,
                    "Nama_foto" : null,
                    "Path_ktp" : null,
                    "Nama_ktp" : null,
                    "Angkot" : {
                        "PlatNomor" : platNomor,
                        "Trayek": {
                            "Nama": trayek,
                            "TrayekID" : trayekID
                        },
                        "JumlahPenumpang" : 0,
                        "location" : {
                            "type": "Point",
                            "coordinates": [0,0]
                        }
                    }

                };
                userCollection.insertOne(userQuery, (err, result) => {
                    if(err) reject(err);
                    else resolve(result);
                });
            }
        });
    });
};




/** insert user**/
insertUser = (query) => {
    return new Promise((resolve, reject) =>{
        let email = query['email'];
        let phonenumber = query['phonenumber'];
        let gender = 3;
        let birthday = 'N/A';
        let password = query['password'];
        let name = query['name'];
        let username = query['username'];
        autoIncrement.getNextSequence(database, 'tb_user', 'ID', (err, autoIndex) => {
            if(err) reject(err);
            else {
                let userQuery = {
                    "ID" : autoIndex,
                    "Name" : name,
                    "username" : username,
                    "Email" : email,
                    "CountryCode" : 62,
                    "PhoneNumber" : phonenumber,
                    "Gender" : gender,
                    "Birthday" : birthday,
                    "Password" : md5(password),
                    "Joindate" : moment().format('YYYY-MM-DD HH:mm:ss'),
                    "Poin" : 100,
                    "PoinLevel" : 100,
                    "AvatarID" : gender,
                    "facebookID" : null,
                    "Verified" : 0,
                    "VerifiedNumber" : null,
                    "Visibility" : 0,
                    "Reputation" : 0,
                    "flag" : 1,
                    "Barcode" : "",
                    "deposit" : 0,
                    "ID_role" : 0,
                    "Plat_motor" : null,
                    "ID_ktp" : null,
                    "foto" : null,
                    "PushID" : "no id",
                    "Status_online" : null,
                    "Path_foto" : null,
                    "Nama_foto" : null,
                    "Path_ktp" : null,
                    "Nama_ktp" : null,
                    "PlatNomor" : null
                };
                userCollection.insertOne(userQuery, (err, result) => {
                    if(err) reject(err);
                    else resolve(result);
                });
            }
        });
    });
};



module.exports = {
    findEmail:findEmail,
    findPhoneNumber:findPhoneNumber,
    findUserName:findUserName,
    initSession:initSession,
    getSession:getSession,
    checkSession:checkSession,
    checkCompleteSession:checkCompleteSession,
    changeOnlineStatus:changeOnlineStatus,
    getProfileById:getProfileById,
    insertUser:insertUser,
    insertUserAngkot:insertUserAngkot,
    findPlatNomor:findPlatNomor,
    insertUser:insertUser,
    updateUserLocation:updateUserLocation
};