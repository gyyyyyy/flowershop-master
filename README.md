# flowershop-master
web app assignment 1

- [flowershop-master](#flowershop-master)
  * [Basic Inforamtion](#basic-inforamtion)
  * [Link](#Link)
  * [Brief Description of Functionality](#brief-description-of-functionality)
  * [Persistence Approach](#persistence-approach)
  * [Git Approach](#git-approach)
  * [DX (Developer eXperience) Approach](#dx--developer-experience--approach)
  * [References](#references)
  
## Basic Inforamtion
- ID: 20086441
- Name: Yiyuan Gao

## Link
- [testvideo1](https://youtu.be/B7JX_aaRk1k)
- [testvideo2](https://youtu.be/BtL6jsxbj-E)
- [github link](https://github.com/gyyyyyy/flowershop-master/)
## Brief Description of Functionality
This project is a backend of a onlinshop app, it could do some basic `CRUD` operations.
Design the RESTful API for the shop
- `general` (./routes/general.js)
    - GET      -   /general/list      -list all product for index page
    - POST       -  /general/search   -fuzzy search for user
- `admin` (./routes/admin.js)
    - POST      -  /admin/product     -add product
    - GET       -  /admin/product     -get all products
    - GET       -  /admin/product/:id   -get product by id
    - DELETE      - /admin/product/:id   -delete product by id
    - PUT      -  /admin/product/:id     -edit product by id
    - GET     -  /admin/order             -get all orders
    - GET      -  /admin/order/:id        -get order by id
    - DELETE     -  /admin/order/:id      -delete order by id
    - PUT      -  /admin/order/:id      -  edit order by id
    
    
    
- `user` (./routes/user.js)
    - POST      -   /user/register    -user register
    - POST       -   /user/login      -user login
    - POST      -   /user/change      -user change password
    - GET      -   /user/checkLogin   -check login by checking cookies 
    - POST    -   /user/logout        -user logout
    - POST      -   /user/addCart     -user add product to cart
    - GET    -   /user/cartList       -user cart list
    - GET      -   /user/getCartCount -user cart count
    - POST    -   /user/cartDel       -user delete product from cart
    - POST    -   /user/cartEdit      -user edit info of cart
    - POST    -  /user/editCheckAll   -user check all products in cart
    - POST    -  /user/payment        -user buy products in the cart
    - GET    -   /user/orderDetail    -user get order detail by orderid
    - GET      -   /user/orderList    -user orderlist
 
    


## Persistence Approach
- App:
The whole project is deployed to [Heroku](https://www.heroku.com).
- Link：
https://flowershop-master.herokuapp.com/ 
https://git.heroku.com/flowershop-master.git
- MongoDB:
The MongoDB is deployed by using MongoAtlas
- Authentication:
User registration is verified in the background
User login using cookies authentication
## Git Approach
- This project adopts `Git bash` locally, while using `Github` as the remote repository for management.
- Url to the repository: https://github.com/gyyyyyy/flowershop-master/
- The status of this repository is `public`.
- Please refer to the `git log` for my commiting records.
## DX (Developer eXperience) Approach
- Automated testing:
    - Using `mocha`,`lodash` ,`superTest`,`chai` to do automated testing.
- Code quality:
    - Using `nyc` to generate `code coverage report`.
- API test tool
    - Using Postman to batch testing


## References
- [Mr. David Drohan's course](https://tutors-design.netlify.com/course/wit-wad-2-2019.netlify.com)
- [Node.js](https://nodejs.org/zh-cn/)
- [MongoDB](https://www.mongodb.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Mongoose](https://mongoosejs.com/)
- [Mongoose docs](http://www.nodeclass.com/api/mongoose.html#quick_start)
- [mocha](https://mochajs.org/)
- [chai](https://www.chaijs.com/)
- [supertest](https://github.com/visionmedia/supertest)
- [nyc](https://github.com/istanbuljs/nyc)
- [Postman](https://www.getpostman.com/)


