const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const config = require('config')
const { check, validationResult } = require('express-validator');


//@route GET api/auth
//@desc Test route
//@access Public
router.get('/', auth, async(req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password')
        res.json(user);
    }catch (err){
        console.error(err.message)
        res.status(500).send('Server Error');
    }
})

//@route GET api/auth
//@desc Authenticate user and get token
//@access Public
router.post('/', 
    [
        check('email', 'Please Include A Valid Email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

    //destructuring the body
    const { email, password } = req.body;

    try{
        
        // Find user in database
        let user = await User.findOne({email})
        
        // See if user exists
        if (!user){
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})
        }

        // Check if correct password
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res
                .status(400)
                .json({errors: [{msg: 'Invalid Credentials'}]})
        }

        // Return jsonwebtoken to allow person to access routes later
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err, token) => {
                if (err) throw err;
                res.json({token});
            }
        );
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error')
    }
    }
);

module.exports = router;