var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Cart = require('../models/cart');
var Order = require('../models/order');
var Product = require('../models/product');
var mongoose = require('mongoose');
require('./../util/util')

mongoose.connect('mongodb+srv://dbUser:dbUserPassword@wit-flowershop-cluster-7zj9e.mongodb.net/flowerdb?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error', function (err) {
  console.log('connection error', err);
});
db.once('open', function () {
  console.log('connected to database');
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//register
router.post('/register', function (req, res) {
  const newUser = new User({
    userName : req.body.userName,
    userPwd : req.body.userPwd,
    // status: req.body.status
  });
  const newCart = new Cart({
    userName : req.body.userName

  });
  const userName = req.body.userName;
  User.find({userName: userName},(err, docs) => {
    if(docs.length > 0) {
      res.json({isSuccess: false, message: 'User already exists!'})
    } else {
      db.collection("cart").insert({"userName":userName})
      db.collection("order").insert({"userName":userName})
    newUser.save(err => {
    const datas =  err ? {isSuccess: false} : {isSuccess: true, message: 'Registered successfully',data:newUser}
    res.json(datas);
  });
  }
  })

});

//login
router.post('/login', function (req, res) {
  const userName = req.body.userName;
  const userPwd = req.body.userPwd;
  if (userName === undefined||'') {
    res.json({isSuccess: false, message: 'The username cannot be empty.'});
    return;
  }
  if (userPwd === undefined||'') {
    res.json({isSuccess: false, message: 'The password cannot be empty'});
    return;
  }
  User.find({userName: userName}, function (err, user) {
    if(user.length === 0) {
      res.json({isSuccess: false, message: 'User does not exist.'});
    } else if (user[0].userPwd === userPwd) {
      res.cookie("userName",userName,{
        path:'/',
        maxAge:1000*60*60
      });
      if (user[0].isAdmin === true){
        res.json({isSuccess: true, isAdmin: true, message: 'Log in successfully!'});
      }
      else{
        res.json({isSuccess: true, isAdmin: false,message: 'Log in successfully!'});
      }

    } else if (user[0].userPwd !== userPwd) {
      res.json({isSuccess: false, message: 'Password is incorrect, please enter it again'});
    }
  });
});

// change password
router.post('/change', function (req, res) {
  const userName = req.body.userName;
  const oldPwd = req.body.userPwd;
  const newPwd = req.body.newPwd;
  User.find({userName: userName}, function (err, user) {
    if(user.length === 0) {
      res.send({isSuccess: false, message: 'User does not exist'});
    } else {
      const data = user[0];
      if(data.userPwd === oldPwd) {
        data.userPwd = newPwd;
        data.save(err => {
          const datas =  err ? {isSuccess: false, message: 'Password change failed'} : {isSuccess: true, message: 'Password changed successfully'}
          res.json(datas);
        });
      } else {
        res.json({isSuccess: false, message: 'Password is incorrect, please enter it again'});
      }
    }
  });
});

//logout
router.post("/logout", function (req,res,next) {
  res.cookie("userName","",{
    path:"/",
    maxAge:-1
  });
  res.json({
    status:"0",
    msg:'Log out successfully',
    result:''
  })
});

//checkLogin
router.get("/checkLogin",function(req,res,next){
  if(req.cookies.userName){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName || ''
    });
  }else{
    res.json({
      status:'1',
      msg:'Please log in',
      result:''
    })
  }
})

//add product to cart
router.post("/addCart", function (req,res,next) {
  var userName = req.cookies.userName,productId = req.body.productId;
  Cart.findOne({userName:userName}, function (err,userDoc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      console.log("userDoc:"+userDoc);
      if(userDoc){
        var goodsItem = '';
        userDoc.cartList.forEach(function (item) {
          if(item.productId == productId){
            goodsItem = item;
            item.productNum ++;
          }
        });
        if(goodsItem){
          userDoc.save(function (err2,doc2) {
            if(err2){
              res.json({
                status:"1",
                msg:err2.message
              })
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'suc',
                data:userDoc
              })
            }
          })
        }else{
          Product.findOne({productId:productId}, function (err1,doc) {
            if(err1){
              res.json({
                status:"1",
                msg:err1.message
              })
            }else{
              if(doc){
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2,doc2) {
                  if(err2){
                    res.json({
                      status:"1",
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'suc',
                      data:userDoc
                    })
                  }
                })
              }
            }
          });
        }
      }
    }
  })
});


