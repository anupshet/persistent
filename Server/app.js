const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    var multer = require('multer');

    app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost:4200");
        res.header("Access-Control-Allow-Headers", "Unity-User-Context, Ocp-Apim-Subscription-Key, Origin, X-Requested-With, Content-Type, Accept");
        // res.header('Access-Control-Expose-Headers', 'Content-Length');
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });

    /** Serving from the same express Server
    No cors required */
    app.use(express.static('../client'));
    app.use(bodyParser.json());


    // INstantiating the express-jwt middleware
const jwtMW = exjwt({
    secret: 'keyboard cat 4 ever'
});


// MOCKING DB just for test
let users = [
    {
        id: 1,
        firstName : 'Julia',
        lastName : 'Henderson',
        email: 'test1@bio-rad.com',
        role: 'Admin'
    },
    {
        id: 2,
        firstName : 'Gabrielle',
        lastName : 'Skinner',
        email: 'test2@bio-rad.com',
        role: 'Admin'
    },
    {
        id: 3,
        firstName : 'Olivia',
        lastName : 'Gill',
        email: 'test3@bio-rad.com',
        role: 'Admin'
    },
    {
        id: 4,
        firstName : 'Frank',
        lastName : 'Bailey',
        email: 'test4@bio-rad.com',
        role: 'Admin'
    },
	{
        id: 5,
        firstName : 'Sebastian',
        lastName : 'Payne',
        email: 'test5@bio-rad.com',
        role: 'User'
    },
	{
        id: 6,
        firstName : 'Alan',
        lastName : 'Mitchell',
        email: 'test6@bio-rad.com',
        role: 'User'
    },
	{
        id: 7,
        firstName : 'Penelope',
        lastName : 'Wallace',
        email: 'test7@bio-rad.com',
        role: 'User'
    },
	{
        id: 8,
        firstName : 'Sarah',
        lastName : 'Rees',
        email: 'test8@bio-rad.com',
        role: 'User'
    },
	{
        id: 9,
        firstName : 'Nathan',
        lastName : 'North',
        email: 'test9@bio-rad.com',
        role: 'User'
    },
	{
        id: 10,
        firstName : 'Elizabeth',
        lastName : 'Ellison',
        email: 'test10@bio-rad.com',
        role: 'User'
    }
];



    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

    /** API path that will upload the files */
    app.post('/upload', function(req, res) {
        upload(req,res,function(err){
			console.log(req.file);
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });
    });

    app.get('/mock/userManagement/',(req, res) => {
     res.json(users);
      return res;
    });

    app.post('/mock/userManagement/',(req, res) => {
        res.json(users);
         return res;
     });

    app.put('/mock/userManagement/',(req, res) => {
        res.json(users);
         return res;
     });

    app.listen('3001', function(){
        console.log('running on 3001...');
    });

