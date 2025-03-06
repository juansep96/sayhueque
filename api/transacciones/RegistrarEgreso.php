<?php

require_once('../PDO.php');

$cuando = date("Y-m-d H:i:s");

$idUsuario = $_SESSION['idUser'];

$datos=$_POST['datos'];
$datos=json_decode($datos);


$RegistrarEgreso=$conexion->prepare("INSERT INTO egresos (idVendedor_egreso,fechaHora_egreso,tipo_egreso,monto_egreso,obs_egreso,idSucursal_egreso) VALUES (:1,:2,:3,:4,:5,:6)");
$RegistrarEgreso->bindParam(':1',$idUsuario);
$RegistrarEgreso->bindParam(':2',$cuando);
$RegistrarEgreso->bindParam(':3',$datos[0]);
$RegistrarEgreso->bindParam(':4',$datos[1]);
$RegistrarEgreso->bindParam(':5',$datos[2]);
$RegistrarEgreso->bindParam(':6',$_SESSION['idSucursal']);
if($RegistrarEgreso->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($RegistrarEgreso->errorInfo());
}


?>
