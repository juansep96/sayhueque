<?php

require_once "../PDO.php";

$desde=$_POST['desde'].' 00:00:00';
$hasta=$_POST['hasta'].' 23:59:59';
$idSucursal = $_POST['idSucursal'];

$desde_menos_1 = date('Y-m-d',strtotime('-1 months', strtotime($desde)));
$hasta_menos_1 = date('Y-m-d',strtotime('-1 months', strtotime($hasta)));

$desde_menos_2 = date('Y-m-d',strtotime('-2 months', strtotime($desde)));
$hasta_menos_2 = date('Y-m-d',strtotime('-2 months', strtotime($hasta)));



$ObtenerTotalVentas = $conexion -> prepare("SELECT SUM(totalVenta_venta) as ventas from ventas WHERE (fechaHora_venta BETWEEN :1 AND :2) AND (estado_venta=1) AND idSucursal_venta=:3");
$ObtenerTotalVentas -> bindParam(':1',$desde);
$ObtenerTotalVentas -> bindParam(':2',$hasta);
$ObtenerTotalVentas -> bindParam(':3',$idSucursal);
$ObtenerTotalVentas -> execute();

foreach($ObtenerTotalVentas as $row){
    $ventas = floatval($row['ventas']);
    $ventas = number_format($ventas, 2, '.', '');
}

$ObtenerTotalVentas_Menos_1 = $conexion -> prepare("SELECT SUM(totalVenta_venta) as ventas from ventas WHERE (fechaHora_venta BETWEEN :1 AND :2) AND (estado_venta=1) AND idSucursal_venta=:3");
$ObtenerTotalVentas_Menos_1 -> bindParam(':1',$desde_menos_1);
$ObtenerTotalVentas_Menos_1 -> bindParam(':2',$hasta_menos_1);
$ObtenerTotalVentas_Menos_1 -> bindParam(':3',$idSucursal);
$ObtenerTotalVentas_Menos_1 -> execute();

foreach($ObtenerTotalVentas_Menos_1 as $row){
    $ventas_Menos_1 = floatval($row['ventas']);
    $ventas_Menos_1 = number_format($ventas_Menos_1, 2, '.', '');
}

$ObtenerTotalVentas_Menos_2 = $conexion -> prepare("SELECT SUM(totalVenta_venta) as ventas from ventas WHERE (fechaHora_venta BETWEEN :1 AND :2) AND (estado_venta=1) AND idSucursal_venta=:3");
$ObtenerTotalVentas_Menos_2 -> bindParam(':1',$desde_menos_2);
$ObtenerTotalVentas_Menos_2 -> bindParam(':2',$hasta_menos_2);
$ObtenerTotalVentas_Menos_2 -> bindParam(':3',$idSucursal);
$ObtenerTotalVentas_Menos_2 -> execute();

foreach($ObtenerTotalVentas_Menos_2 as $row){
    $ventas_Menos_2 = floatval($row['ventas']);
    $ventas_Menos_2 = number_format($ventas_Menos_2, 2, '.', '');
}



$crecimiento = (($ventas - $ventas_Menos_1) / $ventas_Menos_1) * 100;
if($crecimiento == 'inf'){
    $crecimiento = 0;
}
$crecimiento = number_format($crecimiento, 2, '.', '');


$response = [
    'ventas' => $ventas,
    'ventas_menos_1' =>  $ventas_Menos_1,
    'ventas_menos_2' =>  $ventas_Menos_2,
    'crecimiento' =>  $crecimiento
];

echo(json_encode($response));

?>
