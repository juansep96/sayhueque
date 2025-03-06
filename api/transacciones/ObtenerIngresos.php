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
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM ventas WHERE estado_venta=1 AND idSucursal_venta = $idSucursal AND fechaHora_venta BETWEEN '$fechaIni' AND '$fechaFin'");
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM ventas WHERE estado_venta=1  AND idSucursal_venta = $idSucursal AND fechaHora_venta BETWEEN '$fechaIni' AND '$fechaFin'");
$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records
$stmt = $conn->prepare("SELECT * FROM ventas left join sucursales on id_sucursal = idSucursal_venta LEFT JOIN clientes ON idCliente_venta = id_cliente LEFT JOIN facturas ON idFactura_venta = id_factura WHERE estado_venta=1  AND idSucursal_venta = '$idSucursal' AND fechaHora_venta BETWEEN '$fechaIni' AND '$fechaFin' ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");

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
  $idVenta = $row['id_venta'];
  $hora = date('H:i',strtotime($row['fechaHora_venta']));

  $acciones = '<div class="d-flex align-items-center gap-3 fs-6"><a href="javascript:;" onclick="VerVenta('.$idVenta.')" class="text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Ver Venta" aria-label="Ver"><i class="bi bi-eye-fill"></i></a>';
  
  if($row['idFactura_venta']=='-1'){
      $acciones = $acciones . '<a href="javascript:;" onclick="ImprimirVentaB('.$idVenta.')" class="text-success" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Imprimir Venta" aria-label="Imprimir"><i class="bx bx-printer"></i></a>';
  }else{
   if($row['tipo_factura']=="1"){ // Factura A
      $acciones = $acciones . '<a href="javascript:;" onclick="ImprimirVentaA('.$idVenta.')" class="text-success" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Imprimir Venta" aria-label="Imprimir"><i class="bx bx-printer"></i></a>';
   }
   if($row['tipo_factura']=="6"){
      $acciones = $acciones . '<a href="javascript:;" onclick="ImprimirVentaB('.$idVenta.')" class="text-success" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Imprimir Venta" aria-label="Imprimir"><i class="bx bx-printer"></i></a>';
   }
  }
   
  if($row['idFactura_venta']=="-1"){
      $estado='<span class="badge bg-light-warning text-warning w-100">NO FACTURADO</span>';
   }else{
      $estado='<span class="badge bg-light-success text-success w-100">FACTURADA</span>';
   }

  if($_SESSION['nombreRol']=='Administrador'){
    if($row['idFactura_venta']=="-1"){
        $acciones = $acciones. '<a href="javascript:;" onclick="FacturarVenta('.$idVenta.')" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Facturar Venta" aria-label="Editar"><i class="bx bx-dollar"></i></a>';
        $acciones = $acciones . '<a href="javascript:;" onclick="EliminarVenta('.$idVenta.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Eliminar Venta" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
    }else{
        if($row['tipo_factura']=="6"){
            $acciones = $acciones . '<a href="javascript:;" onclick="EliminarVentaFacturada('.$idVenta.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Eliminar Venta" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
        }
    }
  }
  if($row['idCliente_venta']=='-1'){
      $row['apellido_cliente'] = 'CONSUMIDOR';
      $row['nombre_cliente'] = 'FINAL';
  }
  $acciones = $acciones.'</div>';

  $items = $conn -> prepare("SELECT * FROM ventaDetalle left join productos ON id_producto = idProducto_ventaDetalle WHERE idVenta_ventaDetalle = :1 LIMIT 1");
  $items -> bindParam(':1',$idVenta);
  $items -> execute();

  foreach($items as $item){
    $item['nombre_producto'] = eliminar_acentos($item['nombre_producto']);
    $first_product = substr($item['nombre_producto'],0,15);
  }
  

   $data[] = array(
      "id_venta"=>$idVenta,
      "hora_venta"=>$hora,
      "total_venta"=>'$ '.number_format(floatval($row['totalVenta_venta']),2,'.',''),
      "facturado_venta"=>$estado,
      "sucursal_venta" => strtoupper($row['nombre_sucursal']),
      "producto_venta"=>$first_product,
      "acciones_venta"=>$acciones,
   );
}

## Response
$response = array(
   "draw" => intval($draw),
   "iTotalRecords" => $totalRecords,
   "iTotalDisplayRecords" => $totalRecordwithFilter,
   "aaData" => $data
);

function eliminar_acentos($cadena){
		
    //Reemplazamos la A y a
    $cadena = str_replace(
    array('Á', 'À', 'Â', 'Ä', 'á', 'à', 'ä', 'â', 'ª'),
    array('A', 'A', 'A', 'A', 'a', 'a', 'a', 'a', 'a'),
    $cadena
    );

    //Reemplazamos la E y e
    $cadena = str_replace(
    array('É', 'È', 'Ê', 'Ë', 'é', 'è', 'ë', 'ê'),
    array('E', 'E', 'E', 'E', 'e', 'e', 'e', 'e'),
    $cadena );

    //Reemplazamos la I y i
    $cadena = str_replace(
    array('Í', 'Ì', 'Ï', 'Î', 'í', 'ì', 'ï', 'î'),
    array('I', 'I', 'I', 'I', 'i', 'i', 'i', 'i'),
    $cadena );

    //Reemplazamos la O y o
    $cadena = str_replace(
    array('Ó', 'Ò', 'Ö', 'Ô', 'ó', 'ò', 'ö', 'ô'),
    array('O', 'O', 'O', 'O', 'o', 'o', 'o', 'o'),
    $cadena );

    //Reemplazamos la U y u
    $cadena = str_replace(
    array('Ú', 'Ù', 'Û', 'Ü', 'ú', 'ù', 'ü', 'û'),
    array('U', 'U', 'U', 'U', 'u', 'u', 'u', 'u'),
    $cadena );

    //Reemplazamos la N, n, C y c
    $cadena = str_replace(
    array('Ñ', 'ñ', 'Ç', 'ç'),
    array('N', 'n', 'C', 'c'),
    $cadena
    );
    
    return $cadena;
}

echo json_encode($response);



?>