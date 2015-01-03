<?php
include("../../mysql_connect.inc.php");

$devID=$_GET["devID"];
$result = mysql_query("SELECT info FROM devInfo
WHERE dev_id IN ('".$devID."')",$link);
/*$rows = array();
while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
}
$response=json_encode($rows);*/
/*
if($devID=="agap_Prj") {
$response=$devID;
} else {
$response="$hint";
}*/
$num_rows = mysql_num_rows($result);
if($num_rows!=0)
	echo '{"'.$devID.'":'.mysql_fetch_assoc($result)[info].'}';
else 
	echo '{"No Data":"'.$devID.'"}';

?>