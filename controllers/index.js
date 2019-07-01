const axios = require('axios')
const client = require('../redis/client')

module.exports = {
    getItemsPrice(req,res,next) {
        let key
        if(req.query.key){
            key = req.query.key.split(' ').join('%20')
        } 
        let price = req.query.price
        
        axios
        .get('https://ace.tokopedia.com/search/product/v3?scheme=https&device=desktop&related=true&catalog_rows=5&source=search&ob=23&st=product&rows=60&q='+key+'&safe_search=false&fcity=174,175,176,177,178')
        .then(({data}) => {
            if (!price&&!key){
                let err =  new Error('no query!')
                throw err
            }
            let result = data.data.products.filter(el => {
                let dataPrice = el.price
                .split("")
                .filter(el => el.match(/^[0-9]*$/))
                .join("");
                return Number(dataPrice) < Number(price)+(0.1*(Number(price))) && Number(dataPrice) > (Number(price) - (0.1*Number(price))) 
            })
            /* istanbul ignore else */
            if(price){
                res.status(200).json(result)
            } else if (data.data.products.length > 0 ) {
                res.status(200).json(data.data.products)
            }
        })
        .catch(err => {
            res.status(500).json(err.response)
        })
    },
    // getRecommendation(req,res,next) {
    //     client.get('recommendation',((err,replies) => {
    //         if(replies){
    //             res.status(200).json(JSON.parse(replies))
    //         } else {
    //             axios
    //             .get('https://hades.tokopedia.com/v1/categories?filter=type==tree&safe_search=false')
    //             .then(({data}) => {
    //                 client.set('recommendation', JSON.stringify(data))
    //                 client.expireat('recommendation', parseInt((+new Date)/1000) + 86400)
    //                 res.status(200).json(data)
    //             })
    //             .catch(err => {
    //                 next(err)
    //             })

    //         }
    //     }))
    // },
    // pushToken(req,res,next) {
    //     console.log('ooi')
    //     axios
    //     .post('https://exp.host/--/api/v2/push/send',{
    //        to: 'ExponentPushToken[Ki4qWeBkl-DoZflIsrfopb]',
    //        icon: '../assets/icon.jpg',
    //        title: 'Sudah seminggu nih, jangan lupa sisihkan duit ya brong!',
    //        body: 'Biar sedikit asal mengigit',
    //        sound: 'default',
    //        data: {sip:'Mantoel'},
    //     })
    //     .then(data => {
    //         res.status(200)
    //     })

    // }
    
}