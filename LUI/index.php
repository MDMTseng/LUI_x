<?php
try {

	if (!file_exists('../../wp-load.php'))
		throw new Exception('load.php does not exist');
	else
		require_once ('../../wp-load.php');
	global $current_user;
	if ($current_user -> ID == 0) {
		header('Location: http://mdm.noip.me/wordpress/app');
		exit ;
	}
} catch (Exception $e) {
}
?>

<!doctype html>
<html lang="en">
<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
	
	<meta http-equiv="cache-control" content="max-age=0" />
	<meta http-equiv="cache-control" content="no-cache" />
	<meta http-equiv="expires" content="0" />
	<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
	<meta http-equiv="pragma" content="no-cache" />
	<head>
		<meta charset="UTF-8">
		<title>LUI- web ver.</title>
		<script src="js/prefixfree.min.js"></script>
		<link href="animations.css" rel="stylesheet" type="text/css">
		<link href="basis.css" rel="stylesheet" type="text/css">
		<script src="js/angular.min.js"></script>
		<script src="js/angular-animate.min.js"></script>
		<link type="text/css" rel="stylesheet" href="pages/welcome/welcome.css">
		<link type="text/css" rel="stylesheet" href="pages/dash/dash.css">

		<script src="script.js"></script>

		<script src="js/WebRTC_GetIP.js"></script>
		<script  src="pages/welcome/welcome.js"></script>
		<script  src="pages/dash/dash.js"></script>

		<script src="js/fastclick.js"></script>
	</head>
	<body  ng-app="LUI_App" >

		<div style="height:100%;width:100%;position: relative;"  id="idCtrl" ng-controller="TopCtrl">
			<div class="slide-animate-container">
				<div class="slide-animate" ng-class="Data.transeType" style="height:100%" ng-include="Data.currentPage"  onload="Call(1)"></div>

			</div>

			<!--<div style="height:10px;width:10px;position: absolute;overflow: hidden" class="preLoadPage" ng-include="'pages/dash/main.html'"></div>
			-->
		</div>
	</body>
</html>