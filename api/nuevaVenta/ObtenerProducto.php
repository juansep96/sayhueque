<?php

require_once "../PDO.php";

$dato=$_POST['idProducto'];

$ObtenerProducto = $conexion->prepare("SELECT * from productos WHERE id_producto=:1");
$ObtenerProducto->bindParam(':1',$dato);
$ObtenerProducto->execute();

$result = $ObtenerProducto->fetchAll(\PDO::FETCH_ASSOC);

print_r (json_encode($result));


?>
