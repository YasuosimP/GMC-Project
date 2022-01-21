const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");
const gravatar = require("gravatar");
const config = require("config");
//User model
const User = require("../../Models/User");
// @route POST api/users
//@desc   Register user
//@acess  Public
router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "please include a valid email ").isEmail(),
    check(
      "password",
      "please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ errors: [{ msg: "User Already exists" }] });
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      // encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, 
        config.get("jwtSecret"),
        {expiresIn:360000}, 
        (err,token)=>{
            if(err) throw err;
            res.json({token})
        });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);
module.exports = router;
