<?php

require_once "../PDO.php";

$desde=$_POST['desde'];
$hasta=$_POST['hasta'];


$desde_menos_1 = date('Y-m-d',strtotime('-1 months', strtotime($desde)));
$hasta_menos_1 = date('Y-m-d',strtotime('-1 months', strtotime($hasta)));

$desde_menos_2 = date('Y-m-d',strtotime('-2 months', strtotime($desde)));
$hasta_menos_2 = date('Y-m-d',strtotime('-2 months', strtotime($hasta)));



$ObtenerTotalCompras = $conexion -> prepare("SELECT SUM(total_ingCompro) as compras from ingresoComprobantes WHERE (fecha_ingCompro BETWEEN :1 AND :2) AND (estado_ingCompro=1)");
$ObtenerTotalCompras -> bindParam(':1',$desde);
$ObtenerTotalCompras -> bindParam(':2',$hasta);
$ObtenerTotalCompras -> execute();

foreach($ObtenerTotalCompras as $row){
    $compras = floatval($row['compras']);
    $compras = number_format($compras, 2, '.', '');
}

$ObtenerTotalCompras_Menos_1 = $conexion -> prepare("SELECT SUM(total_ingCompro) as compras from ingresoComprobantes WHERE (fecha_ingCompro BETWEEN :1 AND :2) AND (estado_ingCompro=1)");
$ObtenerTotalCompras_Menos_1 -> bindParam(':1',$desde_menos_1);
$ObtenerTotalCompras_Menos_1 -> bindParam(':2',$hasta_menos_1);
$ObtenerTotalCompras_Menos_1 -> execute();

foreach($ObtenerTotalCompras_Menos_1 as $row){
    $compras_Menos_1 = floatval($row['compras']);
    $compras_Menos_1 = number_format($compras_Menos_1, 2, '.', '');
}

$ObtenerTotalCompras_Menos_2 = $conexion -> prepare("SELECT SUM(total_ingCompro) as compras from ingresoComprobantes WHERE (fecha_ingCompro BETWEEN :1 AND :2) AND (estado_ingCompro=1)");
$ObtenerTotalCompras_Menos_2 -> bindParam(':1',$desde_menos_2);
$ObtenerTotalCompras_Menos_2 -> bindParam(':2',$hasta_menos_2);
$ObtenerTotalCompras_Menos_2 -> execute();

foreach($ObtenerTotalCompras_Menos_2 as $row){
    $compras_Menos_2 = floatval($row['compras']);
    $compras_Menos_2 = number_format($compras_Menos_2, 2, '.', '');
}



$crecimiento = (($compras - $compras_Menos_1) / $compras_Menos_1) * 100;
if($crecimiento == 'inf'){
    $crecimiento = 0;
}
$crecimiento = number_format($crecimiento, 2, '.', '');


$response = [
    'compras' => $compras,
    'compras_menos_1' =>  $compras_Menos_1,
    'compras_menos_2' =>  $compras_Menos_2,
    'crecimiento' =>  $crecimiento
];

echo(json_encode($response));

?>
