var User = require('../user/userModel');
var Goal = require('./goalModel');
var fs = require('fs-extra');
var path = require('path');
var mongoose = require('mongoose');

module.exports = {
	// POST GOAL 
	postGoal: function(req, res) {
		var goal = new Goal({
			content: req.body.content,
			timeStamp: new Date(),
			userSubmitted : req.user._id,
			userId: req.user._id,
			public: req.body.public,
			accomplished: req.body.accomplished
		});
		goal.save(function(err, newGoal) {
			if(err) {
				res.error(err);
			}
			else {
				res.json(newGoal);
			}
		})
	},
	getUserGoals: function(req, res) {
		Goal.find({userId: req.user._id}).exec(function(err, userGoals) {
			if(err) {
				res.error(err);
			}
			else {
				res.json(userGoals);
			}
		}
	)},
	getAllGoals: function(req, res) {
		Goal.find({}).populate('userSubmitted').exec(function(err, allGoals) {
			if(err) {
				res.error(err);
			}
			else {
				res.json(allGoals)
			}
		}
	)},
	deleteGoal: function(req, res) {
		var id = req.params.id;
		Goal.findOneAndRemove({_id: id}, function(err, doc) {
			if(err) {
				console.log(err);
			}
			else {
				res.json(doc);
				console.log("success");
			}
		})
	},
	accomplishedGoal: function(req, res) {
		var id = req.params.id;
		Goal.findOne({_id: req.body.goalId}, function(err, doc) {
			var newStatus = true;
			Goal.update({ _id: doc._id },
				{ $set: {
					accomplished: newStatus
				}}, function(err, doc) {
					if(err) {
						res.send(false);
					}
					else {
						res.send({ newStatus: newStatus });
					}
				});
		})
	}
}