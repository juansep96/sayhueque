<?php

require_once "../PDO.php";

$conn=$conexion;
$fecha = $_GET['fecha'];
$fechaHasta = $_GET['fechaHasta'];
$sucursal  = $_GET["idSucursal"];

switch ($sucursal) {
    case 1:
        $punto_de_venta = 6;
    break;
    case 2:
        $punto_de_venta = 6;
    break;
    case 3:
        $punto_de_venta = 6;
    break;
    case 5:
        $punto_de_venta = 7;
    break;
}

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
    $searchQuery = " AND (id_factura LIKE :name) ";
    $searchArray = array(
        'name'=>"%$searchValue%"
   );
}

## Total number of records without filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM facturas WHERE (fecha_factura BETWEEN '$fecha' AND '$fechaHasta') AND PDV_factura='$punto_de_venta' ");
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM facturas WHERE 1 ".$searchQuery ." AND (fecha_factura BETWEEN '$fecha' AND '$fechaHasta') AND PDV_factura='$punto_de_venta' ");
$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records
$stmt = $conn->prepare("SELECT * FROM facturas left join tcomprobante ON codigo_tComprobante = tipo_factura LEFT JOIN ventas ON id_factura=idFactura_venta LEFT JOIN users ON id_user=idUsuario_venta WHERE 1 ".$searchQuery."  AND (fecha_factura BETWEEN '$fecha' AND '$fechaHasta') AND PDV_factura='$punto_de_venta' LIMIT :limit,:offset");

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
  $fecha = date('d/m/Y',strtotime($row['fecha_factura']));
  $vencimiento = date('d/m/Y',strtotime($row['fechaVencimiento_factura']));
  $idVenta = $row['id_venta'];
  $acciones = '<div class="d-flex align-items-center gap-3 fs-6">';
  if($row['tipo_factura']==1){
   $acciones = $acciones . '<a href="javascript:;" onclick="ImprimirVentaA('.$idVenta.')" class="text-success" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Imprimir Venta" aria-label="Imprimir"><i class="bx bx-printer"></i></a>';
  }
  if($row['tipo_factura']==6){
   $acciones = $acciones . '<a href="javascript:;" onclick="ImprimirVentaB('.$idVenta.')" class="text-success" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Imprimir Venta" aria-label="Imprimir"><i class="bx bx-printer"></i></a>';
}
  $acciones=$acciones ."</div>";

   $data[] = array(
      "fecha_factura"=>$fecha,
      "name_user"=>strtoupper($row['name_user']),
      "tipo_factura"=>strtoupper($row['nombre_tComprobante']),
      "numero_factura"=>str_pad($row['PDV_factura'], 5, "0", STR_PAD_LEFT)."-".str_pad($row['numero_factura'], 8, "0", STR_PAD_LEFT),
      "cae_factura"=>$row['CAE_factura'],
      "vto_factura"=>$vencimiento,
      "monto_factura"=>"$ ".$row['importe_factura'],
      "acciones_factura"=>$acciones
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