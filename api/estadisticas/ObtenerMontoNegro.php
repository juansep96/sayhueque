<?php

require_once "../PDO.php";

$desde=$_POST['desde'].' 00:00:00';
$hasta=$_POST['hasta'].' 23:59:59';
$idSucursal = $_POST['idSucursal'];



$desde_menos_1 = date('Y-m-d H:i:s',strtotime('-1 months', strtotime($desde)));
$hasta_menos_1 = date('Y-m-d H:i:s',strtotime('-1 months', strtotime($hasta)));

$desde_menos_2 = date('Y-m-d H:i:s',strtotime('-2 months', strtotime($desde)));
$hasta_menos_2 = date('Y-m-d H:i:s',strtotime('-2 months', strtotime($hasta)));



$ObtenerMontonegro = $conexion -> prepare("SELECT SUM(totalVenta_venta) as monto_negro from ventas WHERE (fechaHora_venta BETWEEN :1 AND :2) AND (estado_venta=1) AND (idFactura_venta=-1) AND idSucursal_venta=:3");
$ObtenerMontonegro -> bindParam(':1',$desde);
$ObtenerMontonegro -> bindParam(':2',$hasta);
$ObtenerMontonegro -> bindParam(':3',$idSucursal);
$ObtenerMontonegro -> execute();

foreach($ObtenerMontonegro as $row){
    $monto_negro = floatval($row['monto_negro']);
    $monto_negro = number_format($monto_negro, 2, '.', '');
}

$ObtenerMontonegro_Menos_1 = $conexion -> prepare("SELECT SUM(totalVenta_venta) as monto_negro from ventas WHERE (fechaHora_venta BETWEEN :1 AND :2) AND (estado_venta=1) AND (idFactura_venta=-1) AND idSucursal_venta=:3");
$ObtenerMontonegro_Menos_1 -> bindParam(':1',$desde_menos_1);
$ObtenerMontonegro_Menos_1 -> bindParam(':2',$hasta_menos_1);
$ObtenerMontonegro_Menos_1 -> bindParam(':3',$idSucursal);
$ObtenerMontonegro_Menos_1 -> execute();

foreach($ObtenerMontonegro_Menos_1 as $row){
    $monto_negro_Menos_1 = floatval($row['monto_negro']);
    $monto_negro_Menos_1 = number_format($monto_negro_Menos_1, 2, '.', '');
}

$ObtenerMontonegro_Menos_2 = $conexion -> prepare("SELECT SUM(totalVenta_venta) as monto_negro from ventas WHERE (fechaHora_venta BETWEEN :1 AND :2) AND (estado_venta=1) AND (idFactura_venta=-1) AND idSucursal_venta=:3");
$ObtenerMontonegro_Menos_2 -> bindParam(':1',$desde_menos_2);
$ObtenerMontonegro_Menos_2 -> bindParam(':2',$hasta_menos_2);
$ObtenerMontonegro_Menos_2 -> bindParam(':3',$idSucursal);
$ObtenerMontonegro_Menos_2 -> execute();

foreach($ObtenerMontonegro_Menos_2 as $row){
    $monto_negro_Menos_2 = floatval($row['monto_negro']);
    $monto_negro_Menos_2 = number_format($monto_negro_Menos_2, 2, '.', '');
}



$crecimiento = (($monto_negro - $monto_negro_Menos_1) / $monto_negro_Menos_1) * 100;
if($crecimiento == 'inf'){
    $crecimiento = 0;
}
$crecimiento = number_format($crecimiento, 2, '.', '');


$response = [
    'monto_negro' => $monto_negro,
    'monto_negro_menos_1' =>  $monto_negro_Menos_1,
    'monto_negro_menos_2' =>  $monto_negro_Menos_2,
    'crecimiento' =>  $crecimiento
];

echo(json_encode($response));

?>
