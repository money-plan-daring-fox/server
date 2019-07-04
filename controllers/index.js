const axios = require('axios')
const client = require('../redis/client')

module.exports = {
    getItemsPrice(req, res, next) {
        let key
        if (req.query.key) {
            key = req.query.key.split(' ').join('%20')
        }
        let price = req.query.price

        axios
            .get('https://ace.tokopedia.com/search/product/v3?scheme=https&device=desktop&related=true&catalog_rows=5&source=search&ob=23&st=product&rows=60&q=' + key + '&safe_search=false&fcity=174,175,176,177,178')
            .then(({
                data
            }) => {
                if (!price && !key) {
                    let err = new Error('no query!')
                    throw err
                }
                let result = data.data.products.filter(el => {
                    let dataPrice = el.price
                        .split("")
                        .filter(el => el.match(/^[0-9]*$/))
                        .join("");
                    return Number(dataPrice) < Number(price) + (0.1 * (Number(price))) && Number(dataPrice) > (Number(price) - (0.1 * Number(price)))
                })
                /* istanbul ignore else */
                if (price) {
                    res.status(200).json(result)
                } else if (data.data.products.length > 0) {
                    res.status(200).json(data.data.products)
                }
            })
            .catch(err => {
                res.status(500).json(err.response)
            })
    },
    notifPlantComplete(req, res) {
        let toPush = req.body.toPush
        axios
            .post('https://exp.host/--/api/v2/push/send', {
                to: toPush.expoToken,
                icon: '../assets/icon.jpg',
                title: 'Good Job!',
                body: 'You have successfully saved your money to buy '+toPush.item,
                sound: 'default',
                data: {
                    title: 'One step more to buy '+toPush.item,
                    body: 'Easily press "BUY '+toPush.item.toUpperCase() +'!!" on saving detail section!',
                    date: new Date(),
                    userUid: toPush.uid,
                    id: toPush.id,
                    link: toPush.link,
                    data: toPush.data
                },
            })
            .then(() => {
                res.status(200).json('plant-complete notification success')
                done()
            })
            .catch(err => {
                // console.log(err.response, 'inierror dari server')
            })
    }
}