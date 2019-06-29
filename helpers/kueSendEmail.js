// const kue = require('kue')
// const queue = kue.createQueue()
// const nodemailer = require('nodemailer')
// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     auth: {
//         service: 'gmail',
//         type: 'Oauth2',
//         user: process.env.user,
//         clientId: process.env.clientId,
//         clientSecret: process.env.clientSecret,
//         refreshToken: process.env.refreshToken,
//         accessToken: process.env.accessToken
//     }
// })

// module.exports = {
//     sendEmailWelcome(to) {
//         queue.create('email', {
//             title: 'Welcome to Snap Overflow',
//             to: to,
//             template: 'welcome-email'
//         }).save(function (err) {
//             if (!err) {
//                 console.log('mantap')
//             }
//         })
//         queue.process('email', (job, done) => {
//             mailer(to)
//             done()
//         })
//     },
//     sendWeeklyEmail(to, content) {
//         queue.create('emailWeek', {
//             tile: 'Here are our weekly list',
//             to: to,
//             template: 'weekly-email'
//         }).save(function (err) {
//             if (!err) {
//                 console.log('mantap')
//             }
//         })
//         queue.process('emailWeek', (job, done) => {
//             mailerWeekly(to, content)
//             done()
//         })
//     }
// }

// function mailer(to) {
//     let mail = {
//         from: 'qoyyimafiassalam@gmail.com',
//         to: to,
//         subject: 'Warm Welcome to Snap Overflow!',
//         text: 'Welcome to Snap Overflow. Feel free to ask and answer questions in this small-scale Stack Overflow! Check on us at http://snapoverflow.qfs-hacktiv8.com'
//     }
//     transporter.sendMail(mail, function (error, info) {
//         if (error) {
//             console.log(error)
//         } else {
//             console.log('Email sent: ' + info.response)
//         }
//     })
// }

// function mailerWeekly(to, content) {
//     toSendContent = JSON.stringify(content, null, 2) + "\n \n \n Visit us at http://snapoverflow.qfs-hacktiv8.com"
//     for (var i = 0; i < to.length; i++) {
//         var mail = {
//             from: 'qoyyimafiassalam@gmail.com',
//             to: to[i],
//             subject: 'Here Are Our Weely top List!',
//             text: toSendContent,
//         }
//         transporter.sendMail(mail, function (error, info) {
//             if (error) {
//                 console.log(error)
//             } else {
//                 console.log('Email-weekly sent: ' + info.response)
//             }
//         })
//     }
// }