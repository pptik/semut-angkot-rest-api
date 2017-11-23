const app = require('../app');
const moment = require('moment');
let database = app.db;
let userCollection = database.collection('tb_user');

getActiveBike = async() =>{
    return new Promise(async(resolve, reject) =>{
        try {
            let bikes = await userCollection.find(
                { $and:
                    [
                        { Version: 2 },
                        { Profile: { $exists: true } },
                        {"Profile.location.coordinates": {$ne: [0,0] }},
                        {"Profile.Biker" : true}
                    ] }
            ).toArray();
            resolve(bikes);
        }catch (err){
            reject(err);
        }
    });
};


module.exports = {
    getActiveBike:getActiveBike
};