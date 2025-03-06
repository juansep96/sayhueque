<?php

require_once "../PDO.php";

$desde=$_POST['desde'].' 00:00:00';
$hasta=$_POST['hasta'].' 23:59:59';
$idSucursal = $_POST['idSucursal'];


$desde_menos_1 = date('Y-m-d H:i:s',strtotime('-1 months', strtotime($desde)));
$hasta_menos_1 = date('Y-m-d H:i:s',strtotime('-1 months', strtotime($hasta)));

$desde_menos_2 = date('Y-m-d H:i:s',strtotime('-2 months', strtotime($desde)));
$hasta_menos_2 = date('Y-m-d H:i:s',strtotime('-2 months', strtotime($hasta)));



$ObtenerMontoBlanco = $conexion -> prepare("SELECT SUM(totalVenta_venta) as monto_blanco from ventas WHERE (fechaHora_venta BETWEEN :1 AND :2) AND (estado_venta=1) AND (idFactura_venta>0) AND idSucursal_venta=:3");
$ObtenerMontoBlanco -> bindParam(':1',$desde);
$ObtenerMontoBlanco -> bindParam(':2',$hasta);
$ObtenerMontoBlanco -> bindParam(':3',$idSucursal);
$ObtenerMontoBlanco -> execute();

foreach($ObtenerMontoBlanco as $row){
    $monto_blanco = floatval($row['monto_blanco']);
    $monto_blanco = number_format($monto_blanco, 2, '.', '');
}

$ObtenerMontoBlanco_Menos_1 = $conexion -> prepare("SELECT SUM(totalVenta_venta) as monto_blanco from ventas WHERE (fechaHora_venta BETWEEN :1 AND :2) AND (estado_venta=1) AND (idFactura_venta>0) AND idSucursal_venta=:3");
$ObtenerMontoBlanco_Menos_1 -> bindParam(':1',$desde_menos_1);
$ObtenerMontoBlanco_Menos_1 -> bindParam(':2',$hasta_menos_1);
$ObtenerMontoBlanco_Menos_1 -> bindParam(':3',$idSucursal);
$ObtenerMontoBlanco_Menos_1 -> execute();

foreach($ObtenerMontoBlanco_Menos_1 as $row){
    $monto_blanco_Menos_1 = floatval($row['monto_blanco']);
    $monto_blanco_Menos_1 = number_format($monto_blanco_Menos_1, 2, '.', '');
}

$ObtenerMontoBlanco_Menos_2 = $conexion -> prepare("SELECT SUM(totalVenta_venta) as monto_blanco from ventas WHERE (fechaHora_venta BETWEEN :1 AND :2) AND (estado_venta=1) AND (idFactura_venta>0) AND idSucursal_venta=:3");
$ObtenerMontoBlanco_Menos_2 -> bindParam(':1',$desde_menos_2);
$ObtenerMontoBlanco_Menos_2 -> bindParam(':2',$hasta_menos_2);
$ObtenerMontoBlanco_Menos_2 -> bindParam(':3',$idSucursal);
$ObtenerMontoBlanco_Menos_2 -> execute();

foreach($ObtenerMontoBlanco_Menos_2 as $row){
    $monto_blanco_Menos_2 = floatval($row['monto_blanco']);
    $monto_blanco_Menos_2 = number_format($monto_blanco_Menos_2, 2, '.', '');
}



$crecimiento = (($monto_blanco - $monto_blanco_Menos_1) / $monto_blanco_Menos_1) * 100;
if($crecimiento == 'inf'){
    $crecimiento = 0;
}
$crecimiento = number_format($crecimiento, 2, '.', '');


$response = [
    'monto_blanco' => $monto_blanco,
    'monto_blanco_menos_1' =>  $monto_blanco_Menos_1,
    'monto_blanco_menos_2' =>  $monto_blanco_Menos_2,
    'crecimiento' =>  $crecimiento
];

echo(json_encode($response));

?>
