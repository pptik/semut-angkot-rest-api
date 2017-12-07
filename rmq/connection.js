const rmq_config = require('../configs/rmq.json');
let rmq = require('amqplib');
const userService = require('./users');
const broadcaster = require('./broadcaster');
const userModel = require('../models/user_model_v2');

/** connect to rabbit**/
connect = async() => {
    try {
        let connection = await rmq.connect(rmq_config.broker_uri);
        await consume(connection);
        await broadcaster.broadcastAngkot(connection);
    }catch (err){
        console.log(err);
    }
};


/** consume to incoming msg**/
consume = async (connection) => {
    try {
        let channel = await connection.createChannel();
        await channel.assertExchange(rmq_config.exchange_name, 'topic', {durable : false});
        let q = await channel.assertQueue(rmq_config.service_queue_name, {exclusive : false});
        //Todo : service_queue_name binding -> x-angkot & x-general | 22/11/2017
        await channel.bindQueue(q.queue, rmq_config.exchange_name, rmq_config.service_route);
        channel.consume(q.queue, (msg) => {
            console.log("=================================================");
            console.log("Incoming msg : "+msg.content.toString());
			let startTime = new Date().getTime();
            /** update angkot location**/
            if(msg.fields.routingKey === rmq_config.route_update_angkot){
                let query = JSON.parse(msg.content.toString());
                console.log("-------------------------------------------------");
                console.log('UPDATE LOKASI ANGKOT');
                console.log("-------------------------------------------------");
                userService.updateUserLocation(query).then(result =>{
                    console.log("process success : "+JSON.stringify(result));
					let endTime = new Date().getTime();
					console.log("duration [ms] = " + (endTime-startTime));
                }).catch(err =>{
                   console("process failed : "+JSON.stringify(err));
				   let endTime = new Date().getTime();
				   console.log("duration [ms] = " + (endTime-startTime));
                });
            }
            else if(msg.fields.routingKey === rmq_config.route_update_user){
                let query = JSON.parse(msg.content.toString());
                console.log("-------------------------------------------------");
                console.log('UPDATE LOKASI USER');
                console.log("-------------------------------------------------");
                userModel.updateLocation(query).then(result =>{
                    console.log("Berhasil update lokasi");
					let endTime = new Date().getTime();
					console.log("duration [ms] = " + (endTime-startTime));
                }).catch(err =>{
                    console.log("Gagal update lokasi, cause : "+err);
					let endTime = new Date().getTime();
					console.log("duration [ms] = " + (endTime-startTime));
                })
            }
        }, {noAck: true});
        console.log("Service consume on : "+rmq_config.service_route);
    }catch(err) {
        console.log(err);
    }
};


module.exports = {
    connect:connect
};