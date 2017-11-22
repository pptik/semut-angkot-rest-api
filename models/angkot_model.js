const app = require('../app');
let database = app.db;
let userCollection = database.collection('tb_user');
const converter = require('../utilities/converter');

/** get angkot location**/
getAngkot = () => {
    return new Promise((resolve, reject) => {
        userCollection.find(
            { $and:
                [
                    { ID_role: 20 },
                    { Angkot: { $exists: true } },
                    {"Angkot.location.coordinates": {$ne: [0,0] }}
                ] }
        ).toArray((err, results) =>{
            if(err)reject(err);
            else {
                for(let i = 0; i < results.length; i++){
                    results[i]['Angkot']['LastUpdate'] = converter.convertISODateToString(results[i]['Angkot']['LastUpdate']);
                }
                resolve(results);
            }
        });
    });
};


module.exports = {
    getAngkot:getAngkot
};