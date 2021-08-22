// const db = require(`../models/index.js`);
const Record = require('../models/index').Record;

class practiceController {
  getPage(req, res){
    res.render(req.params.game, {'game':req.params.game});
  }
  getRanking(req, res){
    let game = req.params.game;
    Record.find({}, (err, docs) => {
      res.json(docs[0][game]);  
    });
  }
}

const XSSfilter = (content)=> content.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#x27').replace(/\//g, '&#x2F');

module.exports = practiceController;
