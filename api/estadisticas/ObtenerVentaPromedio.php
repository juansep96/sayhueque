<?php

require_once "../PDO.php";

$desde=$_POST['desde'].' 00:00:00';
$hasta=$_POST['hasta'].' 23:59:59';
$idSucursal = $_POST['idSucursal'];


$desde_menos_1 = date('Y-m-d H:i:s',strtotime('-1 months', strtotime($desde)));
$hasta_menos_1 = date('Y-m-d H:i:s',strtotime('-1 months', strtotime($hasta)));

$desde_menos_2 = date('Y-m-d H:i:s',strtotime('-2 months', strtotime($desde)));
$hasta_menos_2 = date('Y-m-d H:i:s',strtotime('-2 months', strtotime($hasta)));



$ObtenerMontoPromedio = $conexion -> prepare("SELECT AVG(totalVenta_venta) as monto_promedio from ventas WHERE (fechaHora_venta BETWEEN :1 AND :2) AND (estado_venta=1) AND (idSucursal_venta=:3)");
$ObtenerMontoPromedio -> bindParam(':1',$desde);
$ObtenerMontoPromedio -> bindParam(':2',$hasta);
$ObtenerMontoPromedio -> bindParam(':3',$idSucursal);
$ObtenerMontoPromedio -> execute();

foreach($ObtenerMontoPromedio as $MontoPromedio){
    $monto_promedio = floatval($MontoPromedio['monto_promedio']);
    $monto_promedio = number_format($monto_promedio, 2, '.', '');
}

$ObtenerMontoPromedio_Menos_1 = $conexion -> prepare("SELECT AVG(totalVenta_venta) as monto_promedio from ventas WHERE (fechaHora_venta BETWEEN :1 AND :2) AND (estado_venta=1) AND (idSucursal_venta=:3)");
$ObtenerMontoPromedio_Menos_1 -> bindParam(':1',$desde_menos_1);
$ObtenerMontoPromedio_Menos_1 -> bindParam(':2',$hasta_menos_1);
$ObtenerMontoPromedio_Menos_1 -> bindParam(':3',$idSucursal);
$ObtenerMontoPromedio_Menos_1 -> execute();

foreach($ObtenerMontoPromedio_Menos_1 as $MontoPromedio_Menos_1){
    $monto_promedio_Menos_1 = floatval($MontoPromedio_Menos_1['monto_promedio']);
    $monto_promedio_Menos_1 = number_format($monto_promedio_Menos_1, 2, '.', '');
}

$ObtenerMontoPromedio_Menos_2 = $conexion -> prepare("SELECT AVG(totalVenta_venta) as monto_promedio from ventas WHERE (fechaHora_venta BETWEEN :1 AND :2) AND (estado_venta=1) AND (idSucursal_venta=:3)");
$ObtenerMontoPromedio_Menos_2 -> bindParam(':1',$desde_menos_2);
$ObtenerMontoPromedio_Menos_2 -> bindParam(':2',$hasta_menos_2);
$ObtenerMontoPromedio_Menos_2 -> bindParam(':3',$idSucursal);
$ObtenerMontoPromedio_Menos_2 -> execute();

foreach($ObtenerMontoPromedio_Menos_2 as $MontoPromedio_Menos_2){
    $monto_promedio_Menos_2 = floatval($MontoPromedio_Menos_2['monto_promedio']);
    $monto_promedio_Menos_2 = number_format($monto_promedio_Menos_2, 2, '.', '');
}

$crecimiento = (($monto_promedio - $monto_promedio_Menos_1) / $monto_promedio_Menos_1) * 100;
if($crecimiento == 'inf'){
    $crecimiento = 0;
}
$crecimiento = number_format($crecimiento, 2, '.', '');


$response = [
    'monto_promedio' => $monto_promedio,
    'monto_promedio_menos_1' =>  $monto_promedio_Menos_1,
    'monto_promedio_menos_2' =>  $monto_promedio_Menos_2,
    'crecimiento' =>  $crecimiento
];

echo(json_encode($response));

?>
