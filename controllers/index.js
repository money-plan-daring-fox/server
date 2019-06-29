const axios = require('axios')
const client = require('../redis/client')

module.exports = {
    getItemsPrice(req,res,next) {
        // let { key } = req.query
        let key = req.query.key.split(' ').join('%20')

        console.log(key)

        axios
        .get('https://ace.tokopedia.com/search/product/v3?scheme=https&device=desktop&related=true&catalog_rows=5&source=search&ob=23&st=product&rows=60&q='+key+'&safe_search=false&fcity=174,175,176,177,178')
        .then(({data}) => {
            res.status(200).json(data.data.products)
        })
        .catch(err => {
            next(err)
        })
    },
    getRecommendation(req,res,next) {
        client.get('recommendation',((err,replies) => {
            if(replies){
                res.status(200).json(JSON.parse(replies))
            } else {
                axios
                .get('https://hades.tokopedia.com/v1/categories?filter=type==tree&safe_search=false')
                .then(({data}) => {
                    client.set('recommendation', JSON.stringify(data))
                    client.expireat('recommendation', parseInt((+new Date)/1000) + 86400)
                    res.status(200).json(data)
                })
                .catch(err => {
                    next(err)
                })

            }
        }))
    }
    
}