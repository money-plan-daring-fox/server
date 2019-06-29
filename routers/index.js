const router = require('express').Router()
const controllers = require('../controllers/index')

router.get('/getItemsPrice', controllers.getItemsPrice)
router.get('/getRecommendation', controllers.getRecommendation)

module.exports = router