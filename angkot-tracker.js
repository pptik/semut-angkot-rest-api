const http = require('http');
const rmq = require('amqplib');
const rmq_config = require('./configs/rmq.json');
const database = require('./database/mongo_connection');

http.createServer(function(req, res){ 
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Angkot Tracker Service');
}).listen('3048');

console.log('=======================');
console.log('Angkot Tracker Service');
console.log('=======================');
main();

async function main(){
     try {
        // let dbConn = await database.connect();
        let connection = await rmq.connect(rmq_config.broker_uri);
        await consume(connection);
        //await broadcaster.broadcastAngkot(connection);
    }catch (err){
        console.log(err);
    }
}

async function updateUserLocation(dbconn, query){
    let userCollection = dbconn.collection('tb_user');
    let angkotHistory = dbconn.collection('tb_angkot_history');
    //console.log("param: "+JSON.stringify(query));
    return new Promise((resolve, reject) =>{
            userCollection.updateOne({ID: query['ID']},{ $set:
            {
                'Angkot.location.coordinates' : [query['data'][1], query['data'][0]],
                'Angkot.JumlahPenumpang' : 0,
                'Angkot.Speed': query['Speed'],
                //'Angkot.LastUpdate' : new Date(query['time'])
                'Angkot.LastUpdate' : new Date()
                /*Angkot : {
                    location:
                        {
                            type: 'Point',
                            coordinates:[query['longitude'], query['latitude']]
                        },
                    LastUpdate: query['time'],
                    JumlahPenumpang: query['jumlah_penumpang']
                }*/
            }
        }, (err, result) => {
            if(err){
                reject(err);
            }else {			
                angkotHistory.insertOne({
                    'location' : {
                        'type': 'Point',
                        'coordinates' : [query['data'][1], query['data'][0]]
                        },
                    'Speed' : query['Speed'],
                    'JumlahPenumpang' : 0,
                    'LastUpdate' : new Date(),
                    'ID' : query['ID']
                }, (err, result) => {
                    if(err) reject(err);
                    resolve(result);
                });
            }
        });
    });
};

async function insertTracker(dbconn, query){
    let angkotTrackers = dbconn.collection('angkot_trackers');
    return new Promise((resolve, reject) =>{
        angkotTrackers.insertOne({
            "MAC" : query['MAC'],
            "PlatNomor" : ""
        },(err, result) => {
            if(err) reject(err);
            else resolve(result);
        });
    });
};

async function getPlatNomor(dbconn, query){
    let angkotTrackers = dbconn.collection('angkot_trackers');
    return new Promise((resolve, reject) =>{
        angkotTrackers.find({MAC :query['MAC']}).toArray( (err, results) => {
            if(err) reject(err);
            else resolve(results);
        });
    });
};

async function findUserName(dbconn, platNomor){
    let userCollection = dbconn.collection('tb_user');
    return new Promise((resolve, reject) =>{
        userCollection.find({username :platNomor}).toArray( (err, results) => {
            if(err) reject(err);
            else resolve(results);
        });
    });
};

/** consume to incoming msg**/
consume = async (connection) => {
    try {        
        let dbConn = await database.connect();
        let channel = await connection.createChannel();
        await channel.assertExchange('amq.topic', 'topic', {durable : true});
        let q = await channel.assertQueue('angkotGPS', {exclusive : false});
        await channel.bindQueue(q.queue, 'amq.topic', 'angkot.gps');
        channel.consume(q.queue, (msg) => {
            console.log("=================================================");
            console.log("Incoming msg : "+msg.content.toString());
        
            let query = JSON.parse(msg.content.toString());
            //let query = JSON.parse('{"MAC":"5C:CF:7F:B2:FC:E1","Speed":0.20714,"date":"23/10/2017","time":"12:32:45","data":[-6.890473,107.6106]}');
                
            /**
             * GET PLAT NOMOR
             */
        
            getPlatNomor(dbConn, query).then(result => {
                if(result.length == 0){
                // insert 
                console.log("-------------------------------------------------");
                console.log('INSERT TRACKER TO LIST');
                console.log("-------------------------------------------------");
                insertTracker(dbConn, query).then(result =>{
                        console.log("process success : "+JSON.stringify(result));
                    }).catch(err =>{
                        console("process failed : "+JSON.stringify(err));
                    });
                }else{
                    //console.log('plat:'+result[0]['PlatNomor']);
                    if(result[0]['PlatNomor'] !== ""){
                        findUserName(dbConn, result[0]['PlatNomor']).then(results => {
                            //console.log('res[0]: '+results[0]['ID']);
                            query['ID'] = results[0]['ID'];
                            //console.log('userID: '+query['ID']);
                            if(query['ID'] !== undefined){
                                console.log("-------------------------------------------------");
                                console.log('UPDATE LOKASI TRACKER');
                                console.log("-------------------------------------------------");
                                //console.log('query: '+JSON.stringify(query));
                                updateUserLocation(dbConn, query).then(result =>{
                                    console.log("process success : "+JSON.stringify(result));
                                }).catch(err =>{
                                    console.log(err);
                                    console.log("process failed : "+JSON.stringify(err));
                                });
                            }
                        }).catch(err=>{
                            console.log(err);
                        });
                    }else{
                        console.log('PLAT NOMOR TRACKER BELUM TERDAFTAR')
                    }
                }
            }).catch(err=>{
                console.log(err);
            });
        }, {noAck: true});
        console.log("Service consume on : "+'angkot.gps');
    }catch(err) {
        console.log(err);
    }

    console.log('=========================');
}

