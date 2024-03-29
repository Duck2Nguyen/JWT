const jwt = require("jsonwebtoken")

const middlewareController = {
    verifyToken: async (req, res, next) => {
        const token = req.headers.token
        if (token) {
            //Bearer 1234
            const accessToken = token.split(" ")[1]
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid");
                }
                req.user = user;
                next()
            })
        }
        else {
            return res.status(401).json("You're not authenticated");
        }
    },
    verifyTokenAndAdminAuth: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.admin || req.user._id == req.params.id) {
                next()
            } else {
                return res.status(403).json("Yoy're not allow to delete other");
            }
        })
    }
}

module.exports = middlewareController;