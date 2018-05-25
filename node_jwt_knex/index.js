// we put dotenv in the  beginning in case we needed anything from dotenv file while we are loading
const dotenv = require('dotenv'); 
dotenv.config();
const express = require('express');
const bodyparser = require('body-parser');
const app = new express();
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt; 
const knex = require('knex'); 
const knexDb = knex({ client:'pg', connection:'postgress://localhost/jwt_test'});
const bookshelf = require('bookshelf');
const securePassword = require('bookshelf-secure-password');
const db = bookshelf(knexDb);
db.plugin(securePassword);
const jwt = require('jsonwebtoken');

const User = db.Model.extend({
    tableName: 'login_user',
    hasSecurePassword: true
});


const opts ={
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_OR_KEY
};

const strategy = new JwtStrategy(opts, (payload, next) =>{
 // TODO:GET USER FROM DB
    User.forge({ id: payload.id }).fetch().then(res =>{
        next(null, res); // we don't send the password down to the user
    });   
});

passport.use(strategy);
app.use(passport.initialize());
app.use(bodyparser.urlencoded({
    extended: false
}) );

app.use(bodyparser.json());

app.get('/', (req, res) =>{
    res.send("Hello from server 4000")
})

app.post('/seedUser', (req, res)=>{
   if(!req.body.email || !req.body.password){
       return res.status(401).send('File the fields, please!')
   } 
   
   const user = new User({
       email: req.body.email,
       password: req.body.password
   });

   user.save().then(() => { res.send('Login successed!');
    });
});

app.post('/getToken', (req, res)=>{
   
    if (!req.body.email || !req.body.password){
        // console.log(req.body);
        return res.status(401).send('You have inserted a wrong username or password') 
    }

    User.forge({ email: req.body.email}).fetch().then(resualt =>{
        if(!resualt){
            return res.status(400).send('user not exist');
        }
    resualt.authenticate(req.body.password).then(user =>{
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.SECRET_OR_KEY);
            res.send(token);
            // console.log(res.body.password);
        })
        .catch(err =>{
            return res.status(401).send({ err });
        });
    });
});

app.get('/protected', passport.authenticate('jwt', { session: false}), (req, res)=>{
    res.send('I am protected');
});

app.get('.getUser', passport.authenticate('jwt', { session: false}), (req, res)=>{
    res.send(res.user);
})

const port = process.env.port || 4000;

app.listen(port);