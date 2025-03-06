<?php

require_once "../PDO.php";

$desde=$_POST['desde'];
$hasta=$_POST['hasta'];

$ObtenerComprasBlanco = $conexion -> prepare("SELECT SUM(total_ingCompro) as blanco from ingresoComprobantes WHERE (fecha_ingCompro BETWEEN :1 AND :2) AND (estado_ingCompro=1) AND (tCompro_ingCompro='FACTURA')");
$ObtenerComprasBlanco -> bindParam(':1',$desde);
$ObtenerComprasBlanco -> bindParam(':2',$hasta);
$ObtenerComprasBlanco -> execute();

foreach($ObtenerComprasBlanco as $row){
    $blanco = floatval($row['blanco']);
    $blanco = number_format($blanco, 2, '.', '');
}

$response = [
    'blanco' => $blanco,
];

echo(json_encode($response));

?>
