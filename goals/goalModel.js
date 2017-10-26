var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var goalSchema = new Schema({
	content         : {type: String, required: true},
	timeStamp       : {type: Date},
	userSubmitted   : {type: Schema.Types.ObjectId, ref: 'user'},
	userId          : {type: String},
	public          : {type: Boolean},
	accomplished    : {type: Boolean},
	rating          : {type: Number},
});

var Goal = mongoose.model('goal', goalSchema);
module.exports = Goal;