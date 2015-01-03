<?php
//對資料庫連線
$link =mysql_connect("localhost", "root", "pigsister321");
if(!@$link )
        die("無法對資料庫連線");

//資料庫連線採UTF8
mysql_query("SET NAMES utf8");

$link_LUI =mysql_select_db("LUI",$link);
//選擇資料庫
if(!@$link_LUI)
        die("無法使用資料庫");
?>   