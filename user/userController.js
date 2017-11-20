var passport = require('passport');
var User = require('./userModel');
var fs = require('fs-extra');
var path = require('path');
var performLogin = function(req, res, next, user) {
	req.login(user, function(err) {
		if(err) return next(err);
		return res.redirect('/');
	});
};
var userController = {
	login: function(req, res) {
		res.sendFile('/html/landing.html', {root: './public'});
	},
	processLogin: function(req, res, next) {
		var authFunction = passport.authenticate('local', function(err, user, info) {
			if(err) return next(err);
			if(!user) {
				return res.send('<div style="width: 100%; height: auto; padding-top: 100px; text-align: center;"><h1 style="font-family: sans-serif;">Error</h1><h3 style="font-family: sans-serif;">Login credentials failed. Please try again.</h3><a href="/welcome/"><button style="padding: 15px 25px 15px 25px; border: 1px solid #f2f2f2; border-radius: 5px; background-color: white; font-size: 16px; font-family: sans-serif">Go back</button></a></div>');
			}
			performLogin(req, res, next, user);
		});
		authFunction(req, res, next);
	},
	processSignup: function(req, res, next) {
		var user = new User({
			name     : req.body.name,
			username : req.body.username,
			password : req.body.password
		});
		user.save(function(err, user) {
			if(err) {
				if(err.code === 11000) {
					return res.send('<div style="width: 100%; height: auto; padding-top: 100px; text-align: center;"><h1 style="font-family: sans-serif;">Error</h1><h3 style="font-family: sans-serif;">This user already exists. Please try a different username/password.</h3><a href="/welcome/"><button style="padding: 15px 25px 15px 25px; border: 1px solid #f2f2f2; border-radius: 5px; background-color: white; font-size: 16px; font-family: sans-serif">Go back</button></a></div>');
				}
				else {
					return res.send('<div style="width: 100%; height: auto; padding-top: 100px; text-align: center;"><h1 style="font-family: sans-serif;">Error</h1><h3 style="font-family: sans-serif;">Please try again. Ensure that all fields are filled out before signing up.</h3><a href="/welcome/"><button style="padding: 15px 25px 15px 25px; border: 1px solid #f2f2f2; border-radius: 5px; background-color: white; font-size: 16px; font-family: sans-serif">Go back</button></a></div>');
				}
			}
			performLogin(req, res, next, user);
		});
	}, 
	getAllUsers: function(req, res) {
		User.find({}).exec(function(err, allUsers) {
			if(err) {
				res.error(err);
			}
			else {
				res.json(allUsers)
			}
		})
	},
	updatePhoto: function(req, res) {
		var file = req.files.file;
		var userId = req.body.userId;
		console.log("user " + userId + " fs submitting ", file);
		var uploadDate = new Date();
		var tempPath = file.path;
		var targetPath = path.join(__dirname, "../uploads/" + userId + uploadDate + file.name);
		var savePath = "/uploads/" + userId + uploadDate + file.name;
		fs.rename(tempPath, targetPath, function(err) {
			if(err) {
				console.log(err)
			}
			else {
				User.findById(userId, function(err, userData) {
					var user = userData;
					user.image = savePath;
					user.save(function(err) {
						if(err) {
							console.log("failed save");
							res.json({status: 500})
						}
						else {
							console.log("save successful");
							res.json({status: 200})
						}
					})
				})
			}
		})
	}, 
	updateLocation: function(req, res) {
		var lati = req.body.lati;
		var long = req.body.long;
		var userId = req.body.userId;
		User.findById(userId, function(err, userData) {
			var user = userData;
			user.lati = lati;
			user.long = long;
			user.save(function(err) {
				if(err) {
					console.log("fail");
					res.json({status: 500});
				}
				else {
					console.log("success");
					res.json({status: 200});
				}
			})
		})
	}
};
module.exports = userController;