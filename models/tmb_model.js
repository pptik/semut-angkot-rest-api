const app = require('../app');
let database = app.db;

let tmbCollection = database.collection('tb_tmb_tracker');

getTmbLocation = () =>{
    return new Promise(async(resolve, reject) =>{
        try {
            let tmbs = await tmbCollection.find({}).toArray();
            resolve(tmbs);
        }catch (err){
            reject(err);
        }
    });
};

module.exports = {
    getTmbLocation:getTmbLocation
};
