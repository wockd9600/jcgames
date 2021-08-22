const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatLogSchema = new Schema({
        id: {
                type:String,
                required:true,
                },
        log: {
                type:String,
                required:true,
                }
},
{ timestamps:true }
);

module.exports = mongoose.model('ChatLog', chatLogSchema);