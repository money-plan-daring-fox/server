const router = require('express').Router()
const controllers = require('../controllers/index')

router.get('/getItemsPrice', controllers.getItemsPrice)
router.get('/getRecommendation', controllers.getRecommendation)
router.post('/users/push-token', controllers.pushToken)

module.exports = router