"use strict";
(function() {
	/**************************
	DEPENDENCIES
	**************************/
	angular.module('DTTP', ['ngRoute', 'ngFileUpload']);
	/**************************
	MAIN CONTROLLER
	**************************/
	angular.module('DTTP').controller('mainController', ['$scope', '$http', '$timeout', 'Upload', function($scope, $http, $timeout, Upload) {
		/**************************
		USER FUNCTIONS
		**************************/
		(function initUsers() {
			(function getAllUsers() {
				$http.get('/api/users/get').then(function(res) {
				});
			}());
		}());
		(function userFunctions() {
			const getSessionUser = function() {
				$http.get('/api/user/get').then(function(res) {
					$scope.user = res.data;
					(function checkUserImg() {
						if($scope.user.image == undefined) {
							$scope.user.image = '../../images/placeholder.png';
						}
						else {
							$scope.user.image = $scope.user.image;
						}
					}());
					(function checkCoords() {
						if($scope.user.lati == undefined && $scope.user.long == undefined) {
							(function($) {
								$('.location-permission-modal-overlay').addClass('toggled');
								$('.location-permission-modal').addClass('toggled');
							})(jQuery);
						}
					}());
				});
			};
			getSessionUser();
			const getAllGoals = function() {
				const data = {};
				$http.get('/api/goals/get', data).then(function(response) {
					$scope.allGoalsArray = response.data;
					response.data.forEach(function(obj){ 
						if(obj.userSubmitted.image == undefined) {
							obj.userSubmitted.image = '../../images/placeholder.png';
						}
					});
				});
			};
			getAllGoals();
			$scope.uploadPic = function(file) {
			    file.upload = Upload.upload({
			      	url: '/api/user/updatePhoto',
			      	data: {userId: $scope.user._id, file: file},
			    });
			    file.upload.then(function (response) {
			      	$timeout(function () {
			        	file.result = response.data;
			        	getSessionUser();
			        	getAllGoals();
			      	});
			    }, 
			    function (response) {
			      	if (response.status > 0)
			        	$scope.errorMsg = response.status + ': ' + response.data;
			    },
			    function (evt) {
			      	file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			    });
		    };
		    const getLocation = function() {
		    	if(navigator.geolocation) {
		    		navigator.geolocation.getCurrentPosition(allowCoords);
		    	};
		    };
		    function allowCoords(position) {
		    	const lat = position.coords.latitude;
		    	const lng = position.coords.longitude;
		    	const data = {
		    		userId: $scope.user._id,
		    		lati: lat,
		    		long: lng
		    	};
		    	$http.post('/api/user/updateLocation', data).then(function(res) {});
		    };
		    const denyLocation = function() {
		    	const data = {
		    		userId: $scope.user._id,
		    		lati: Math.random(),
		    		long: Math.random()
		    	};
		    	$http.post('/api/user/updateLocation', data).then(function(res) {});
		    };
		    $scope.allowLocation = function() {
		    	getLocation();
		    };
		    $scope.denyLocation = function() {
		    	denyLocation();
		    };
		    (function getThisUsersGoal() {
		    	$scope.thisUsersGoals = [];
		    	$scope.theUser = [];
		    	const data = {};
		    	$http.get('/api/users/get').then(function(res) {
		    		$scope.theUser = res.data;
		    	})
		    }())
		}());
		/**************************
		GOAL FUNCTIONS
		**************************/
		(function goalFunctions() {
			const data = {};
			const getUserGoals = function(id) {
				$http.get('/api/goals/get/' + $scope.userId, data).then(function(response) {
					$scope.userGoalsArray = response.data;
				});
			};
			const getAllGoals = function() {
				$http.get('/api/goals/get', data).then(function(response) {
					$scope.allGoalsArray = response.data;
					response.data.forEach(function(obj){ 
						if(obj.userSubmitted.image == undefined) {
							obj.userSubmitted.image = '../../images/placeholder.png';
						}
					});
				});
			};
			getUserGoals();
			getAllGoals();
			$scope.postPublicGoal = function(goal) {
				$scope.goal = goal;
				$scope.allGoalsArray = [];
				$scope.userGoalsArray = [];
				const data = {
					content: $scope.goal.content,
					timeStamp: $scope.goal.timeStamp,
					userSubmitted: $scope.user._id,
					userId: $scope.user._id,
					public: true,
					accomplished: false
				};
				$http.post('/api/goals/post', data).then(function(response) {
					$scope.allGoalsArray.push(response);
					$scope.userGoalsArray.push(response);
					getAllGoals();
					getUserGoals();
					$scope.goal.content = "";
				});
			};
			$scope.deleteGoal = function(id) {
				$http.delete('/api/goals/delete/' + id).then(function(response) {
					getAllGoals();
					getUserGoals();
				});
			};
			$scope.accomplishedGoal = function(goal) {
				$http.post('/api/goals/accomplished', {
					goalId: goal._id
				}).then(function(response) {
					getAllGoals();
					getUserGoals();
				});
			};
		}());
	}]);
	/**************************
	PROFILE CONTROLLER
	**************************/
	angular.module('DTTP').controller('profileController', [ '$scope', function($scope) {
		(function($) {
			$('.tab-con a:nth-child(1)').click(function() {
				$('.tab-follower').removeClass('c');
				$('.tab-follower').removeClass('r');
				$('.wrapper').removeClass('toggle2');
				$('.wrapper').removeClass('toggle1');
				$('.test-con .test:nth-child(1)').addClass('toggle');
				$('.test-con .test:nth-child(2)').removeClass('toggle');
				$('.test-con .test:nth-child(3)').removeClass('toggle');
			});
			$('.tab-con a:nth-child(2)').click(function() {
				$('.tab-follower').removeClass('r');
				$('.tab-follower').addClass('c');
				$('.wrapper').removeClass('toggle2');
				$('.wrapper').addClass('toggle1');
				$('.test-con .test:nth-child(2)').addClass('toggle');
				$('.test-con .test:nth-child(1)').removeClass('toggle');
				$('.test-con .test:nth-child(3)').removeClass('toggle');
			});
			$('.tab-con a:nth-child(3)').click(function() {
				$('.tab-follower').removeClass('c');
				$('.tab-follower').addClass('r');
				$('.wrapper').removeClass('toggle1');
				$('.wrapper').addClass('toggle2');
				$('.test-con .test:nth-child(3)').addClass('toggle');
				$('.test-con .test:nth-child(2)').removeClass('toggle');
				$('.test-con .test:nth-child(1)').removeClass('toggle');
			});
			$('.tab-con a').click(function() {
				$('.tab-con a').removeClass('active');
				$(this).addClass('active');
			});
		})(jQuery);
		$scope.toggled = false;
	}]);
	/**************************
	GOAL CONTROLLER
	**************************/
	angular.module('DTTP').controller('goalController', [ '$scope', function($scope) {
		$scope.toggled = false;
	}]);
	/**************************
	SETTINGS CONTROLLER
	**************************/
	angular.module('DTTP').controller('settingsController', [ '$scope', '$http',  function($scope, $http) {
		(function($) {
			$('.settings-con-pic').click(function() {
				$('.settings-con-pic.preview').addClass('toggle');
				$('.upload-con').addClass('toggle');
			});
			$('.upload-con button').click(function() {
				$('.upload-con').removeClass('toggle');
				$('.settings-con-pic.preview').removeClass('toggle');
			});
			$('.on-off-grid.l').click(function() {
				$('.on-off-btn').addClass('on');
				$('.on-off-btn').removeClass('off');
			});
			$('.on-off-grid.r').click(function() {
				$('.on-off-btn').addClass('off');
				$('.on-off-btn').removeClass('on');
			});
		})(jQuery);
		(function(){
			$http.get('/api/user/get').then(function(res) {
				(function checkLocation() {
					const userLocation = res.data.lati.toString();
					if(userLocation.charAt(0) == "0") {
						(function($) {
							$('.on-off-btn').addClass('on');
						})(jQuery);
					}
					if(userLocation.charAt(0) !== "0") {
						(function($) {
								$('.on-off-btn').addClass('off');
						})(jQuery);
					}
				}());
			});
		}());
	}]);
	/**************************
	GOOGLE MAPS JQUERY
	**************************/
	angular.module('DTTP').controller('dreamController', [ '$scope', '$http', '$compile', function($scope, $http, $compile) {
		$(document).ready(function() {
			const latlng = new google.maps.LatLng("39.7392","-104.9903");
			const map = new google.maps.Map(document.getElementById('map'), {
				zoom: 3,
				center: latlng,
				styles: [
					{ 
						elementType: 'geometry', stylers: [{color: '#242f3e'}] }, { elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}] }, { elementType: 'labels.text.fill',  stylers: [{color: '#746855'}] }, { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{color: '#d59563'}] }, { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{color: '#d59563'}] }, { featureType: 'poi.park', elementType: 'geometry', stylers: [{color: '#263c3f'}] }, { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{color: '#6b9a76'}] }, { featureType: 'road', elementType: 'geometry', stylers: [{color: '#38414e'}] }, { featureType: 'road', elementType: 'geometry.stroke', stylers: [{color: '#212a37'}] }, { featureType: 'road', elementType: 'labels.text.fill', stylers: [{color: '#9ca5b3'}] }, { featureType: 'road.highway', elementType: 'geometry', stylers: [{color: '#746855'}] }, { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#1f2835'}] }, { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{color: '#f3d19c'}] }, { featureType: 'transit', elementType: 'geometry', stylers: [{color: '#2f3948'}] }, { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{color: '#d59563'}] }, { featureType: 'water', elementType: 'geometry', stylers: [{color: '#17263c'}] }, { featureType: 'water', elementType: 'labels.text.fill', stylers: [{color: '#515c6d'}] }, { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{color: '#17263c'}]
					}
				]			
			});
			var markers = [];
			$scope.locationsArray = [];
			$http.get('/api/users/get').then(function(response){ 
				response.data.forEach(function(obj){ 
 					 var marker = new google.maps.Marker({
					  position: new google.maps.LatLng(obj.lati, obj.long),
					  map: map,
					  image: obj.image
					});
 					var path = 'http://localhost:8080';
 					var image = path + obj.image;
 					var tempImg = "../../images/placeholder.png";
					var contentString = '<img style="height: 50px; width: 50px; display: inline-block; border: 2px solid white; border-radius: 8px; background-image: url(../../images/placeholder.png); background-repeat: no-repeat; background-size: cover; background-position: center;" src="' + image + '"/>' + '<div style="display: inline-block; padding-left: 15px;">' + '@' + obj.username + '</div>' + '<div style="padding-top: 15px; width: 300px; line-height: 20px;">' + '</div>';
                    var infowindow = new google.maps.InfoWindow({
					  content: contentString
					});  
					marker.addListener('click', function() {
						infowindow.open(map, marker);
					});								 
					markers.push(marker);
                });
                var markerCluster = new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
				markerCluster.addListener('click', function() {	
				});
			});
		});
	}]);
	/**************************
	PAGE ROUTER
	**************************/
	angular.module('DTTP').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: '/html/profile.html', 
			controller: 'profileController'
		})
		.when('/goals', {
			templateUrl: '/html/goals.html',
			controller: 'goalController'
		})
		.when('/profile', {
			templateUrl: '/html/profile.html',
			controller: 'profileController'
		})
		.when('/dreams', {
			templateUrl: '/html/dreams.html', 
			controller: 'dreamController'
		})
		.when('/settings', {
			templateUrl: '/html/settings.html', 
			controller: 'settingsController'
		})
		/**************************
		HASHBANG FIX 
		**************************/
		$locationProvider
		.html5Mode(false)
		.hashPrefix('');
	}]);
}());