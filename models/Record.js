const mongoose = require('mongoose');
const { Schema } = mongoose;
// === const Schema = mongoose.Schema;
const recordSchema = new Schema({
    keyword:
        [{
            name:{
                type:String,
                required:true,
            },
            job:{
                type:String,
                required:true,
            },
            score:{
                type:Number,
                required:true,
            },
            content:{
                type:String,
            },
        }],
    puzzle:
        [{
            name:{
                type:String,
                required:true,
            },
            job:{
                type:String,
                required:true,
            },
            score:{
                type:Number,
                required:true,
            },
            content:{
                type:String,
            },
        }]
});

module.exports = mongoose.model('Record', recordSchema);