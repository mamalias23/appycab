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
			});
	});

	app.controller('HomeController', function($scope, $rootScope, $location, localStorageService) {

		$scope.process = function() {
			$location.path('/choose');
		};

		$scope.back = function() {
			$rootScope.pageClass='page-back';
			history.back();
		};
	});

	app.controller('ChooseController', function($scope, $rootScope, $location, localStorageService) {
		$rootScope.pageClass='page';
		$scope.back = function() {
			$rootScope.pageClass='page-back';
			$location.path('/');
		};
	});

})();
