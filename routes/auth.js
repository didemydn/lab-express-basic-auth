const { Router } = require('express');
const router = new Router();

const User = require("../models/User.model");

const bcryptjs = require('bcryptjs');
const saltRounds = 10;
 

// GET route ==> to display the signup form to users

router.get("/signup", (req, res) => res.render("auth/signup"))

// POST route ==> to process form data

router.post("/signup", (req, res, next) => {
    //console.log(req.body)
    const { username, password } = req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        password: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
    })
    .catch(error => next(error));
})

module.exports = router;