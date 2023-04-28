const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route GET api/profile/me
//@desc  Get current users profile
//@access Public
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    ); // To bring fields from other models

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route POST api/profile
//@desc  Create or update user profile
//@access Public

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req); // to get the errors

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
      // spread the rest of the fields we don't need to check
      ...rest
    } = req.body;

    // Build profile object

    const profileFields = {};

    profileFields.user = req.user.id; // know which user id from token
    if (company) profileFields.company = company;
    if (website) profileFields.company = website;
    if (location) profileFields.company = location;
    if (bio) profileFields.company = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim()); // to change skills into an array of skills
    }

    // Build Social Object
    profileFields.social = {}; // to make an object with all the socials
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    // Now we can instert the data

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields }, // To update all fields
          { new: true }
        );

        return res.json(profile);
      }

      //Create if none found above
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile); // send the profile back as a response
    } catch (err) {
      console.error(err.message);
      return res.status(500).json("Server Error");
    }
  }
);

//@route GET api/profile
//@desc  Get all profiles
//@access Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server Error");
  }
});

//@route GET api/profile/user/:user_id
//@desc  Get all profiles
//@access Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id, // Get user id from params of the request
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "Profile Not Found" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if ((err.kind = "ObjectId")) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    return res.status(500).json("Server Error");
  }
});

//@route DELETE api/profile
//@desc  Get all profiles
//@access Public

router.delete("/", auth, async (req, res) => {
  try {
    // @todo - remove users posts

    // Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id }); // get user id from token
    // Remove User
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User Deleted " });
  } catch (err) {
    console.error(err.message);
    if ((err.kind = "ObjectId")) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    return res.status(500).json("Server Error");
  }
});

//@route PUT api/profile/experience
//@desc  Add profile experience --> Put is used because we are updating some sort of separate part of profile
//@access Public

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure body sent by user
    const { title, company, location, from, to, current, description } =
      req.body;

    // Object with data submitted by user ^
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp); // pushes experience in beginning
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route DELETE api/profile/experience/:exp_id
//@desc  Get experience from profile
//@access Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get Remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id); // Get index of experience to remove

    profile.experience.splice(removeIndex, 1); // remove it

    await profile.save(); // save new profile

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route PUT api/profile/education
//@desc  Add profile education --> Put is used because we are updating some sort of separate part of profile
//@access Public

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
      check("fieldofstudy", "Frield of study is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure body sent by user
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    // Object with data submitted by user ^
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu); // pushes experience in beginning
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route DELETE api/profile/education/:edu_id
//@desc  Get education from profile
//@access Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get Remove index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id); // Get index of education to remove

    profile.education.splice(removeIndex, 1); // remove it

    await profile.save(); // save new profile

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
