<?php

require_once "../PDO.php";

date_default_timezone_set("America/Argentina/Buenos_Aires");
setlocale(LC_ALL,"es_ES");
$cuando = date("Y-m-d H:i:s");


$datos = json_decode($_POST['data'],true);
$items = $datos['line_items'];


foreach($items as $producto){
    $cantidad = $producto['quantity'];
    $idProducto = $producto['sku'];
    $stock_a_sumar = 'stock_3_producto';
    //$AumentarStock = $conexion -> query ("UPDATE productos SET $stock_a_sumar=$stock_a_sumar+'$cantidad' WHERE id_producto='$idProducto'");
}




?>