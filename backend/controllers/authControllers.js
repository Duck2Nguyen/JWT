const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

let refreshTokens = [];

const authController = {

    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            console.log(hashed)

            // Create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            console.log(newUser)

            //Save user to DB
            const user = await newUser.save();
            console.log("usert", user)
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    generateAccessToken: (user) => {
        const accessToken = jwt.sign({
            id: user.id,
            admin: user.admin
        },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "30s" }
        )
        return accessToken
    },

    generateRefreshToken: (user) => {
        const accessToken = jwt.sign({
            id: user.id,
            admin: user.admin
        },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "365d" }
        )
        return accessToken
    },

    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username })
            if (!user) {
                return res.status(404).json("Not found username");
            }
            const validPassword = bcrypt.compare(req.body.password, user.password)
            if (!validPassword) {
                return res.status(404).json("Wrong password");
            }
            if (validPassword && user) {
                const accessToken = authController.generateAccessToken(user)
                const refreshToken = authController.generateRefreshToken(user)
                refreshTokens.push(refreshToken)
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict"
                })
                const { password, ...other } = user._doc;
                res.status(200).json({ ...other, accessToken });
            }

        } catch (err) {
            res.status(500).json(err);
        }
    },

    loginByFace: async (req, res) => {
        try {
            const user = req.body;
            console.log("user2", user)
            const accessToken = authController.generateAccessToken(user)
            const refreshToken = authController.generateRefreshToken(user)
            console.log("accessToken", accessToken)
            refreshTokens.push(refreshToken)
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict"
            })
            res.status(200).json({ ...user, accessToken: accessToken });
        } catch (err) {
            res.status(500).json(err);
        }
    },


    requestRefreshToken: (req, res) => {
        let refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.status(401).json("You're not authenticated");
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) console.log(err);
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
            refreshTokens.push(newRefreshToken)
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict"
            })
            res.status(200).json({ "accessToken": newAccessToken });
        })
    },
    userLogout: async (req, res) => {
        res.clearCookie("refreshToken")
        refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken)
        res.status(200).json("Logged out successfully");
    }
}

module.exports = authController