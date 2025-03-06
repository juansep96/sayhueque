<?php

require_once('../PDO.php');

$idEgreso = $_POST['idEgreso'];

$EliminarEgreso = $conexion -> prepare("UPDATE egresos SET estado_egreso=0 WHERE id_egreso=:1 ");
$EliminarEgreso -> bindParam(':1',$idEgreso);
$EliminarEgreso -> execute();

$result = $EliminarEgreso->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>

