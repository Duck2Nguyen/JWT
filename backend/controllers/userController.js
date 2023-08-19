const User = require("../models/User");

const userController = {
    getAllUser: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                res.status(404).json("Not found user");
            } else {
                res.status(200).json("Delete successfully");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateUser: async (req, res) => {
        try {
            const user = await User.findById(req.body.id);
            if (!user) {
                res.status(404).json("Not found user");
            } else {
                let value = req.body.value;
                const dataRes = await User.updateOne(
                    { _id: req.body.id },
                    { $set: { "faceRegistration": value } }
                );
                if (dataRes.modifiedCount === 1) {
                    res.status(200).json("Update successfully");
                } else {
                    res.status(404).json("Update Failed");
                }

            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = userController