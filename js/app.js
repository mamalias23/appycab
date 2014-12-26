(function() {
	var app = angular.module('appycab', ['LocalStorageModule', 'ngRoute', 'ngAnimate', 'angularValidator']);

	app.config(function(localStorageServiceProvider, $routeProvider) {
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
			});
	});

	app.controller('HomeController', function($scope, $rootScope, $location, localStorageService) {
		
		if(localStorageService.get('fname')!==null 
			&& localStorageService.get('lname')!==null 
			&& localStorageService.get('email')!==null 
			&& localStorageService.get('mobile')!==null 
			&& localStorageService.get('address')!==null) {

			$location.path('/choose');
		} else {
			$location.path('/details');
		}

	});

	app.controller('DetailsController', function($scope, $rootScope, $location, localStorageService) {
		$rootScope.page_title="Welcome!";
		$rootScope.backButton = false;

		$scope.client = {
			fname:localStorageService.get('fname'),
			lname:localStorageService.get('lname'),
			email:localStorageService.get('email'),
			mobile:localStorageService.get('mobile'),
			address:localStorageService.get('address'),
		};

		$scope.process = function() {

			localStorageService.set('fname', $scope.client.fname);
			localStorageService.set('lname', $scope.client.lname);
			localStorageService.set('email', $scope.client.email);
			localStorageService.set('mobile', $scope.client.mobile);
			localStorageService.set('address', $scope.client.address);

			$location.path('/choose');
		};
	});

	app.controller('ChooseController', function($scope, $rootScope, $location, localStorageService) {
		$rootScope.page_title="Choose";
		$rootScope.backButton = true;
		$rootScope.pageClass='page';
		$rootScope.back = function() {
			$rootScope.pageClass='page-back';
			$rootScope.backButton = false;
			$location.path('/');
		};
	});

	app.controller('TakeMeHomeNowController', function($scope, $rootScope, $location, localStorageService) {
		$rootScope.page_title="Take me Home";
		$rootScope.backButton = true;
		$rootScope.pageClass='page';
		$rootScope.back = function() {
			$rootScope.pageClass='page-back';
			$rootScope.backButton = false;
			$location.path('/choose');
		};
	});

	app.controller('PickMeFromHereNowController', function($scope, $rootScope, $location, localStorageService) {
		$rootScope.page_title="Pick me up from here";
		$rootScope.backButton = true;
		$rootScope.pageClass='page';
		$rootScope.back = function() {
			$rootScope.pageClass='page-back';
			$rootScope.backButton = false;
			$location.path('/choose');
		};
	});

	app.controller('BookADifferentCabJourneyController', function($scope, $rootScope, $location, localStorageService) {
		$rootScope.page_title="Book a Cab";
		$rootScope.backButton = true;
		$rootScope.pageClass='page';
		$rootScope.back = function() {
			$rootScope.pageClass='page-back';
			$rootScope.backButton = false;
			$location.path('/choose');
		};
	});

})();
