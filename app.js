// import ('dotenv').config()
import express from 'express'
import Expo from 'expo-server-sdk'
import cors from 'cors'
import kue from 'kue'
const router = require('./routers/index.js')
const app = express()
const expo = new Expo()
const PORT = 3001
const kueFunc = require('./helpers/kueSendNotif')
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
    /* istanbul ignore else  */
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

/* istanbul ignore next */

app.listen(PORT, function () {
    let cronTab = process.env.NODE_ENV === 'test' ? '* * * * * *' : '0 0 * * * *'
    console.log(`listening on port ${PORT}`)
    new CronJob(cronTab, function () {
        kueFunc.sendNotifWeekly()
    }, null, true, 'Asia/Jakarta')

    new CronJob('0 0 7 * * *', function() {
        kueFunc.watchEverydayForNotifications()
    }, null, true, 'Asia/Jakarta')
})

module.exports = app