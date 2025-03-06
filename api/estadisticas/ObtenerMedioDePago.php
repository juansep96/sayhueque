<?php

require_once "../PDO.php";

$desde=$_POST['desde'].' 00:00:00';
$hasta=$_POST['hasta'].' 23:59:59';
$idSucursal = $_POST['idSucursal'];

$ObtenerPorMedioDePago = $conexion -> prepare("SELECT SUM(pagoEfectivo_venta) as efectivo,SUM(pagoTransferencia_venta) as transferencia,SUM(pagoPosnet_venta) as posnet from ventas WHERE (fechaHora_venta BETWEEN :1 AND :2) AND (estado_venta=1) AND idSucursal_venta=:3");
$ObtenerPorMedioDePago -> bindParam(':1',$desde);
$ObtenerPorMedioDePago -> bindParam(':2',$hasta);
$ObtenerPorMedioDePago -> bindParam(':3',$idSucursal);
$ObtenerPorMedioDePago -> execute();

foreach($ObtenerPorMedioDePago as $row){
    $efectivo = floatval($row['efectivo']);
    $efectivo = number_format($efectivo, 2, '.', '');
    $transferencia = floatval($row['transferencia']);
    $transferencia = number_format($transferencia, 2, '.', '');
    $posnet = floatval($row['posnet']);
    $posnet = number_format($posnet, 2, '.', '');
}

$response = [
    'efectivo' => $efectivo,
    'posnet' =>  $posnet,
    'transferencia' =>  $transferencia,
];

echo(json_encode($response));

?>
