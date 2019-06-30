const {sendNotifWeekly} = require('./kueSendEmail')
const axios = require('axios')

module.exports = function () {
    sendNotifWeekly()
}