const express = require('express');
const app = express();

app.set('view engine', 'ejs');
const port = process.env.PORT || 3001

app.listen(port);

app.use(express.json());

const db = require('./configs/Database');
const User = require('./models/User');

app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    User.findAll().then(users => {
        res.render('index', {users: users});
    }).catch(err => console.log('dota'));
})

app.get('/user', (req, res) => {
    User.findAll({
        where:{
            cc: 123456789
        }
    }).then(user => res.send(user)).catch(err => console.log(err));
})