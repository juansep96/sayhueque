<?php

require_once "../PDO.php";

$desde=$_POST['desde'];
$hasta=$_POST['hasta'];


$ObtenerComprasNegro = $conexion -> prepare("SELECT SUM(total_ingCompro) as negro from ingresoComprobantes WHERE (fecha_ingCompro BETWEEN :1 AND :2) AND (estado_ingCompro=1) AND (tCompro_ingCompro='REMITO')");
$ObtenerComprasNegro -> bindParam(':1',$desde);
$ObtenerComprasNegro -> bindParam(':2',$hasta);
$ObtenerComprasNegro -> execute();

foreach($ObtenerComprasNegro as $row){
    $negro = floatval($row['negro']);
    $negro = number_format($negro, 2, '.', '');
}

$response = [
    'negro' => $negro,
];

echo(json_encode($response));

?>
