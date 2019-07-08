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
        }).save(function (err) {
            if (!err) {
                console.log('success notif lancar')
            }
        })
        queue.process('checkPushNotifEveryday', (job, done) => {
            db.firestore()
                .collection('users')
                .get()
                .then((docs) => {
                    docs.forEach((docUser) => {
                        if (docUser.data().expoToken) {
                            console.log(docUser.data().expoToken)
                            db.firestore()
                                .collection('plants')
                                .where('uid', '==', docUser.data().uid)
                                .get()
                                .then((docs) => {
                                    docs.forEach((docPlant) => {
                                        let toConvert = new Date(
                                            Number(
                                                docPlant.data().updatedAt.toDate()
                                            )
                                        )
                                        console.log(new Date(Number(
                                            docPlant.data().updatedAt.seconds +
                                            String(docPlant.data().updatedAt.nanoseconds / 1e6)
                                        )), 'ini tanggal')
                                        console.log(docPlant.data().name)
                                        let year = new Date(toConvert).getFullYear()
                                        let month = new Date(toConvert).getMonth()
                                        let date = new Date(toConvert).getDate()
                                        console.log(new Date(year, month + 1, date - 5).toDateString(), 'brooo')
                                        console.log(new Date().toDateString(), 'btooo2')
                                        console.log(new Date(year, month + 1, date - 5).toDateString() == new Date().toDateString())
                                        if (new Date(year, month + 1, date - 5).toDateString() == new Date().toDateString()) {
                                            console.log('yoyoy')
                                            axios
                                                .post('https://exp.host/--/api/v2/push/send', {
                                                    to: docUser.data().expoToken,
                                                    icon: '../assets/icon.jpg',
                                                    title: `Your ${docPlant.data().name} plant needs watering !`,
                                                    body: 'go and check your garden',
                                                    sound: 'default',
                                                    data: {
                                                        title: `Go and water ${docPlant.data().name} tree more` ,
                                                        body: '5 days more before the due day',
                                                        date: new Date(),
                                                        userUid: docUser.data().uid,
                                                        id: docUser.id
                                                    },
                                                })
                                                .then(() => {
                                                    console.log('daily check done')
                                                    done()
                                                })
                                        }
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