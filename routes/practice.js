const express = require("express");
const router = express.Router();


const practiceController = require("../controllers/practiceController");
const controller = new practiceController();


// router.get("/liste", (req, res) => controller.liste(req, res));

router.get('/:game', (req, res) => controller.getPage(req, res));
router.get('/:game/ajax', (req, res) => controller.getRanking(req, res));



module.exports = router;