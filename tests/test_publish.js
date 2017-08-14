const amqp = require('amqplib/callback_api');
const broker_uri = require('../configs/rmq.json').broker_uri;
const exchangeName = require('../configs/rmq.json').exchange_name;
const routingKey = 'semut.angkot.test';

amqp.connect(broker_uri, function(err, conn) {
    conn.createChannel(function(err, ch) {
        ch.assertQueue('', {exclusive: true}, function(err, q) {
            let msg = {
                SessionID: 'a89acaab4ecaec506a90384945497559',
                Latitude: 0.0,
                Longitude: 0.0,
                EmergencyID: 5,
                EmergencyType: 'Panic Button'
            };
            ch.publish(exchangeName, routingKey, new Buffer(JSON.stringify(msg)),
                {});
            console.log(" [x] Sent ");
        });
    });
});