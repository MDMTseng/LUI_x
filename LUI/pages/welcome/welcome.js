LUIModule.controller('WelcomeCtrl', ['$scope', '$timeout', '$http', 'Data',
function($scope, $timeout, $http, Data) {

	$scope.Tmp.loadingProgress = 0;
	$scope.Tmp.prog1 = 0;
	$scope.ServerIP = null;
	$scope.InOutUI = "";
	$scope.State = "";
	$scope.StateInfo = "";
	var FSM = function(delay) {
		if (delay == null)
			delay = 100;
		$timeout(function() {
			UpdateState();
			console.log(now_state);
			DoState();
			$scope.State = now_state;
			$scope.StateInfo = "";

		}, delay);
	};

	var states = {
		Init : "Init",
		CheckIdentity : "CheckIdentity",
		TestConnection : "TestConnection",
		UserInputLocalIP : "UserInputLocalIP",
		Fail_NoLogin : "Fail_NoLogin",
		OK_getDevices : "OK_getDevices",
		GetDeviceData : "GetDeviceData",
		EnterMainUI : "EnterMainUI",
	};
	var stateInfo = {
		isOK : false,
		LocalIP : "",
		LocalDomain : "",
		ServerIP : "",
		ExeTimeout : 3000,
		ExeTimeoutPromise : null,

	};
	function init() {
		console.log(Data);
		console.log(stateInfo);
		stateInfo.ServerIP = Data.ServerIP;
		FSM();
	}

	init();
	var now_state = states.Init;
	$scope.inputAddr = function(event, addr) {
		event.target.blur();
		console.log(addr);
		if ( typeof addr == 'undefined' || addr == null || addr.length == 0) {
			FSM();
			return;
		}
		if (addr.indexOf("http://") != 0)
			addr = "http://" + addr;
		var portPos = addr.lastIndexOf(":");
		if (portPos == -1 || portPos < 9)
			addr += ":5213";

		if (now_state != states.UserInputLocalIP)
			return;
		stateInfo.ServerIP = Data.ServerIP = addr;
		stateInfo.isOK = true;
		FSM();
	};
	function UpdateState() {

		switch(now_state) {
		case states.Init:

			now_state = states.CheckIdentity;
			break;
		case states.CheckIdentity:
			if (!stateInfo.isOK)
				now_state = states.Fail_NoLogin;
			else if (stateInfo.ServerIP != null)
				now_state = states.TestConnection;
			else
				now_state = states.UserInputLocalIP;
			break;
		case states.TestConnection:

			if (stateInfo.isOK)
				now_state = states.OK_getDevices;
			else
				now_state = states.UserInputLocalIP;
			break;
		case states.UserInputLocalIP:
			if (stateInfo.isOK)
				now_state = states.TestConnection;
			else
				now_state = states.UserInputLocalIP;

			break;
		case states.Fail_NoLogin:
			break;
		case states.OK_getDevices:
			now_state = states.GetDeviceData;
			break;
		case states.GetDeviceData:
			if (stateInfo.isOK)
				now_state = states.EnterMainUI;
			else
				now_state = states.Fail_NoLogin;
			break;
		case states.EnterMainUI:
			break;
		default:
			now_state = states.init;
			break;
		}
		stateInfo.isOK = false;
	}

	function DoState() {
		switch(now_state) {
		case states.Init:
			break;
		case states.CheckIdentity:
			stateInfo.isOK = true;
			FSM();
			break;

		case states.TestConnection:
			retryTimes = 0;
			TestServer2(stateInfo.ServerIP);

			break;
		case states.UserInputLocalIP:

			break;
		case states.Fail_NoLogin:
			$delay(function() {
				document.location.href = "http://mdm.noip.me/wordpress";
			}, 2000);
			break;
		case states.OK_getDevices:

			var deviceID = Object.keys(Data.deviceEle)[0];
			$scope.StateInfo = " : "+deviceID;
			var responsePromise = $http.get("pages/dash/deviceInfo.php?devID=" + deviceID);
			responsePromise.success(function(data, status, headers, config) {
				
				if(typeof data["No Data"] === "undefined")
					Data.deviceEle = data;
				stateInfo.isOK = true;
				FSM(200);
			});
			responsePromise.error(function(data, status, headers, config) {
				alert("AJAX failed!");
				FSM(200);
			});
			break;
		case states.GetDeviceData:

				stateInfo.isOK = true;
				FSM();
			break;
		case states.EnterMainUI:
			$scope.delayGoPage('pages/dash/main.html');
			break;
		default:
		}

	}

	var delay = 100;
	var retryTimes = 0;
	var TestServer2 = function(Addr) {
		console.log(Addr);
		var responsePromise = $http.jsonp(Addr, {
			params : {
				callback : "JSON_CALLBACK",
				req : "deviceInfo",
			},
			timeout : 3000
		}).success(function(data, status, headers, config) {
			console.log(Addr + ':::000000000');
			findServer(Addr, data, status, headers, config);
		}).error(function(data, status, headers, config) {

			GetProgress(4, retryTimes * 25);
			console.log(Addr + ">re>" + retryTimes);
			$scope.StateInfo = "retry:" + retryTimes + "/4";
			if (retryTimes++ > 3)
				FSM();
			else
				setTimeout(TestServer2(Addr), delay);
		});

	};

	function findServer(Addr, data, status, headers, config) {
		console.log(Addr + 'success');
		Data.ServerIP = config.url;
		console.log(data);
		$scope.ServerIP = config.url;
		Data.deviceEle = data;
		$scope.saveCtrlData();
		$scope.InOutUI = "showip";
		stateInfo.isOK = true;
		FSM();
	}

	function cancelExeTimeout() {
		if (stateInfo.ExeTimeout != null) {
			$timeout.cancel(stateInfo.ExeTimeout);
			stateInfo.ExeTimeout = null;
		}
	}

	var GetProgress = function(maxIdx, percent) {
		$scope.Tmp.prog1 = Math.floor(percent * (maxIdx + 1) / 100);
		return $scope.Tmp.prog1;
	};
}]);
