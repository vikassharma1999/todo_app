const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController")
const {isSignedIn} = require("../protected")
router.get("/create",isSignedIn,taskController.task_list);
router.post("/create",isSignedIn,taskController.task_create_post);
router.get("/delete/:taskId",isSignedIn,taskController.task_delete);
router.get("/removeAll",isSignedIn,taskController.removeAll);

module.exports = router;