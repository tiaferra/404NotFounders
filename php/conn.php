<?php
$host = "localhost";
$user = "progettoprogweb";
$password = "";
$dbname = "my_progettoprogweb"; 

// Connessione
$conn = new mysqli($host, $user, $password, $dbname);

// Controlla errori
if ($conn->connect_error) {
  die("Connessione fallita: " . $conn->connect_error);
}
?>