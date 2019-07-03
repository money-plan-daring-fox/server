const kue = require('kue')
const queue = kue.createQueue()
const axios = require('axios')
// const db = require('../api/firebase')
import db from '../api/firebase'

/* istanbul ignore file */

module.exports = {
    sendNotifWeekly() {
        queue.create('pushNotifWeekly', {
            title: 'Push Notif Weekly',
        }).save(function (err) {
            if (!err) {
                console.log('success')
            }
        })
        queue.process('pushNotifWeekly', (job, done) => {
            // axios
            //     .post('https://exp.host/--/api/v2/push/send', {
            //         to: 'ExponentPushToken[Ki4qWeBkl-DoZflIsrfopb]',
            //         icon: '../assets/icon.jpg',
            //         title: 'Sudah seminggu nih, jangan lupa sisihkan duit ya brong!',
            //         body: 'Biar sedikit asal mengigit',
            //         sound: 'default',
            //         data: {
            //             brokol: 'kompos'
            //         },
            //     })
            done()
        })
    },
    watchEverydayForNotifications() {
        queue.create('checkPushNotifEveryday', {
            title: 'Check for push notif everyday',
        }).save(function(err) {
            if(!err) {
                console.log('success notif lancar')
            }
        })
        queue.process('checkPushNotifEveryday', (job,done) => {
            db.firestore()
            .collection('users')
            .get()
            .then((docs) => {
                docs.forEach((docUser) => {

                    if(docUser.data().expoToken){
                        console.log(docUser.data().expoToken)
                        db.firestore()
                        .collection('plants')
                        .where('uid', '==', docUser.data().uid)
                        .get()
                        .then((docs) => {
                            docs.forEach((docPlant) => {
                                axios
                                .post('https://exp.host/--/api/v2/push/send', {
                                    to: docUser.data().expoToken,
                                    // icon: '../assets/icon.jpg',
                                    title: 'Ayo nabung lagi',
                                    body: 'sudah waktunya anda nabung',
                                    sound: 'default',
                                    data: {
                                        title: 'Ayoo nabung broo',
                                        body: 'brobrorobrobro!',
                                        date: new Date(),
                                        userUid: docUser.data().uid,
                                        id: docUser.id
                                    },
                                })
                                .then(() =>{
                                    console.log('daily check done')
                                    done()
                                })
                            })
                        })
                    }
                })
            })
            .catch(err => {
                console.log(err)
                done()
            })
        })
    }
}

// expo push HP martin: ExponentPushToken[XlBc2UHFzjif8DMLs3NXB5]
// ExponentPushToken[Ki4qWeBkl-DoZflIsrfopb]