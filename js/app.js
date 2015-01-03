(function() {

	var app = angular.module('appycab', ['LocalStorageModule', 'ngRoute', 'ngAnimate', 'angularValidator', 'ngMap', 'ngSanitize', 'timer', 'angular-loading-bar', 'toaster', 'ngDialog']);


	app.constant("APP_TOKEN", 'MpxMxk99c5YfQcuM9gAICKftTu1mFwqO')
	   .constant('API_BASE_URL','http://appycab.co.uk/appycab-api/public/api/v1/');

	app.config(function(localStorageServiceProvider, $routeProvider, $httpProvider, cfpLoadingBarProvider) {

		localStorageServiceProvider
			.setPrefix('appycab')
			.setStorageType('localStorage')
			.setStorageCookie(0, '/');

		$routeProvider
			.when('/', {
				templateUrl: 'page-home.html',
				controller: 'HomeController'
			})
			.when('/details', {
				templateUrl: 'page-home.html',
				controller: 'DetailsController'
			})
			.when('/choose', {
				templateUrl: 'page-choose.html',
				controller: 'ChooseController'
			})
			.when('/take-me-home-now', {
				templateUrl: 'take-me-home-now.html',
				controller: 'TakeMeHomeNowController'
			})
			.when('/pick-me-from-here-now', {
				templateUrl: 'pick-me-from-here-now.html',
				controller: 'PickMeFromHereNowController'
			})
			.when('/book-a-different-cab-journey', {
				templateUrl: 'book-a-different-cab-journey.html',
				controller: 'BookADifferentCabJourneyController'
			})
			.when('/make-booking', {
				templateUrl: 'make-booking.html',
				controller: 'MakeBookingController'
			});

		// We need to setup some parameters for http requests
	    // These three lines are all you need for CORS support
	    // $httpProvider.defaults.useXDomain = true;
	    // $httpProvider.defaults.withCredentials = false;
	    // $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
	    // delete $httpProvider.defaults.headers.common['X-Requested-With'];

	    cfpLoadingBarProvider.latencyThreshold = 10;

	});

	app.controller('HomeController', function($scope, $rootScope, $location, localStorageService, AppyCabService) {
		
		if(AppyCabService.hasDetails()) {
			$location.path('/choose');
		} else {
			$location.path('/details');
		}

	});

	app.controller('DetailsController', function($scope, $rootScope, $location, localStorageService, AppyCabService) {
		$rootScope.page_title="Welcome!";
		$rootScope.backButton = false;
		$rootScope.hasDetails = AppyCabService.hasDetails();
		$scope.client = {
			app_id:localStorageService.get('app_id'),
			fname:localStorageService.get('fname'),
			lname:localStorageService.get('lname'),
			email:localStorageService.get('email'),
			mobile:localStorageService.get('mobile'),
			address:localStorageService.get('address'),
			lat:localStorageService.get('lat'),
			lng:localStorageService.get('lng'),
		};

		$scope.process = function() {

			var detail = AppyCabService.processDetail($scope.client);

			detail.success(function(response) {

				localStorageService.set('app_id', response.data.app_id);

				$location.path('/choose');
			});
			
		};

		var getFormattedAddress = function(pos) {

			geocoder = new google.maps.Geocoder();

			geocoder.geocode({
			   	latLng: pos
			}, function(responses) {
			    if (responses && responses.length > 0) {
			      document.getElementById("client_address").value = responses[0].formatted_address;
			      $scope.client.lat = responses[0].geometry.location.lat();
			      $scope.client.lng = responses[0].geometry.location.lng();
			      $scope.client.address = responses[0].formatted_address;
			    } else {
			      alert('Cannot determine address at this location.');
			    }
			});
		}

		$scope.markerDropped = function() {
			getFormattedAddress($scope.map.markers[0].getPosition());
		}

		$scope.changedPosition = function(event) {
			$scope.map.markers[0].setPosition(event.latLng);
			getFormattedAddress(event.latLng);
		}
	});

	app.controller('ChooseController', function($scope, $rootScope, $location, localStorageService, AppyCabService) {
		$rootScope.hasDetails = AppyCabService.hasDetails();
		$rootScope.page_title="Choose";
		$rootScope.backButton = AppyCabService.hasDetails() ? false:true;
		$rootScope.pageClass='page';
		$rootScope.back = function() {
			$rootScope.pageClass='page-back';
			$rootScope.backButton = false;
			$location.path('/');
		};
	});

	app.controller('TakeMeHomeNowController', function($scope, $rootScope, $location, localStorageService, AppyCabService) {

		$rootScope.hasDetails = AppyCabService.hasDetails();
		$rootScope.page_title="Take me Home";
		$rootScope.backButton = true;
		$rootScope.pageClass='page';

		$rootScope.back = function() {
			$rootScope.pageClass='page-back';
			$rootScope.backButton = false;
			$location.path('/choose');
		};

		$scope.client = {
			app_id:localStorageService.get('app_id'),
			fname:localStorageService.get('fname'),
			lname:localStorageService.get('lname'),
			email:localStorageService.get('email'),
			mobile:localStorageService.get('mobile'),
			address:localStorageService.get('address'),
			lat:localStorageService.get('lat'),
			lng:localStorageService.get('lng'),
		};

		var getFormattedAddress = function(pos) {

			geocoder = new google.maps.Geocoder();

			geocoder.geocode({
			   	latLng: pos
			}, function(responses) {
			    if (responses && responses.length > 0) {
			      document.getElementById("client_address").value = responses[0].formatted_address;
			      $scope.client.lat = responses[0].geometry.location.lat();
			      $scope.client.lng = responses[0].geometry.location.lng();
			      $scope.client.address = responses[0].formatted_address;
			    } else {
			      alert('Cannot determine address at this location.');
			    }
			});
		}

		$scope.markerDropped = function() {
			getFormattedAddress($scope.map.markers[0].getPosition());
		}

		$scope.changedPosition = function(event) {
			$scope.map.markers[0].setPosition(event.latLng);
			getFormattedAddress(event.latLng);
		}

		$scope.process = function() {
			//AppyCabService.takeMeHomeNowProcess($scope.client);
			$location.path('/make-booking');
		}
	});

	app.controller('PickMeFromHereNowController', function($scope, $rootScope, $location, localStorageService, AppyCabService) {
		$rootScope.hasDetails = AppyCabService.hasDetails();
		$rootScope.page_title="Pick me up from here";
		$rootScope.backButton = true;
		$rootScope.pageClass='page';
		$rootScope.back = function() {
			$rootScope.pageClass='page-back';
			$rootScope.backButton = false;
			$location.path('/choose');
		};
	});

	app.controller('BookADifferentCabJourneyController', function($scope, $rootScope, $location, localStorageService, AppyCabService) {
		$rootScope.hasDetails = AppyCabService.hasDetails();
		$rootScope.page_title="Book a Cab";
		$rootScope.backButton = true;
		$rootScope.pageClass='page';
		$rootScope.back = function() {
			$rootScope.pageClass='page-back';
			$rootScope.backButton = false;
			$location.path('/choose');
		};
	});

	app.controller('MakeBookingController', function($scope, $rootScope, $location, localStorageService, AppyCabService, toaster, ngDialog) {
		$rootScope.hasDetails = AppyCabService.hasDetails();
		$rootScope.page_title="Booked";
		$rootScope.backButton = false;
		$rootScope.pageClass='page';

		$scope.openConfirm = function () {
			ngDialog.openConfirm({
				template: 'modalDialogId',
				className: 'ngdialog-theme-default'
			}).then(function (value) {
				console.log('Modal promise resolved. Value: ', value);
			}, function (reason) {
				console.log('Modal promise rejected. Reason: ', reason);
			});
		};

		$scope.callbackTimer={};

		$scope.callbackTimer.finished=function(){
			ngDialog.close();

			$location.path('/choose');

			toaster.pop({type: 'success', title: "Booked!", body:"You've successfully booked a cab"});
			
	        $scope.$apply();
	    };


	});

	
	app.factory("AppyCabService", function(localStorageService, APP_TOKEN, API_BASE_URL, $http, $sanitize) {

		var sanitizeDetailsData = function (data) {
            return {
                app_id: $sanitize(data.app_id),
                fname: $sanitize(data.fname),
                lname: $sanitize(data.lname),
                email: $sanitize(data.email),
                mobile: $sanitize(data.mobile),
                address: $sanitize(data.address),
                lat: $sanitize(data.lat),
                lng: $sanitize(data.lng),
                _token: APP_TOKEN
            };
        };

		return {
			hasDetails: function() {
				if(localStorageService.get('fname')!==null 
					&& localStorageService.get('lname')!==null 
					&& localStorageService.get('email')!==null 
					&& localStorageService.get('mobile')!==null 
					&& localStorageService.get('address')!==null 
					&& localStorageService.get('lat')!==null 
					&& localStorageService.get('lng')!==null) {

					return true;
				} else {
					return false;
				}
			},

			processDetail: function(data) {

				localStorageService.set('app_id', data.app_id);
				localStorageService.set('fname', data.fname);
				localStorageService.set('lname', data.lname);
				localStorageService.set('email', data.email);
				localStorageService.set('mobile', data.mobile);
				localStorageService.set('address', data.address);
				localStorageService.set('lat', data.lat);
				localStorageService.set('lng', data.lng);

				var detail = $http.post('http://appycab.co.uk/appycab-api/public/api/v1/details', sanitizeDetailsData(data));

				return detail;
			},

			takeMeHomeNowProcess: function(data) {

				localStorageService.set('app_id', data.app_id);
				localStorageService.set('fname', data.fname);
				localStorageService.set('lname', data.lname);
				localStorageService.set('email', data.email);
				localStorageService.set('mobile', data.mobile);
				localStorageService.set('address', data.address);
				localStorageService.set('lat', data.lat);
				localStorageService.set('lng', data.lng);

				var detail = $http.post('http://appycab.co.uk/appycab-api/public/api/v1/take-me-home-now', sanitizeDetailsData(data));

				return detail;
			}
		};
	});

})();

