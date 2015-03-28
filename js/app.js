(function() {

	var app = angular.module('appycab', ['LocalStorageModule', 'ngRoute', 'ngAnimate', 'angularValidator', 'ngMap', 'ngSanitize', 'timer', 'angular-loading-bar', 'toaster', 'ngDialog', 'angular-datepicker', 'geolocation']);


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
			})
			.when('/activate-email', {
				templateUrl: 'activate-email.html',
				controller: 'ActivateEmailController'
			})
			.when('/change-booking', {
				templateUrl: 'book-a-different-cab-journey.html',
				controller: 'ChangeBookingController'
			})
			.when('/about', {
				templateUrl: 'about.html',
				controller: 'AboutController'
			})
			.when('/contact-user-feedback', {
				templateUrl: 'contact-user-feedback.html',
				controller: 'ContactUserFeedbackController'
			})
			.when('/contact-cab-company', {
				templateUrl: 'contact-cab-company.html',
				controller: 'ContactCabCompanyController'
			});

		// We need to setup some parameters for http requests
	    // These three lines are all you need for CORS support
	    // $httpProvider.defaults.useXDomain = true;
	    // $httpProvider.defaults.withCredentials = false;
	    // $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
	    // delete $httpProvider.defaults.headers.common['X-Requested-With'];

	    cfpLoadingBarProvider.latencyThreshold = 10;

	});

	app.controller('TCController', function($scope, $rootScope, $location, localStorageService, AppyCabService, ngDialog) {
		
		$scope.agreedToTermsAndCondition = function() {
			localStorageService.set('has_agreed_to_terms', true);
			ngDialog.close();
		}

		$scope.openTC = function() {
			ngDialog.open({ template:'terms_and_condition_modal', scope:$scope });
		}

	});

	app.controller('AboutController', function($scope, $rootScope, $location, localStorageService, AppyCabService) {
		$rootScope.page_title="About AppyCab";
	});

	app.controller('ContactUserFeedbackController', function($scope, $rootScope, $location, localStorageService, AppyCabService, toaster) {
		$rootScope.page_title="Contact – App Users";
		$rootScope.backButton = true;
		$rootScope.hasDetails = AppyCabService.hasDetails();

		$scope.contact = {
			email:localStorageService.get('email'),
			name:localStorageService.get('fname') + " " + localStorageService.get('lname'),
			comment:""
		};

		$rootScope.back = function() {
			$rootScope.pageClass='page-back';
			$rootScope.backButton = false;
			$location.path('/');
		};

		$scope.process = function() {
			var contact = AppyCabService.contactSubmit('user', $scope.contact);

			contact.success(function(response) {
				toaster.pop({type: 'success', title: "Success", body:"Contact has been submitted, we will get back to you soon!"});
				$scope.contact.comment="";
			});

			contact.error(function(response) {
				toaster.pop({type: 'error', title: "Error", body:"Something went wrong, you can contact us directly via email: taxi-enquiry@appycab.co.uk"});
			});
		}
	});

	app.controller('ContactCabCompanyController', function($scope, $rootScope, $location, localStorageService, AppyCabService, toaster) {
		$rootScope.page_title="Contact – Taxi Firms";
		$rootScope.backButton = true;
		$rootScope.hasDetails = AppyCabService.hasDetails();

		$scope.contact = {
			email:localStorageService.get('email'),
			name:localStorageService.get('fname') + " " + localStorageService.get('lname'),
			taxi_name:"",
			to_know:0,
			comment:""
		};

		$rootScope.back = function() {
			$rootScope.pageClass='page-back';
			$rootScope.backButton = false;
			$location.path('/');
		};

		$scope.process = function() {
			var contact = AppyCabService.contactSubmit('company', $scope.contact);

			contact.success(function(response) {
				toaster.pop({type: 'success', title: "Success", body:"Contact has been submitted, we will get back to you soon!"});
				$scope.contact.comment="";
				$scope.contact.taxi_name="";
				$scope.contact.to_know="";
			});

			contact.error(function(response) {
				toaster.pop({type: 'error', title: "Error", body:"Something went wrong, you can contact us directly via email: taxi-enquiry@appycab.co.uk"});
			});
		}
	});

	app.controller('HomeController', function($scope, $rootScope, $location, localStorageService, AppyCabService) {
		
		if(AppyCabService.hasDetails()) {
			$location.path('/choose');
		} else {
			$location.path('/details');
		}

	});

	app.controller('DetailsController', function($scope, $rootScope, $location, localStorageService, AppyCabService, ngDialog, toaster) {
		
		//check if agreed to terms
		if(!localStorageService.get('has_agreed_to_terms')) {
			
			$scope.agreedToTermsAndCondition = function() {
				localStorageService.set('has_agreed_to_terms', true);
				ngDialog.close();
			}

			ngDialog.open({ template:'terms_and_condition_modal', scope:$scope });
		}

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

		$scope.emailRequiredModal = function() {
			ngDialog.open({ template:'email_required_modal' });
		}

		$scope.mobileRequiredModal = function() {
			ngDialog.open({ template:'mobile_required_modal' });
		}

		$scope.addressRequiredModal = function() {
			ngDialog.open({ template:'address_required_modal' });
		}

		$scope.process = function() {

			var detail = AppyCabService.processDetail($scope.client);

			var first_time = 0;
			if(!localStorageService.get('app_id'))
				first_time = 1;

			detail.success(function(response) {

				localStorageService.set('app_id', response.data.app_id);
				$location.path('/choose');
				if(first_time) {
					toaster.pop({type: 'success', title: "Success", body:"Welcome to Appy cab. What would you like to do next?"});
				}
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
			      //alert('Cannot determine address at this location.');
			    }
			});
		}

		var getFormattedAddress2 = function(pos) {

			geocoder = new google.maps.Geocoder();

			geocoder.geocode({
			   	latLng: pos
			}, function(responses) {
			    if (responses && responses.length > 0) {
			      $scope.client.lat = responses[0].geometry.location.lat();
			      $scope.client.lng = responses[0].geometry.location.lng();
			    } else {
			      //alert('Cannot determine address at this location.');
			    }
			});
		}

		$scope.markerDropped = function() {
			getFormattedAddress($scope.map.markers[0].getPosition());
		}

		$scope.markerDropped2 = function() {
			getFormattedAddress2($scope.map.markers[0].getPosition());
		}

		$scope.changedPosition = function(event) {
			$scope.map.markers[0].setPosition(event.latLng);
			getFormattedAddress(event.latLng);
		}

		$scope.already_registered = {};

		$scope.sendCode = function() {
			AppyCabService.sendActivationCode2($scope.already_registered.email).success(function(response) {
				toaster.pop('success','',response.flash);
			});
		};

		$scope.activateCode = function() {
			var attempt = AppyCabService.emailAttemptActivate2($scope.already_registered);

			attempt.success(function(response) {
				//toaster.pop('success','',response.flash);
				localStorageService.set('app_id', response.data.app_id);
				localStorageService.set('fname', response.data.first_name);
				localStorageService.set('lname', response.data.last_name);
				localStorageService.set('email', response.data.email);
				localStorageService.set('mobile', response.data.mobile);
				localStorageService.set('address', response.data.address);
				localStorageService.set('lat', response.data.lat);
				localStorageService.set('lng', response.data.lng);
				
				ngDialog.close();
				$location.path('/choose');
				toaster.pop({type: 'success', title: "Success", body:"Welcome back to Appy cab. What would you like to do next?"});
			});

			attempt.error(function(response) {
				toaster.pop('error','',response.flash);
			});

		};

		$scope.alreadyRegistered = function() {
			ngDialog.open({ template:'already_registered', scope:$scope });
		}


	});

	app.controller('ChooseController', function($scope, $rootScope, $location, localStorageService, AppyCabService, toaster, ngDialog) {

		//check if agreed to terms
		if(!localStorageService.get('has_agreed_to_terms')) {
			
			$scope.agreedToTermsAndCondition = function() {
				localStorageService.set('has_agreed_to_terms', true);
				ngDialog.close();
			}

			ngDialog.open({ template:'terms_and_condition_modal', scope:$scope });
		}

		$rootScope.hasDetails = AppyCabService.hasDetails();
		$rootScope.page_title="Choose your Journey";
		$rootScope.backButton = AppyCabService.hasDetails() ? false:true;
		$rootScope.pageClass='page';

		$scope.email_activated = true;
		AppyCabService.isEmailActivated().success(function(response) {
			if(response.activated=='no') {
				$scope.email_activated = false;
			} else {
				$scope.email_activated = true;
			}
		});

		$rootScope.back = function() {
			$rootScope.pageClass='page-back';
			$rootScope.backButton = false;
			$location.path('/');
		};

		$scope.activateNow = function() {
			AppyCabService.sendActivationCode().success(function(response) {
				$location.path('/activate-email');
				toaster.pop('success','',response.flash);
			});
		}
	});

	app.controller('TakeMeHomeNowController', function($scope, $rootScope, $location, $filter, localStorageService, AppyCabService, geolocation, ngDialog) {

		//check if agreed to terms
		if(!localStorageService.get('has_agreed_to_terms')) {
			
			$scope.agreedToTermsAndCondition = function() {
				localStorageService.set('has_agreed_to_terms', true);
				ngDialog.close();
			}

			ngDialog.open({ template:'terms_and_condition_modal', scope:$scope });
		}
		
		$rootScope.hasDetails = AppyCabService.hasDetails();
		$rootScope.page_title="Take me Home";
		$rootScope.backButton = true;
		$rootScope.pageClass='page';

		$rootScope.journey_id = '';

		$scope.email_activated = true;

		geolocation.getLocation().then(function(data){
	      $scope.current_lat = data.coords.latitude;
	      $scope.current_lng = data.coords.longitude;

	      $scope.coords = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);

	      getFormattedAddress($scope.coords);

	    });

		AppyCabService.isEmailActivated().success(function(response) {
			if(response.activated=='no') {
				$scope.email_activated = false;
			} else {
				$scope.email_activated = true;
			}
		});

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
			from_address:localStorageService.get('address'),
			from_lat:localStorageService.get('lat'),
			from_lng:localStorageService.get('lng'),
			to_address:localStorageService.get('address'),
			to_lat:localStorageService.get('lat'),
			to_lng:localStorageService.get('lng'),

			pickup_date:$filter('date')(new Date(), 'dd/MM/yyyy'),
			pickup_time:$filter('date')(new Date(), 'h:mm a'),
		};

		var getFormattedAddress = function(pos) {

			geocoder = new google.maps.Geocoder();

			geocoder.geocode({
			   	latLng: pos
			}, function(responses) {
			    if (responses && responses.length > 0) {
			      document.getElementById("client_address").value = responses[0].formatted_address;
			      $scope.client.from_lat = responses[0].geometry.location.lat();
			      $scope.client.from_lng = responses[0].geometry.location.lng();
			      $scope.client.from_address = responses[0].formatted_address;
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
			var journey = AppyCabService.takeMeHomeNowProcess($scope.client);
			journey.success(function(response) {
				$rootScope.journey_id = response.data.id;
				$rootScope.journey_from_address = response.data.pickup_address;
				$rootScope.journey_to_address = response.data.destination_address;
				$rootScope.journey_from_lat = response.data.from_lat;
				$rootScope.journey_from_lng = response.data.from_lng;
				$rootScope.journey_to_lat = response.data.to_lat;
				$rootScope.journey_to_lng = response.data.to_lng;

				localStorageService.set('last_booking_pickup_address', response.data.pickup_address);
				localStorageService.set('last_booking_from_lat', response.data.from_lat);
				localStorageService.set('last_booking_from_lng', response.data.from_lng);
				localStorageService.set('last_booking_destination_address', response.data.destination_address);
				localStorageService.set('last_booking_to_lat', response.data.to_lat);
				localStorageService.set('last_booking_to_lng', response.data.to_lng);

				$rootScope.journey_date_time = $scope.client.pickup_date + ' ' + $scope.client.pickup_time;
				$location.path('/make-booking');
			});
		}
	});

	app.controller('PickMeFromHereNowController', function($scope, $rootScope, $location, $filter, localStorageService, AppyCabService, geolocation, ngDialog) {
		
		//check if agreed to terms
		if(!localStorageService.get('has_agreed_to_terms')) {
			
			$scope.agreedToTermsAndCondition = function() {
				localStorageService.set('has_agreed_to_terms', true);
				ngDialog.close();
			}

			ngDialog.open({ template:'terms_and_condition_modal', scope:$scope });
		}

		$rootScope.hasDetails = AppyCabService.hasDetails();
		$rootScope.page_title="Pick me up from here";
		$rootScope.backButton = true;
		$rootScope.pageClass='page';

		geolocation.getLocation().then(function(data){
	      $scope.current_lat = data.coords.latitude;
	      $scope.current_lng = data.coords.longitude;

	      $scope.coords = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);

	      getFormattedAddressFrom($scope.coords);

	    });

	    $scope.email_activated = true;
		AppyCabService.isEmailActivated().success(function(response) {
			if(response.activated=='no') {
				$scope.email_activated = false;
			} else {
				$scope.email_activated = true;
			}
		});

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
			from_address:localStorageService.get('address'),
			from_lat:localStorageService.get('lat'),
			from_lng:localStorageService.get('lng'),

			to_address:localStorageService.get('last_booking_destination_address'),
			to_lat:localStorageService.get('last_booking_to_lat'),
			to_lng:localStorageService.get('last_booking_to_lng'),

			pickup_date:$filter('date')(new Date(), 'dd/MM/yyyy'),
			pickup_time:$filter('date')(new Date(), 'h:mm a'),
		};

		var getFormattedAddressFrom = function(pos) {

			geocoder = new google.maps.Geocoder();

			geocoder.geocode({
			   	latLng: pos
			}, function(responses) {
			    if (responses && responses.length > 0) {
			      document.getElementById("client_address_from").value = responses[0].formatted_address;
			      $scope.client.from_lat = responses[0].geometry.location.lat();
			      $scope.client.from_lng = responses[0].geometry.location.lng();
			      $scope.client.from_address = responses[0].formatted_address;
			    } else {
			      alert('Cannot determine address at this location.');
			    }
			});
		}

		var getFormattedAddressTo = function(pos) {

			geocoder = new google.maps.Geocoder();

			geocoder.geocode({
			   	latLng: pos
			}, function(responses) {
			    if (responses && responses.length > 0) {
			      document.getElementById("client_address_to").value = responses[0].formatted_address;
			      $scope.client.to_lat = responses[0].geometry.location.lat();
			      $scope.client.to_lng = responses[0].geometry.location.lng();
			      $scope.client.to_address = responses[0].formatted_address;
			    } else {
			      alert('Cannot determine address at this location.');
			    }
			});
		}

		$scope.markerDroppedFrom = function() {
			getFormattedAddressFrom($scope.map.markers[0].getPosition());
		}

		$scope.markerDroppedTo = function() {
			getFormattedAddressTo($scope.map.markers[1].getPosition());
		}

		$scope.changedPositionFrom = function(event) {
			$scope.map.markers[0].setPosition(event.latLng);
			getFormattedAddressFrom(event.latLng);
		}

		$scope.changedPositionTo = function(event) {
			$scope.map.markers[1].setPosition(event.latLng);
			getFormattedAddressTo(event.latLng);
		}

		$scope.process = function() {
			var journey = AppyCabService.pickMeFromHereNowProcess($scope.client);
			journey.success(function(response) {
				$rootScope.journey_id = response.data.id;
				$rootScope.journey_from_address = response.data.pickup_address;
				$rootScope.journey_to_address = response.data.destination_address;
				$rootScope.journey_from_lat = response.data.from_lat;
				$rootScope.journey_from_lng = response.data.from_lng;
				$rootScope.journey_to_lat = response.data.to_lat;
				$rootScope.journey_to_lng = response.data.to_lng;

				localStorageService.set('last_booking_pickup_address', response.data.pickup_address);
				localStorageService.set('last_booking_from_lat', response.data.from_lat);
				localStorageService.set('last_booking_from_lng', response.data.from_lng);
				localStorageService.set('last_booking_destination_address', response.data.destination_address);
				localStorageService.set('last_booking_to_lat', response.data.to_lat);
				localStorageService.set('last_booking_to_lng', response.data.to_lng);

				$rootScope.journey_date_time = $scope.client.pickup_date + ' ' + $scope.client.pickup_time;
				$location.path('/make-booking');
			});
		}
	});

	app.controller('BookADifferentCabJourneyController', function($scope, $rootScope, $location, $filter, localStorageService, AppyCabService, ngDialog) {
		
		//check if agreed to terms
		if(!localStorageService.get('has_agreed_to_terms')) {
			
			$scope.agreedToTermsAndCondition = function() {
				localStorageService.set('has_agreed_to_terms', true);
				ngDialog.close();
			}

			ngDialog.open({ template:'terms_and_condition_modal', scope:$scope });
		}

		$rootScope.hasDetails = AppyCabService.hasDetails();
		$rootScope.page_title="Book a Cab";
		$rootScope.backButton = true;
		$rootScope.pageClass='page';

		$scope.email_activated = true;
		AppyCabService.isEmailActivated().success(function(response) {
			if(response.activated=='no') {
				$scope.email_activated = false;
			} else {
				$scope.email_activated = true;
			}
		});

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
			from_address:localStorageService.get('address'),
			from_lat:localStorageService.get('lat'),
			from_lng:localStorageService.get('lng'),

			to_address:localStorageService.get('address'),
			to_lat:localStorageService.get('lat'),
			to_lng:localStorageService.get('lng'),

			pickup_date:$filter('date')(new Date(), 'dd/MM/yyyy'),
			pickup_time:$filter('date')(new Date(), 'h:mm a'),
		};

		var getFormattedAddressFrom = function(pos) {

			geocoder = new google.maps.Geocoder();

			geocoder.geocode({
			   	latLng: pos
			}, function(responses) {
			    if (responses && responses.length > 0) {
			      document.getElementById("client_address_from").value = responses[0].formatted_address;
			      $scope.client.from_lat = responses[0].geometry.location.lat();
			      $scope.client.from_lng = responses[0].geometry.location.lng();
			      $scope.client.from_address = responses[0].formatted_address;
			    } else {
			      alert('Cannot determine address at this location.');
			    }
			});
		}

		var getFormattedAddressTo = function(pos) {

			geocoder = new google.maps.Geocoder();

			geocoder.geocode({
			   	latLng: pos
			}, function(responses) {
			    if (responses && responses.length > 0) {
			      document.getElementById("client_address_to").value = responses[0].formatted_address;
			      $scope.client.to_lat = responses[0].geometry.location.lat();
			      $scope.client.to_lng = responses[0].geometry.location.lng();
			      $scope.client.to_address = responses[0].formatted_address;
			    } else {
			      alert('Cannot determine address at this location.');
			    }
			});
		}

		$scope.markerDroppedFrom = function() {
			getFormattedAddressFrom($scope.map.markers[0].getPosition());
		}

		$scope.markerDroppedTo = function() {
			getFormattedAddressTo($scope.map.markers[1].getPosition());
		}

		$scope.changedPositionFrom = function(event) {
			$scope.map.markers[0].setPosition(event.latLng);
			getFormattedAddressFrom(event.latLng);
		}

		$scope.changedPositionTo = function(event) {
			$scope.map.markers[1].setPosition(event.latLng);
			getFormattedAddressTo(event.latLng);
		}

		$scope.process = function() {
			var journey = AppyCabService.bookADifferentCabJourneyProcess($scope.client);
			journey.success(function(response) {
				$rootScope.journey_id = response.data.id;
				$rootScope.journey_from_address = response.data.pickup_address;
				$rootScope.journey_to_address = response.data.destination_address;
				$rootScope.journey_from_lat = response.data.from_lat;
				$rootScope.journey_from_lng = response.data.from_lng;
				$rootScope.journey_to_lat = response.data.to_lat;
				$rootScope.journey_to_lng = response.data.to_lng;

				localStorageService.set('last_booking_pickup_address', response.data.pickup_address);
				localStorageService.set('last_booking_from_lat', response.data.from_lat);
				localStorageService.set('last_booking_from_lng', response.data.from_lng);
				localStorageService.set('last_booking_destination_address', response.data.destination_address);
				localStorageService.set('last_booking_to_lat', response.data.to_lat);
				localStorageService.set('last_booking_to_lng', response.data.to_lng);

				$rootScope.journey_date_time = $scope.client.pickup_date + ' ' + $scope.client.pickup_time;
				$location.path('/make-booking');
			});
		}
	});

	app.controller('ChangeBookingController', function($scope, $rootScope, $location, $filter, localStorageService, AppyCabService, ngDialog) {
		
		//check if agreed to terms
		if(!localStorageService.get('has_agreed_to_terms')) {
			
			$scope.agreedToTermsAndCondition = function() {
				localStorageService.set('has_agreed_to_terms', true);
				ngDialog.close();
			}

			ngDialog.open({ template:'terms_and_condition_modal', scope:$scope });
		}

		$rootScope.hasDetails = AppyCabService.hasDetails();
		$rootScope.page_title="Change Booking";
		$rootScope.backButton = false;
		$rootScope.pageClass='page';

		$scope.email_activated = true;
		AppyCabService.isEmailActivated().success(function(response) {
			if(response.activated=='no') {
				$scope.email_activated = false;
			} else {
				$scope.email_activated = true;
			}
		});

		$rootScope.back = function() {
			$rootScope.pageClass='page-back';
			$rootScope.backButton = false;
			$location.path('/choose');
		};

		$scope.client = {
			app_id:localStorageService.get('app_id'),
			journey_id:$rootScope.journey_id,
			fname:localStorageService.get('fname'),
			lname:localStorageService.get('lname'),
			email:localStorageService.get('email'),
			mobile:localStorageService.get('mobile'),
			from_address:$rootScope.journey_from_address,
			from_lat:$rootScope.journey_from_lat,
			from_lng:$rootScope.journey_from_lng,

			to_address:$rootScope.journey_to_address,
			to_lat:$rootScope.journey_to_lat,
			to_lng:$rootScope.journey_to_lng,

			pickup_date:$filter('date')(new Date(), 'dd/MM/yyyy'),
			pickup_time:$filter('date')(new Date(), 'h:mm a'),
		};

		var getFormattedAddressFrom = function(pos) {

			geocoder = new google.maps.Geocoder();

			geocoder.geocode({
			   	latLng: pos
			}, function(responses) {
			    if (responses && responses.length > 0) {
			      document.getElementById("client_address_from").value = responses[0].formatted_address;
			      $scope.client.from_lat = responses[0].geometry.location.lat();
			      $scope.client.from_lng = responses[0].geometry.location.lng();
			      $scope.client.from_address = responses[0].formatted_address;
			    } else {
			      alert('Cannot determine address at this location.');
			    }
			});
		}

		var getFormattedAddressTo = function(pos) {

			geocoder = new google.maps.Geocoder();

			geocoder.geocode({
			   	latLng: pos
			}, function(responses) {
			    if (responses && responses.length > 0) {
			      document.getElementById("client_address_to").value = responses[0].formatted_address;
			      $scope.client.to_lat = responses[0].geometry.location.lat();
			      $scope.client.to_lng = responses[0].geometry.location.lng();
			      $scope.client.to_address = responses[0].formatted_address;
			    } else {
			      alert('Cannot determine address at this location.');
			    }
			});
		}

		$scope.markerDroppedFrom = function() {
			getFormattedAddressFrom($scope.map.markers[0].getPosition());
		}

		$scope.markerDroppedTo = function() {
			getFormattedAddressTo($scope.map.markers[1].getPosition());
		}

		$scope.changedPositionFrom = function(event) {
			$scope.map.markers[0].setPosition(event.latLng);
			getFormattedAddressFrom(event.latLng);
		}

		$scope.changedPositionTo = function(event) {
			$scope.map.markers[1].setPosition(event.latLng);
			getFormattedAddressTo(event.latLng);
		}

		$scope.process = function() {
			var journey = AppyCabService.changeBooking($scope.client);
			journey.success(function(response) {
				$rootScope.journey_id = response.data.id;
				$rootScope.journey_from_address = response.data.pickup_address;
				$rootScope.journey_to_address = response.data.destination_address;
				$rootScope.journey_from_lat = response.data.from_lat;
				$rootScope.journey_from_lng = response.data.from_lng;
				$rootScope.journey_to_lat = response.data.to_lat;
				$rootScope.journey_to_lng = response.data.to_lng;

				localStorageService.set('last_booking_pickup_address', response.data.pickup_address);
				localStorageService.set('last_booking_from_lat', response.data.from_lat);
				localStorageService.set('last_booking_from_lng', response.data.from_lng);
				localStorageService.set('last_booking_destination_address', response.data.destination_address);
				localStorageService.set('last_booking_to_lat', response.data.to_lat);
				localStorageService.set('last_booking_to_lng', response.data.to_lng);

				$rootScope.journey_date_time = $scope.client.pickup_date + ' ' + $scope.client.pickup_time;
				$location.path('/make-booking');
			});
		}
	});

	app.controller('MakeBookingController', function($scope, $rootScope, $location, $filter, localStorageService, AppyCabService, toaster, ngDialog) {
		$rootScope.hasDetails = AppyCabService.hasDetails();
		$rootScope.page_title="Booked";
		$rootScope.backButton = false;
		$rootScope.pageClass='page';

		$scope.client = {
			app_id:localStorageService.get('app_id'),
			fname:localStorageService.get('fname'),
			lname:localStorageService.get('lname'),
			email:localStorageService.get('email'),
			mobile:localStorageService.get('mobile'),
			from_address:localStorageService.get('address'),
			from_lat:localStorageService.get('lat'),
			from_lng:localStorageService.get('lng'),

			to_address:localStorageService.get('address'),
			to_lat:localStorageService.get('lat'),
			to_lng:localStorageService.get('lng'),

			pickup_date:$filter('date')(new Date(), 'dd/MM/yyyy'),
			pickup_time:$filter('date')(new Date(), 'h:mm a'),
		};

		$scope.changeBooking = function() {
			$location.path('/change-booking');
		};

		$scope.openConfirm = function () {
			ngDialog.openConfirm({
				template: 'modalDialogId',
				className: 'ngdialog-theme-default'
			}).then(function (value) {
				console.log('Modal promise resolved. Value: ', value);

				AppyCabService.cancelCab($rootScope.journey_id).success(function(response) {
					$location.path('/choose');
					toaster.pop({type: 'success', title: "Booking Cancelled!", body:"You've successfully cancelled your cab"});
				});
				
			}, function (reason) {
				console.log('Modal promise rejected. Reason: ', reason);
			});
		};

		$scope.callbackTimer={};

		$scope.callbackTimer.finished=function(){
			ngDialog.close();

			$location.path('/choose');

			toaster.pop({type: 'success', title: "Booked!", body:"Thank you for booking your journey using Appy Cab. You will soon receive a text message confirming your booking and journey details."});

	        $scope.$apply();
	    };


	});

	
	app.controller('ActivateEmailController', function($scope, $rootScope, $location, $filter, localStorageService, AppyCabService, toaster, ngDialog) {
		
		//check if agreed to terms
		if(!localStorageService.get('has_agreed_to_terms')) {
			
			$scope.agreedToTermsAndCondition = function() {
				localStorageService.set('has_agreed_to_terms', true);
				ngDialog.close();
			}

			ngDialog.open({ template:'terms_and_condition_modal', scope:$scope });
		}

		$rootScope.hasDetails = AppyCabService.hasDetails();
		$rootScope.page_title="Email Activation";
		$rootScope.backButton = true;
		$rootScope.pageClass='page';

		$rootScope.back = function() {
			window.history.back();
		};

		$scope.client = {
			app_id:localStorageService.get('app_id'),
			activation_code:''
		};

		$scope.activateNow = function() {
			AppyCabService.sendActivationCode().success(function(response) {
				toaster.pop('success','',response.flash);
			});
		};

		$scope.activate = function() {
			var attempt = AppyCabService.emailAttemptActivate($scope.client);

			attempt.success(function(response) {
				toaster.pop('success','',response.flash);
				window.history.back();
			});

			attempt.error(function(response) {
				toaster.pop('error','',response.flash);
			});

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

        var sanitizeTakeMeHomeData = function (data) {
            return {
                app_id: $sanitize(data.app_id),
                fname: $sanitize(data.fname),
                lname: $sanitize(data.lname),
                email: $sanitize(data.email),
                mobile: $sanitize(data.mobile),
                from_address: $sanitize(data.from_address),
                from_lat: $sanitize(data.from_lat),
                from_lng: $sanitize(data.from_lng),
                to_address: $sanitize(data.to_address),
                to_lat: $sanitize(data.to_lat),
                to_lng: $sanitize(data.to_lng),
                pickup_date: $sanitize(data.pickup_date),
                pickup_time: $sanitize(data.pickup_time),
                _token: APP_TOKEN
            };
        };

        var sanitizeBookADifferentCabJourneyData = function (data) {
            return {
                app_id: $sanitize(data.app_id),
                fname: $sanitize(data.fname),
                lname: $sanitize(data.lname),
                email: $sanitize(data.email),
                mobile: $sanitize(data.mobile),
                from_address: $sanitize(data.from_address),
                from_lat: $sanitize(data.from_lat),
                from_lng: $sanitize(data.from_lng),
                to_address: $sanitize(data.to_address),
                to_lat: $sanitize(data.to_lat),
                to_lng: $sanitize(data.to_lng),
                pickup_date: $sanitize(data.pickup_date),
                pickup_time: $sanitize(data.pickup_time),
                _token: APP_TOKEN
            };
        };

        var sanitizeChangeBookingData = function (data) {
            return {
                app_id: $sanitize(data.app_id),
                journey_id: $sanitize(data.journey_id),
                fname: $sanitize(data.fname),
                lname: $sanitize(data.lname),
                email: $sanitize(data.email),
                mobile: $sanitize(data.mobile),
                from_address: $sanitize(data.from_address),
                from_lat: $sanitize(data.from_lat),
                from_lng: $sanitize(data.from_lng),
                to_address: $sanitize(data.to_address),
                to_lat: $sanitize(data.to_lat),
                to_lng: $sanitize(data.to_lng),
                pickup_date: $sanitize(data.pickup_date),
                pickup_time: $sanitize(data.pickup_time),
                _token: APP_TOKEN
            };
        };

        var sanitizePickMeFromHereNowData = function (data) {
            return {
                app_id: $sanitize(data.app_id),
                fname: $sanitize(data.fname),
                lname: $sanitize(data.lname),
                email: $sanitize(data.email),
                mobile: $sanitize(data.mobile),
                from_address: $sanitize(data.from_address),
                from_lat: $sanitize(data.from_lat),
                from_lng: $sanitize(data.from_lng),
                to_address: $sanitize(data.to_address),
                to_lat: $sanitize(data.to_lat),
                to_lng: $sanitize(data.to_lng),
                pickup_date: $sanitize(data.pickup_date),
                pickup_time: $sanitize(data.pickup_time),
                _token: APP_TOKEN
            };
        };

        var sanitizeEmailActivationData = function (data) {
        	return {
        		app_id: $sanitize(data.app_id),
                code: $sanitize(data.activation_code),
                _token: APP_TOKEN
        	};
        };

        var sanitizeEmailActivationData2 = function (data) {
        	return {
                code: $sanitize(data.activation_code),
                _token: APP_TOKEN
        	};
        };

        var sanitizeContactDataUser = function (data) {
        	return {
        		type: "user",
                email: $sanitize(data.email),
                name: $sanitize(data.name),
                comment: $sanitize(data.comment),
                _token: APP_TOKEN
        	};
        };

        var sanitizeContactDataCompany = function (data) {
        	return {
        		type: "company",
        		email: $sanitize(data.email),
                name: $sanitize(data.name),
                taxi_company_name: $sanitize(data.taxi_name),
                to_know: $sanitize(parseInt(data.to_know)),
                comment: $sanitize(data.comment),
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

				var detail = $http.post('http://appycab.co.uk/api/v1/details', sanitizeDetailsData(data));

				return detail;
			},

			takeMeHomeNowProcess: function(data) {

				var detail = $http.post('http://appycab.co.uk/api/v1/take-me-home-now', sanitizeTakeMeHomeData(data));

				return detail;
			},

			bookADifferentCabJourneyProcess: function(data) {

				var detail = $http.post('http://appycab.co.uk/api/v1/book-different-cab-journey', sanitizeBookADifferentCabJourneyData(data));

				return detail;
			},

			pickMeFromHereNowProcess: function(data) {

				var detail = $http.post('http://appycab.co.uk/api/v1/pick-me-from-here-now', sanitizePickMeFromHereNowData(data));

				return detail;
			},

			changeBooking: function(data) {

				var detail = $http.post('http://appycab.co.uk/api/v1/change-booking', sanitizeChangeBookingData(data));

				return detail;
			},

			cancelCab: function(journey_id) {

				var detail = $http.get('http://appycab.co.uk/api/v1/cancel-cab/'+journey_id);

				return detail;
			},

			isEmailActivated: function() {

				var app_id = localStorageService.get('app_id');

				var detail = $http.get('http://appycab.co.uk/api/v1/is-email-activated/'+app_id);

				return detail;

			},

			sendActivationCode: function() {
				var app_id = localStorageService.get('app_id');

				var detail = $http.get('http://appycab.co.uk/api/v1/resend-email-activation-code/'+app_id);

				return detail;
			},

			sendActivationCode2: function(email) {

				var detail = $http.get('http://appycab.co.uk/api/v1/resend-email-activation-code2/'+email);

				return detail;
			},

			emailAttemptActivate: function(data) {

				var detail = $http.post('http://appycab.co.uk/api/v1/activate-email', sanitizeEmailActivationData(data));

				return detail;
			},

			emailAttemptActivate2: function(data) {

				var detail = $http.post('http://appycab.co.uk/api/v1/activate-email2', sanitizeEmailActivationData2(data));

				return detail;
			},

			contactSubmit: function(type, data) {

				if(type=='user')
					var detail = $http.post('http://appycab.co.uk/api/v1/contact-submit', sanitizeContactDataUser(data));
				else
					var detail = $http.post('http://appycab.co.uk/api/v1/contact-submit', sanitizeContactDataCompany(data));

				return detail;
			}
		};
	});

})();

