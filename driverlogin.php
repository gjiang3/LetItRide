<html>
  <head></head>
  <body>





<?php  session_start();
require('php/connection.php');

if (isset($_POST['email']) and isset($_POST['password'])){

$username = $_POST['email'];
$password = $_POST['password'];

$query = "SELECT * FROM `rut` WHERE Email='$username' and Password='$password'"; //Checking the values are existing in the database or not

$result = mysqli_query($mysqli, $query) or die(mysql_error());
$count = mysqli_num_rows($result);



$query1 = "SELECT UserID FROM `rut` WHERE Email='$username' and Password='$password'";
$result1 = mysqli_query($mysqli, $query1) or die(mysql_error());

$row = mysqli_fetch_row($result1);
$userID = $row[0];






if ($count == 1){      //If the posted values are equal to the database values, then session will be created for the user.
  $row = mysqli_fetch_array($result);
  //echo "$row";
$_SESSION['UserID'] = $userID; //saves email IN SESSION


$query2 = "SELECT UserID from dit where userID = $userID";
//echo "42 ";
$result2 = mysqli_query($mysqli, $query2) or die(mysql_error());
//echo "44 ";
$count = mysqli_num_rows($result2);
//echo "46 ";
if($count == 0){
	//echo "48 ";
	header( 'Location: additionalinformationpageDriver.html' );
} else {
	//echo "51 ";
	header( 'Location: driverhomepage.php' );
}
}
else
{
  $_SESSION['error'] = "Invalid login credentials";
  echo "<script type='text/javascript'>alert('Invalid login credentials! Please try again. ')</script>";
  header( "refresh:0; url=login.html" );

}
  


}



?>





 </body>
</html>
