<?php
// Cambia esto por la contraseña que quieras probar
$password = "alumno1234"; 

echo "<h1>Tu contraseña: $password</h1>";
echo "<h3>Tu hash para la Base de Datos:</h3>";
echo password_hash($password, PASSWORD_DEFAULT);
?>