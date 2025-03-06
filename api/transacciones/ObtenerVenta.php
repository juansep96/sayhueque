<?php

require_once "../PDO.php";

$idVenta=$_POST['idVenta'];

$ObtenerDetalle = $conexion -> prepare("SELECT * from ventaDetalle LEFT JOIN ventas ON id_venta=idVenta_ventaDetalle LEFT JOIN productos ON idProducto_ventaDetalle = id_producto LEFT JOIN facturas ON idFactura_venta=id_factura WHERE idVenta_ventaDetalle=:1");
$ObtenerDetalle -> bindParam(':1',$idVenta);
$ObtenerDetalle -> execute();

$result = $ObtenerDetalle->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
