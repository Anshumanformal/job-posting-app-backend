const router = require("express").Router();
const UserRoutes = require("./User");

router.use("/user", UserRoutes);

module.exports = router;
