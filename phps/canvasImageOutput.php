<?php
$image64 = $_POST["imgData"];
$f = base64_decode($image64);
$name = date("ymdhis");
$img = file_put_contents("../imgs/".$name.".jpg", $f);
if($img){
	echo $name.".jpg<br/>";
}else{
	echo "fail";
}
?>