const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../Models/Profile');
const User = require('../../Models/Profile');
const { check, validationResult } = require('express-validator/check');
// @route Get api/Profile/me
//@desc   get current users profile
//@acess  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'there is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error ');
  }
});

// @route POST api/Profile/
//@desc   Create or Update User profil
//@acess  Private
router.post(
  '/',
  [
    auth,
    [
      check('age', 'age is required ').not().isEmpty(),
      check('symptoms', 'symptoms are required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { bio, plan, sexe, age, symptoms } = req.body;
    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (bio) profileFields.bio = bio;
    if (plan) profileFields.plan = plan;
    if (sexe) profileFields.sexe = sexe;
    if (age) profileFields.age = age;
    if (symptoms) {
      profileFields.symptoms = symptoms.split(',').map((symptoms) => symptoms.trim());
    }
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error ');
    }
  }
); 
 
// @route GET api/Profile/
//@desc   get all profiles
//@acess  Public
router.get('/user/:user_id',async (req,res)=>{
  try {
    const profile = await Profile.findOne({user : req.params.user_id}).populate('user',['name','avatar'])
    if (!profile) return res.status(400).json({msg:'Profile not found'})
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    if (err.kind == 'ObjectId'){
      return res.status(400).json({msg: 'Profile not found'})
    }
    res.status(500).send('server error')
  }
})
// @route DELETE api/Profile/
//@desc   Delete profile,user
//@acess  Private
router.delete('/',auth,async (req,res)=>{
  try {
    // Remove profile
     await Profile.findOneAndRemove({user: req.user.id})
     // Remove user
     await User.findOneAndRemove({_id: req.user.id})
     res.json({msg: 'User deleted'})
    res.json(profiles)
  } catch (err) { 
    console.error(err.message)
    res.status(500).send('server error')
  }
})

module.exports = router;
