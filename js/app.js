(function() {
	var app = angular.module('appycab', ['LocalStorageModule', 'ngRoute', 'ngAnimate']);

	app.config(function(localStorageServiceProvider, $routeProvider) {
		localStorageServiceProvider
			.setPrefix('appycab')
			.setStorageType('sessionStorage')
			.setStorageCookie(0, '/');

		$routeProvider
			.when('/', {
				templateUrl: 'page-home.html',
				controller: 'HomeController'
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
		$rootScope.page_title="Welcome!";
		$rootScope.backButton = false;
		$scope.process = function() {
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
