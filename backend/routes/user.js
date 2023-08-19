const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");

const router = require("express").Router();

router.get("/", middlewareController.verifyToken, userController.getAllUser)
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, userController.deleteUser)
router.put("/update", middlewareController.verifyToken, userController.updateUser)

module.exports = router;