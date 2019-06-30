const kue = require('kue')
const queue = kue.createQueue()
const axios = require('axios')

module.exports = {
    sendNotifWeekly() {
        queue.create('pushNotifWeekly', {
            title: 'Push Notif Weekly',
        }).save(function (err) {
            if (!err) {
                console.log('mantap')
            }
        })
        queue.process('pushNotifWeekly', (job, done) => {
            axios
                .post('https://exp.host/--/api/v2/push/send', {
                    to: 'ExponentPushToken[Ki4qWeBkl-DoZflIsrfopb]',
                    icon: '../assets/icon.jpg',
                    title: 'Sudah seminggu nih, jangan lupa sisihkan duit ya brong!',
                    body: 'Biar sedikit asal mengigit',
                    sound: 'default',
                    data: {
                        brokol: 'kompos'
                    },
                })
            done()
        })
    },
}

// expo push HP martin: ExponentPushToken[XlBc2UHFzjif8DMLs3NXB5]
// ExponentPushToken[Ki4qWeBkl-DoZflIsrfopb]