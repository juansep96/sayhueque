<?php

require_once "../PDO.php";

$idEgreso=$_POST['idEgreso'];

$ObtenerEgreso = $conexion -> prepare("SELECT * from egresos WHERE id_egreso=:1");
$ObtenerEgreso -> bindParam(':1',$idEgreso);
$ObtenerEgreso -> execute();

$result = $ObtenerEgreso->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
