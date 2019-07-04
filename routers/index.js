const router = require('express').Router()
const controllers = require('../controllers/index')

router.get('/getItemsPrice', controllers.getItemsPrice)
router.post('/notifPlantComplete', controllers.notifPlantComplete)

module.exports = router