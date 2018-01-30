const app = require('../app');
let database = app.db;
let userCollection = database.collection('tb_user');
const converter = require('../utilities/converter');

//initialize postgre db
const pgp = require('pg-promise')();
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'my-database-name',
    user: 'user-name',
    password: 'user-password'
};

const db = pgp(cn);

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

getAngkotTracker = () => {
	return new Promise((resolve, reject) => {
		db.any('SELECT devices.name, positions.longitude, positions.latitude, positions.devicetime FROM positions INNER JOIN devices ON positions.id = devices.positionid')
			.then(function(data) {
				// success;
				resolve(data);
			})
			.catch(function(error) {
				// error;
				reject(error);
			});
	});
};


module.exports = {
    getAngkot:getAngkot,
	getAngkotTracker:getAngkotTracker
};