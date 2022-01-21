const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../Models/User');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const config = require('config');
// @route Get api/Auth
//@desc   Test route
//@acess  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});
// @route POST api/auth
//@desc   Authenticate user & get  token
//@acess  Public
router.post(
  '/',
  [
    check('email', 'please include a valid email ').isEmail(),
    check('password', 'password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'invalid Credentials' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'invalid Credentials' }] });
      }
      // return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600000000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('chenhy elli chenhy');
    }
  }
);
module.exports = router;
