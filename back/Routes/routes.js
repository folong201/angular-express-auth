const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAuthMiddleware } = require('../middlewares/isAuthMiddleware');


router.post('/register', async (req, res) => {
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        email: req.body.email,
        password: hashPassword,
        name: req.body.name,
    })
    const result = await user.save()
    const { password, ...data } = await result.toJSON()
    res.send(data)
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).send({
            message: 'User not found'
        })
    }
    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'Invalid credentials'
        })
    }

    const token = jwt.sign({ _id: user._id }, 'secret')
    const refreshToken = jwt.sign({ _id: user._id }, 'secret')

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    res.cookie('refreshjwt', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.send({
        message: 'Login successful'
    })
})

router.get('/user', async (req, res) => {
    try {
        const cookie = req.cookies['jwt']
        const claims = await jwt.verify(cookie, 'secret')
        if (!claims) {
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }
        const user = await User.findOne({ _id: claims._id })
        const { password, ...data } = await user.toJSON()
        res.send(data)
    } catch (error) {
        return res.status(401).send({
            message: 'Unauthenticated'
        })
    }
})

router.post('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 })
    res.send({
        message: 'Logged out'
    })
})

router.get('/users',isAuthMiddleware, async (req, res) => {
    const users = await User.find({})
    res.send(users)
})

//route pour creer un nouveau token a partir du refresh token
router.get('/refresh', async (req, res) => {
    const refreshToken = req.cookies['refreshjwt']
    if (!refreshToken) {
        return res.status(401).send({
            message: 'Unauthenticated'
        })
    }
    let payload = null
    try {
        payload = jwt.verify(refreshToken, 'secret')
    } catch (error) {
        return res.status(401).send({
            message: 'Unauthenticated'
        })
    }

    const user = await User.findOne({ _id: payload._id })
    if (!user) {
        return res.status(401).send({
            message: 'Unauthenticated'
        })
    }

    const token = jwt.sign({ _id: user._id }, 'secret')
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.send({
        message: 'Refreshed Token'
    })
})

module.exports = router;