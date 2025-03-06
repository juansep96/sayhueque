<?php

require_once "../PDO.php";

include './../../AFIP/Afip.php';

$idVenta = $_POST['idVenta'];

$ObtenerVenta = $conexion -> prepare('SELECT * from ventas left join facturas ON idFactura_venta = id_factura WHERE id_venta=:1');
$ObtenerVenta -> bindParam(':1',$idVenta);
$ObtenerVenta -> execute();

foreach($ObtenerVenta as $Venta){
  $idSucursal = $Venta['idSucursal_venta'];
  $punto_factura_asociada = $Venta['PDV_factura'];
  $numero_factura_asociada = $Venta['numero_factura'];
  $tipo_factura_asociada = $Venta['tipo_factura'];
   $monto_factura = $Venta['importe_factura'];
}


$EliminarVenta = $conexion -> prepare("UPDATE ventas SET estado_venta=0 WHERE id_venta=:1");
$EliminarVenta -> bindParam(':1',$idVenta);
$EliminarVenta -> execute();

$ObtenerItems = $conexion -> prepare("SELECT * from ventaDetalle WHERE idVenta_ventaDetalle=:1");
$ObtenerItems -> bindParam(':1',$idVenta);
$ObtenerItems -> execute();

foreach($ObtenerItems as $item){
  $cantidad = $item['cantidad_ventaDetalle'];
  $idProducto = $item['idProducto_ventaDetalle'];
  $stock_a_sumar = 'stock_'.$idSucursal.'_producto';
  $AumentarStock = $conexion -> query ("UPDATE productos SET $stock_a_sumar=$stock_a_sumar+'$cantidad' WHERE id_producto='$idProducto'");
}

//Ahora tenemos que generar la NCB 


$afip = new Afip(array('CUIT' => 30712386270 ,
'production' => TRUE));
$punto_de_venta = 6;
$tipo_de_nota = 8; // 8 = Nota de Crédito B
$last_voucher = $afip->ElectronicBilling->GetLastVoucher($punto_de_venta, $tipo_de_nota);
$concepto = 1;
$tipo_de_documento = 99;
$numero_de_documento = 0;
$numero_de_nota = $last_voucher+1;
$fecha = date('Y-m-d');
$importe_gravado = floatval($monto_factura) / 1.21;
$importe_gravado = number_format($importe_gravado, 2, '.', '');
$importe_exento_iva = 0;
$importe_iva = floatval($monto_factura) - floatval($importe_gravado);
$importe_iva = number_format($importe_iva, 2, '.', '');


$fecha_servicio_desde = null;
$fecha_servicio_hasta = null;
$fecha_vencimiento_pago = null;

$data = array(
	'CantReg' 	=> 1, // Cantidad de Notas de Crédito a registrar
	'PtoVta' 	=> $punto_de_venta,
	'CbteTipo' 	=> $tipo_de_nota, 
	'Concepto' 	=> $concepto,
	'DocTipo' 	=> $tipo_de_documento,
	'DocNro' 	=> $numero_de_documento,
	'CbteDesde' => $numero_de_nota,
	'CbteHasta' => $numero_de_nota,
	'CbteFch' 	=> intval(str_replace('-', '', $fecha)),
	'FchServDesde'  => $fecha_servicio_desde,
	'FchServHasta'  => $fecha_servicio_hasta,
	'FchVtoPago'    => $fecha_vencimiento_pago,
	'ImpTotal' 	=> $importe_gravado + $importe_iva + $importe_exento_iva,
	'ImpTotConc'=> 0, // Importe neto no gravado
	'ImpNeto' 	=> $importe_gravado,
	'ImpOpEx' 	=> $importe_exento_iva,
	'ImpIVA' 	=> $importe_iva,
	'ImpTrib' 	=> 0, //Importe total de tributos
	'MonId' 	=> 'PES', //Tipo de moneda usada en la Nota de Crédito ('PES' = pesos argentinos) 
	'MonCotiz' 	=> 1, // Cotización de la moneda usada (1 para pesos argentinos)  
	'CbtesAsoc' => array( //Factura asociada
		array(
			'Tipo' 		=> $tipo_factura_asociada,
			'PtoVta' 	=> $punto_factura_asociada,
			'Nro' 		=> $numero_factura_asociada,
		)
	),
	'Iva' 		=> array(// Alícuotas asociadas a la Nota de Crédito
		array(
			'Id' 		=> 5, // Id del tipo de IVA (5 = 21%)
			'BaseImp' 	=> $importe_gravado,
			'Importe' 	=> $importe_iva 
		)
	), 
);

/** 
 * Creamos la Nota de Crédito 
 **/
$res = $afip->ElectronicBilling->CreateVoucher($data);
$cae=$res['CAE'];
$vencimiento=$res['CAEFchVto'];

 if(isset($cae) && $cae!=''){ //Se facturó
	$InsertarComprobante = $conexion ->prepare ("INSERT INTO facturas (importe_factura,fecha_factura,CAE_factura,fechaVencimiento_factura,PDV_factura,numero_factura,tipo_factura) VALUES (:1,:2,:3,:4,:5,:6,:7)");
	$InsertarComprobante -> bindParam(':1',$monto_factura);
	$InsertarComprobante -> bindParam(':2',$fecha);
	$InsertarComprobante -> bindParam(':3',$cae);
	$InsertarComprobante -> bindParam(':4',$vencimiento);
	$InsertarComprobante -> bindParam(':5',$punto_de_venta);
	$InsertarComprobante -> bindParam(':6',$numero_de_nota);
	$InsertarComprobante -> bindParam(':7',$tipo_de_nota);
	$InsertarComprobante -> execute();
}else{ //Error al facturar
	$res = [
		'success' => false,
	];
}

?>
