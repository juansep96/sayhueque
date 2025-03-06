<?php

require_once "../PDO.php";

$fechaIni = $_GET['fecha']." 00:00:00";
$fechaFin = $_GET['fecha']." 23:59:59";
$idSucursal = $_GET['idSucursal'];
$conn=$conexion;


## Read value
$draw = $_POST['draw'];
$row = $_POST['start'];
$rowperpage = $_POST['length']; // Rows display per page
$columnIndex = $_POST['order'][0]['column']; // Column index
$columnName = $_POST['columns'][$columnIndex]['data']; // Column name
$columnSortOrder = $_POST['order'][0]['dir']; // asc or desc
$searchValue = $_POST['search']['value']; // Search value

$searchArray = array();

## Search
$searchQuery = " ";
if($searchValue != ''){
    $searchQuery = " AND (id_venta LIKE :name) ";
    $searchArray = array(
        'name'=>"%$searchValue%"
   );
}

## Total number of records without filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM egresos WHERE estado_egreso=1 AND idSucursal_egreso='$idSucursal' AND fechaHora_egreso BETWEEN '$fechaIni' AND '$fechaFin' ");
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM egresos WHERE 1 ".$searchQuery ."AND estado_egreso=1  AND idSucursal_egreso='$idSucursal' AND fechaHora_egreso BETWEEN '$fechaIni' AND '$fechaFin'");
$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records
$stmt = $conn->prepare("SELECT * FROM egresos LEFT JOIN users ON id_user=idVendedor_egreso WHERE 1 ".$searchQuery." AND estado_egreso=1 AND idSucursal_egreso='$idSucursal' AND  fechaHora_egreso BETWEEN '$fechaIni' AND '$fechaFin' ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");

// Bind values
foreach($searchArray as $key=>$search){
   $stmt->bindValue(':'.$key, $search,PDO::PARAM_STR);
}

$stmt->bindValue(':limit', (int)$row, PDO::PARAM_INT);
$stmt->bindValue(':offset', (int)$rowperpage, PDO::PARAM_INT);
$stmt->execute();
$empRecords = $stmt->fetchAll();

$data = array();

foreach($empRecords as $row){
  $idEgreso = $row['id_egreso'];
  $hora = date('H:i',strtotime($row['fechaHora_egreso']));

  $acciones = '<div class="d-flex align-items-center gap-3 fs-6"><a href="javascript:;" onclick="VerEgreso('.$idEgreso.')" class="text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Ver Egreso" aria-label="Ver"><i class="bi bi-eye-fill"></i></a>';
   
  if($row['tipo_egreso']=="DIRECTO"){
      $estado='<span class="badge bg-light-warning text-warning w-100">DIRECTO</span>';
   }else{
      $estado='<span class="badge bg-light-success text-success w-100">INDIRECTO</span>';
   }

  if($_SESSION['nombreRol']=='Administrador'){
    $acciones = $acciones . '<a href="javascript:;" onclick="EliminarEgreso('.$idEgreso.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Eliminar Egreso" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
  }
  $acciones = $acciones.'</div>';

   $data[] = array(
      "id_egreso"=>$idEgreso,
      "hora_egreso"=>$hora,
      "vendedora_egreso"=>strtoupper($row['name_user']),
      "tipo_egreso"=>$estado,
      "total_egreso" => "$ ".$row['monto_egreso'],
      "acciones_egreso"=>$acciones,
   );
}

## Response
$response = array(
   "draw" => intval($draw),
   "iTotalRecords" => $totalRecords,
   "iTotalDisplayRecords" => $totalRecordwithFilter,
   "aaData" => $data
);

echo json_encode($response);



?>