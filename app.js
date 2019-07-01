// import ('dotenv').config()
import express from 'express'
import Expo from 'expo-server-sdk'
import cors from 'cors'
import kue from 'kue'
import cron from './helpers/cronJob'
const router = require('./routers/index.js')
const app = express()
const expo = new Expo()
const PORT = 3001
// import * as CronJob from 'cron'
let {
    CronJob
} = require('cron')

// mongoose.connect('mongodb://localhost/DBNAME', {
//     useNewUrlParser: true})
// const db = mongoose.connection
// db.on('error', console.error.bind(console, 'connection error:'))
// db.once('open', function () {
//     console.log('connected')
// })

let savedPushTokens = [];

const saveToken = (token) => {
    if (savedPushTokens.indexOf(token === -1)) {
        savedPushTokens.push(token);
    }
}

const handlePushTokens = (message) => {
    let notifications = [];
    for (let pushToken of savedPushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }
        notifications.push({
            to: pushToken,
            sound: 'default',
            title: 'Message received!',
            body: message,
            data: {
                message
            }
        })
    }
    let chunks = expo.chunkPushNotifications(notifications);
    (async () => {
        for (let chunk of chunks) {
            await expo.sendPushNotificationsAsync(chunk);
        }
    })();
}

app.use(cors())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Push Notification Server Running');
});

app.use('/users', router)

app.post('/token', (req, res) => {
    saveToken(req.body.token.value);
    console.log(`Received push token, ${req.body.token.value}`);
    res.send(`Received push token, ${req.body.token.value}`);
});

app.post('/message', (req, res) => {
    handlePushTokens(req.body.message);
    console.log(`Received message, ${req.body.message}`);
    res.send(`Received message, ${req.body.message}`);
});

app.use("/kue-ui", kue.app)

app.listen(PORT, function () {
    console.log(`listening on port ${PORT}`)
    new CronJob('*/10000000 * * * * *', function () {
        cron()
    }, null, true, 'Asia/Jakarta')
})

module.exports = app