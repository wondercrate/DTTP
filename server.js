var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/DTTP');
var userConfig = require('./user/userConfig');
var userController = require('./user/userController');
var goalController = require('./goals/goalController');
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize()); 
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/node_modules', express.static(__dirname + "/node_modules"));
app.use('/images', express.static(__dirname + "/images"));
app.use('/uploads', express.static(__dirname + "/uploads"));
app.get('/welcome/', userController.login);
app.post('/welcome/', userController.processLogin);
app.post('/welcome/signup', userController.processSignup);
/* AUTHENTICATE & REDIRECT */
app.use(userConfig.ensureAuthenticated);
app.get('/', function(req, res){
  res.sendFile('/html/index.html', {root : './public'})
});
/* GET SESSION USER */
app.get('/api/user/get', function(req, res){
	res.send(req.user);
});
/* GET ALL USERS */
app.get('/api/users/get', userController.getAllUsers);
/* UPDATE USER PIC */
app.post('/api/user/updatePhoto', multipartMiddleware, userController.updatePhoto);
/* GET USER LOCATION */
app.post('/api/user/updateLocation', userController.updateLocation);
/* POST NEW GOAL */
app.post('/api/goals/post', goalController.postGoal);
/* GET USER GOALS */
app.get('/api/goals/get/:userId', goalController.getUserGoals);
/* GET ALL GOALS */
app.get('/api/goals/get', goalController.getAllGoals);
/* ACCOMPLISHED GOAL */
app.post('/api/goals/accomplished', goalController.accomplishedGoal)
/* DELETE GOAL */
app.delete('/api/goals/delete/:id', goalController.deleteGoal);
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server running on port ' + port);
});






























