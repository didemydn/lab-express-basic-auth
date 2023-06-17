const { Router } = require('express');
const router = new Router();

const NewUser = require("../models/User.model");
const  {isLoggedIn} = require('../middleware/route-guard');

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
          user.loggedIn = true;
          res.render('auth/profile', {username});
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });

  //PROFILE

  router.get('/auth/profile/:username', isLoggedIn, (req, res, next) => {
    // Session is configured ---> req.session
   // Use session to persist user loggedIn state ---> req.session.currentUser
     if(req.session.currentUser){
         NewUser.findOne({ username: req.session.currentUser.username })
          .then(foundUser => {
              console.log('foundUser', foundUser)
              foundUser.loggedIn = true; // adding a property loggedIn and setting it to true
              res.render('auth/profile', foundUser)
          })
          .catch(err => console.log(err))
      }
      else{
        res.render('auth/profile')
      }
  });

  router.get('/auth/profile/main', isLoggedIn, (req, res) => {res.render('auth/main')});

  router.get('/auth/profile/private',isLoggedIn, (req, res) => {res.render('auth/private')});

module.exports = router;