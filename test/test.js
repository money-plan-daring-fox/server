const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../app')
const sinon = require('sinon')
const sinonChai = require("sinon-chai")
const kueFunc = require('../helpers/kueSendNotif')
const axios = require('axios')

chai.use(chaiHttp)
chai.use(sinonChai)

describe('TEST 1: app.js', function () {
    describe('GET /', function () {
        it('should give response equal to "Push Notification Server Running"', function (done) {
            chai.request(app)
                .get('/')
                .end(function (err, res) {
                    expect(res.text).to.equal('Push Notification Server Running')
                    done()
                })
        })
    })

    describe('POST /token', function () {
        let body = {
            token: {
                value: 'ExponentPushToken[Ki4qWeBkl-DoZflIsrfopb]'
            }
        }
        it('', function (done) {
            chai.request(app)
                .post('/token')
                .send(body)
                .end(function (err, res) {
                    expect(res.text).to.equal('Received push token, ExponentPushToken[Ki4qWeBkl-DoZflIsrfopb]')
                    done()
                })
        })
    })

    describe('POST /message', function () {
        let body = {
            message: 'Test message'
        }
        it('should give response equal to "Received message, Test message"', function (done) {
            chai.request(app)
                .post('/message')
                .send(body)
                .end(function (err, res) {
                    expect(res.text).to.equal(`Received message, Test message`)
                    done()
                })
        })
    })

    describe('Test CronJob', function() {
        // let stub = sinon.stub(cron)
        it('should call cron function', function(done) {
            chai.request(app).keepOpen()
            .get('/')
            .end(async function(err,res) {
                    await console.log(sinon.stub(kueFunc, 'sendNotifWeekly').called, 'opopop')
                    // expect(cron).to.have.been.called()
                    done()
                })
        })
    })

    describe('Test handlePushTokens function', function () {
        let body = {
            token: {
                value: null
            }
        }
        it('', function (done) {
            chai.request(app)
                .post('/token')
                .send(body)
                .end(function (err, res) {
                    chai.request(app)
                        .post('/message')
                        .send({
                            message: 'test'
                        })
                        .end(function (err, res) {
                            expect(res.text).to.equal(`Received message, test`)
                            done()
                        })
                })
        })
    })
})

describe('TEST 2: controllers/index.js', function () {
    this.timeout(5000)
    describe('/users/getItemsPrice without price query', function () {
        it('should test /getItemsPrice without price query', function (done) {
            chai.request(app)
                .get('/users/getItemsPrice?key=iphone X')
                .end(function (err, res) {
                    if (err) {
                        console.log(err)
                    } else {
                        expect(res.body).to.be.an('array')
                    }
                    done()
                })

        })
    })
    describe('/users/getItemsPrice with price query', function () {
        it('should test /getItemsPrice with price query', function (done) {
            chai.request(app)
                .get('/users/getItemsPrice?key=iphone&price=12800000')
                .end(function (err, res) {
                    if (err) {
                        console.log(err)
                    } else {
                        expect(res.body).to.be.an('array')
                    }
                    done()
                })
        })
    })
    describe('/users/getItemsPrice without query', function () {
        it('should test /getItemsPrice without query', function (done) {
            chai.request(app)
                .get('/users/getItemsPrice')
                .end(function (err, res) {
                    if (err) {
                        console.log(err)
                    }
                    done()
                })
        })
    })
})

