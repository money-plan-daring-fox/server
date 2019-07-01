const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../app')
const sinon = require('sinon')
const sinonChai = require("sinon-chai")
const cron = require('../helpers/cronJob')

chai.use(chaiHttp)
chai.use(sinonChai)

describe('TEST 1: app.js', function() {
    
    describe('GET /', function() {
        it('should give response equal to "Push Notification Server Running"', function(done){
            chai.request(app)
            .get('/')
            .end(function(err,res) {
                expect(res.text).to.equal('Push Notification Server Running')
                done()
            })
        })
    })

    describe('POST /token', function () {
        let body = {token: {
            value: 'ExponentPushToken[Ki4qWeBkl-DoZflIsrfopb]'
        }}
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

    describe('POST /message', function() {
        let body = {
            message: 'Test message'
        }
        it('should give response equal to "Received message, Test message"', function(done) {
            chai.request(app)
                .post('/message')
                .send(body)
                .end(function(err,res) {
                    expect(res.text).to.equal(`Received message, Test message`)
                    done()
                })
        })
    })

    describe('Test CronJon', function() {
        this.timeout(15000)
        let cron = sinon.spy()
        it('should call cron function', function(done) {
            chai.request(app)
                .get('/')
                .end(function(err,res) {
                    expect(cron).to.have.been.called()
                    done()
                })
        })
    })

    describe('Test handlePushTokens function', function() {
        let body = {token: {
            value: null
        }}
        it('', function (done) {
            chai.request(app)
                .post('/token')
                .send(body)
                .end(function (err, res) {
                    chai.request(app)
                        .post('/message')
                        .send({message: 'test'})
                        .end(function(err,res) {
                            console.log(res,'opop')
                            expect(res.text).to.equal(`Received message, test`)
                            done()
                        })
                })
        })
    })
})