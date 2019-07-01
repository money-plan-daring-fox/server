const {sendNotifWeekly} = require('./kueSendNotif')
const axios = require('axios')

module.exports = function () {
    sendNotifWeekly()
}