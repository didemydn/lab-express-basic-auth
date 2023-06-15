const { Router } = require('express');
const router = new Router();

const NewUser = require("../models/User.model");

const bcryptjs = require('bcryptjs');
const saltRounds = 10;
 
//SIGNUP//

// GET route ==> to display the signup form to users

router.get("/signup", (req, res) => res.render("auth/signup"))

// POST route ==> to process form data

router.post("/signup", (req, res, next) => {
    console.log('req.body', req.body)
    const { username, password } = req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return NewUser.create({
        username,
        password: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
      res.redirect(`/auth/profile/${userFromDB.username}`)
    })
    .catch(error => next(error));

});

router.get('/auth/profile/:username', (req, res) => res.render('auth/profile'));

//LOGIN//

// GET route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));

// POST login route ==> to process form data
router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const { username, password } = req.body;
   
    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, username and password to login.'
      });
      return;
    }
   
    NewUser.findOne({ username })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Username is not registered.' });
          return;
        } else if (bcryptjs.compareSync(password, user.password)) {
          const {username} = user;
          console.log(username);
          req.session.currentUser = username;
          res.render('auth/profile', {username});
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });

module.exports = router;