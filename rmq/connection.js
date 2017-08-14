const rmq_config = require('../configs/rmq.json');
let rmq = require('amqplib');

/** connect to rabbit**/
connect = async() => {
    try {
        let connection = await rmq.connect(rmq_config.broker_uri);
        await consume(connection);
    }catch (er){
        console.log(err);
    }
};


/** consume to incoming msg**/
consume = async (connection) => {
    try {
        let channel = await connection.createChannel();
        await channel.assertExchange(rmq_config.exchange_name, 'topic', {durable : false});
        let q = await channel.assertQueue(rmq_config.service_queue_name, {exclusive : false});
        await channel.bindQueue(q.queue, rmq_config.exchange_name, rmq_config.service_route);
        channel.consume(q.queue, (msg) => {
            console.log(msg.content.toString());
            /** update angkot location**/
            if(msg.fields.routingKey === rmq_config.route_update_angkot){

            }
        }, {noAck: true});
    }catch(err) {
        console.log(err);
    }
};


module.exports = {
    connect:connect
};