var mongoose = require('mongoose');

var CartSchema = new mongoose.Schema({
    "userName":String,
    "cartList":[
        {
            "productId":String,
            "productName":String,
            "salePrice":String,
            "productImage":String,
            "checked":String,
            "productNum":String
        }
    ]
},{ collection: 'cart' });

module.exports = mongoose.model("Cart",CartSchema);