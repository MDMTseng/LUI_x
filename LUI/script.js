var LUIModule = angular.module('LUI_App', ['ngAnimate']);

LUIModule.factory('Data', function() {
	return {};
});
LUIModule.run(function() {
	console.log("LUIModule.run");
	//.attach(document.body);
	FastClick.attach(document.body);
}); 

LUIModule.controller('TopCtrl', ['$scope', '$timeout', '$interval', '$http', 'Data',
function($scope, $timeout, $interval, $http, Data) {
	$scope.ver ="?v=T"+Math.random();
	//$scope.broType="-ms-";
	$scope.Data = Data;
	$scope.Tmp = {};

	$scope.delayGoPage = function(URL, delayms) {
		if (delayms != null && delayms > 5)
			$timeout(function() {
				$scope.goPage(URL);
			}, delayms);
		else
			$scope.goPage(URL);
	};
	$scope.goPage = function(URL) {
		$scope.Data.pageStackIdx++;
		$scope.Data.pageStack[$scope.Data.pageStackIdx] = (URL + $scope.ver);
		$scope.Data.currentPage = URL + $scope.ver;

		$scope.Data.transeType = "Fade_F";
	};

	$scope.logData = function() {
		//console.log($scope.Data);

	};
	$scope.backPage = function() {
		if ($scope.Data.pageStackIdx > 0) {
			$scope.Data.pageStackIdx--;
			$scope.Data.currentPage = $scope.Data.pageStack[$scope.Data.pageStackIdx];
			$scope.Data.transeType = "Fade_F";
		}
	};
	$scope.addver = function(URL) {

		return URL + $scope.ver;
	};

	$scope.saveCtrlData = function() {
		if(localStorage!=null)
		localStorage.setItem('LUI_Data', JSON.stringify(Data));
		//alert("ssss");
	}
	
	
	var init = function() {
		var T=null;
		if(localStorage!=null)
		T = JSON.parse(localStorage.getItem('LUI_Data'));
		if (T != null&&T.ServerIP!=null)
		 Data.ServerIP = T.ServerIP;
		 console.log($scope.Data.ServerIP );
		/* else {*/
		$scope.Data.pageStack = new Array();
		$scope.Data.pageStackIdx = -1;
		$scope.goPage("pages/welcome/main.html");
		
		
		Data.prjName="T3OP";
		//$scope.Data.transeType = "slide_L";
		//}
	};
	init();
	/*$scope.$on('$includeContentLoaded', function(event) {
	 //console.log('another include was loaded', event.targetScope);
	 });*/

	$scope.Data.isfullScreen = false;
	$scope.toggleFScr = function() {
		if (!$scope.Data.isfullScreen) {
			var docElm = document.documentElement;
			if (docElm.requestFullscreen) {
				docElm.requestFullscreen();
			} else if (docElm.mozRequestFullScreen) {
				docElm.mozRequestFullScreen();
			} else if (docElm.webkitRequestFullScreen) {
				docElm.webkitRequestFullScreen();
			} else if (docElm.msRequestFullscreen) {
				docElm.msRequestFullscreen();
			}

		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		}
		$scope.Data.isfullScreen = !$scope.Data.isfullScreen;

	};
	$scope.ExitFScr = function() {
		document.webkitExitFullScreen();

	};

}]).directive('script', function() {
	return {
		restrict : 'E',
		scope : false,
		link : function(scope, elem, attr) {
			if (attr.type === 'text/javascript-lazy') {

				var oHead = document.getElementsByTagName('head').item(0);
				var oScript = document.createElement("script");
				oScript.type = "text/javascript";
				oScript.src = attr.src;
				oHead.appendChild(oScript);

				//console.log(elem);
				/*var code = elem.text();
				 var f = new Function(code);
				 f();*/
			}
		}
	};
});

window.onbeforeunload = function() {
	angular.element(document.getElementById('idCtrl')).scope().$apply(function(scope) {
		//scope.saveCtrlData();
	});
	//return "Are you sure that you wanna leave?";
};

