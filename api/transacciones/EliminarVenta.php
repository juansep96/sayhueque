<?php

require_once "../PDO.php";

$idVenta = $_POST['idVenta'];

$ObtenerVenta = $conexion -> prepare('SELECT * from ventas WHERE id_venta=:1');
$ObtenerVenta -> bindParam(':1',$idVenta);
$ObtenerVenta -> execute();

foreach($ObtenerVenta as $Venta){
  $idSucursal = $Venta['idSucursal_venta'];
  $idSucursal = intval($idSucursal);
  switch ($idSucursal) {
    case 1:
        $stock = "stock_1_producto";
        break;
    case 2:
        $stock = "stock_2_producto";
        break;
    case 3:
        $stock = "stock_1_producto";
        break;
    case 5:
        $stock = "stock_3_producto";
    break;
}

}


$EliminarVenta = $conexion -> prepare("UPDATE ventas SET estado_venta=0 WHERE id_venta=:1");
$EliminarVenta -> bindParam(':1',$idVenta);
$EliminarVenta -> execute();

$ObtenerItems = $conexion -> prepare("SELECT * from ventaDetalle WHERE idVenta_ventaDetalle=:1");
$ObtenerItems -> bindParam(':1',$idVenta);
$ObtenerItems -> execute();

foreach($ObtenerItems as $item){
  $cantidad = $item['cantidad_ventaDetalle'];
  $idProducto = $item['idProducto_ventaDetalle'];
  $AumentarStock = $conexion -> query ("UPDATE productos SET $stock=$stock+'$cantidad' WHERE id_producto='$idProducto'");
}

?>
