
const jwt = require('jsonwebtoken');

exports.isAuthMiddleware = (req, res, next) => {    
    const cookie = req.cookies['jwt']
    if (!cookie) {
        return res.status(401).send({
            message: 'Unauthenticated'
        })
    }
    try {
        const claims = jwt.verify(cookie, 'secret')
        if (!claims) {
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }
        req.user = claims
        next()
    } catch (error) {
        return res.status(401).send({
            message: 'Unauthenticated'
        })
    }
}