//
router.get("/getCartCount", function (req,res,next) {
  if(req.cookies && req.cookies.userName){
    console.log("userName:"+req.cookies.userName);
    var userName = req.cookies.userName;
    Cart.findOne({"userName":userName}, function (err,doc) {
      if(err){
        res.json({
          status:"0",
          msg:err.message
        });
      }else{
        let cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function(item){
          cartCount += parseFloat(item.productNum);
        });
        res.json({
          status:"0",
          msg:"",
          result:cartCount
        });
      }
    });
  }else{
    res.json({
      status:"0",
      msg:"User not exist"
    });
  }
});
//query the shopping cart data of the current user
router.get("/cartList", function (req,res,next) {
  var userName = req.cookies.userName;
  Cart.findOne({userName:userName}, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        });
      }
    }
  });
});

//delete product from cart
router.post("/cartDel", function (req,res,next) {
  var userName = req.cookies.userName,productId = req.body.productId;
  Cart.update({
    userName:userName
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  });
});

//edit cart
router.post("/cartEdit", function (req,res,next) {
  var userName = req.cookies.userName,
      productId = req.body.productId,
      productNum = req.body.productNum,
      checked = req.body.checked;
  Cart.update({"userName":userName,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked,
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  })
});
//check all
router.post("/editCheckAll", function (req,res,next) {
  var userName = req.cookies.userName,
      checkAll = req.body.checkAll?'1':'0';
  Cart.findOne({userName:userName}, function (err,cart) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(cart){
        cart.cartList.forEach((item)=>{
          item.checked = checkAll;
        })
        cart.save(function (err1,doc) {
          if(err1){
            res.json({
              status:'1',
              msg:err1,message,
              result:''
            });
          }else{
            res.json({
              status:'0',
              msg:'',
              result:'suc'
            });
          }
        })
      }
    }
  });
});
//payment
router.post("/payment", function (req,res,next) {
  var userName = req.cookies.userName,
      orderTotal = req.body.orderTotal;
  var goodsList = [];
  Cart.findOne({userName:userName}, function (err,doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      });
    }else{

      doc.cartList.filter((item)=>{
        if(item.checked=='1'){
          goodsList.push(item);
        }
      });
    }
  })
  Order.findOne({userName:userName}, function (err,doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      });
    }else{
      var platform = '622';
      var r1 = Math.floor(Math.random()*10);
      var r2 = Math.floor(Math.random()*10);

      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platform+r1+sysDate+r2;
      var order = {
        orderId:orderId,
        orderTotal:orderTotal,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:createDate
      };

      doc.orderList.push(order);

      doc.save(function (err1,doc1) {
        if(err1){
          res.json({
            status:"1",
            msg:err.message,
            result:''
          });
        }else{
          res.json({
            status:"0",
            msg:'',
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          });
        }
      });
    }
  })

});
//get order by id
router.get("/orderDetail", function (req,res,next) {
  var userName = req.cookies.userName,orderId = req.param("orderId");
  Order.findOne({userName:userName}, function (err,order) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      var orderList = order.orderList;
      if(orderList.length>0){
        var orderTotal = 0;
        orderList.forEach((item)=>{
          if(item.orderId == orderId){
            orderTotal = item.orderTotal;
          }
        });
        if(orderTotal>0){
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }else{
          res.json({
            status:'120002',
            msg:'order not exist',
            result:''
          });
        }
      }else{
        res.json({
          status:'120001',
          msg:'no order of this user',
          result:''
        });
      }
    }
  })
});
router.get("/orderList", function (req,res,next) {
  var userName = req.cookies.userName;
  Order.findOne({userName:userName}, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.orderList
        });
      }
    }
  });
});


module.exports = router;
