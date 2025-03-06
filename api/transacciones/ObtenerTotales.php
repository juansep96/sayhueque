<?php

require_once "../PDO.php";

$fechaIni = $_POST['fecha'].' 00:00:00';
$fechaFin = $_POST['fecha'].' 23:59:59';
$idSucursal = $_POST['idSucursal'];

$ObtenerTotales = $conexion -> prepare("SELECT SUM(totalVenta_venta) as 'bruto', SUM(pagoTransferencia_venta) as 'transferencia', SUM(pagoEfectivo_venta) as 'efectivo', SUM(pagoPosnet_venta) as 'posnet' FROM ventas WHERE (fechaHora_venta BETWEEN :1 AND :2) AND estado_venta=1 AND idSucursal_venta=:3");
$ObtenerTotales -> bindParam(':1',$fechaIni);
$ObtenerTotales -> bindParam(':2',$fechaFin);
$ObtenerTotales -> bindParam(':3',$idSucursal);
$ObtenerTotales -> execute();

$result = $ObtenerTotales->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));


?>