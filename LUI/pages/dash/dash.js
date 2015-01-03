var DashCtrl = LUIModule.controller('DashCtrl', ['$scope', '$timeout', '$interval', '$http', '$animate', 'Data',
function($scope, $timeout, $interval, $http, $animate, Data) {
	var bodyEle = null;
	
	$scope.Data = Data;
	

	var getStr = [];

	var url = Data.ServerIP;
	var UpdatingState = false;
	
	$scope.postSwitchState = function(idx) {
		var start = Date.now();
		UpdatingState = false;

		var Str = "";
		for (var i = 0; i < $scope.SwitchStats.length; i++) {
			if (i != idx)
				Str += "_";
			else if ($scope.SwitchStats[i] == 0)
				Str += "0";
			else
				Str += "1";
		}
		console.log(Str);

		var request = $http({
			method : "get",
			url : url,
			params : {
				req : "setStatus",
				val : Str
			},
			timeout : 2800
		}).success(function(data, status, headers, config) {
			$scope.connectState = "O::" + (Date.now() - start);
			console.log($scope.connectState);
		}).error(function(data, status, headers, config) {
			$scope.connectState = "T::" + (Date.now() - start);
			console.log($scope.connectState);
		});
		console.log($scope.SwitchStats);
		//getSwitchState();

	};
	
	
	
	
	$scope.postHoldState = function(idx) {
		var Str = "";
		for (var i = 0; i < $scope.Tmp.HoldSwitchStats.length; i++) {
			
			if ($scope.Tmp.HoldSwitchStats[i] == 0)
				Str += "0";
			else if ($scope.Tmp.HoldSwitchStats[i] == 1)
				Str += "1";
			else
				Str += "_";
		}
		console.log($scope.Tmp.HoldSwitchStats);
		console.log(Str);


		$scope.connectState = ">::>>>";

		var start = Date.now();
		UpdatingState = true;
		var request = $http.jsonp(url, {
			params : {

				callback : "JSON_CALLBACK",
				req : "r_setStatus",
				val : Str
			},
			timeout : 3500
		}).success(function(data, status, headers, config) {

			
			console.log(data);
			$scope.connectState = data.etc + "::" + (Date.now() - start);
			if (!UpdatingState)
				return;
			getStr = data.getStatus;
			var i = 0;
			for (; i < data.getStatus.length; i++) {

				if (data.getStatus[i] == '0')
					$scope.SwitchStats[i] = 0;
				else
					$scope.SwitchStats[i] = 1;
			}
			console.log(data);

		}).error(function(data, status, headers, config) {

			errorC++;
			$scope.connectState = "X::" + errorC;
			UpdatingState = false;
			console.log("lost connection");
		});



	};
	$scope.connectState = ">::>>>";
	var errorC = 0;
	var getSwitchState = function() {
		$scope.connectState = ">::>>>";

		var start = Date.now();
		UpdatingState = true;
		var request = $http.jsonp(url, {
			params : {

				callback : "JSON_CALLBACK",
				req : "getStatus"
			},
			timeout : 7500
		}).success(function(data, status, headers, config) {

			$timeout(function() {
				getSwitchState();
			}, 3000);
			$scope.connectState = data.etc + "::" + (Date.now() - start);
			if (!UpdatingState)
				return;
			getStr = data.getStatus;
			var i = 0;
			for (; i < data.getStatus.length; i++) {

				if (data.getStatus[i] == '0')
					$scope.SwitchStats[i] = 0;
				else
					$scope.SwitchStats[i] = 1;
			}
			console.log(data);

		}).error(function(data, status, headers, config) {
			$timeout(function() {
				getSwitchState();
			}, 3000);
			errorC++;
			$scope.connectState = "X::" + errorC;
			UpdatingState = false;
			console.log("lost connection");
		});
	};

	var getSwitchStateUpdater = $timeout(function() {
		getSwitchState();
	}, 1000);
	
	$scope.deviceEle = Data.deviceEle;
	$scope.SwitchStats = new Array(Data.deviceEle.agap_Prj.length);
	$scope.Tmp.HoldSwitchStats = new Array(Data.deviceEle.agap_Prj.length);
	$scope.initHoldMode = function() 
	{
		var i=0;
		for(;i<$scope.Tmp.HoldSwitchStats.length;i++)
		{
			$scope.Tmp.HoldSwitchStats [i]=-1;
		}
	}
	
	$scope.onResize = function(ele) {
		
		var targetDiv=Math.round(ele.clientWidth/200);
		console.log(ele.clientWidth);
		console.log(targetDiv);
		$scope.Tmp.adaptW={'width':100/targetDiv+'%'};//targetDiv;
		
		console.log($scope.Tmp.adaptW);
	};
}]);
DashCtrl.directive('resize', function($window) {
	return function(scope, element) {
		var w = angular.element($window);

		scope.onResize(element[0]);
		w.bind('resize', function() {
			scope.$apply(function(){
			scope.onResize(element[0]);
			});
		});
	};
});
DashCtrl.directive('loadprob', function($window) {
	return function(scope, element) {
		var w = angular.element($window);

		scope.onResize(element[0].parentNode);
		//alert('sssssssssssssssss');
	};
});
