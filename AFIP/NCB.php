<?php

include './Afip.php';

require_once './../api/PDO.php';

$afip = new Afip(array('CUIT' => XXXXXX ,
'production' => TRUE));


/**
 * Numero del punto de venta
 **/
$punto_de_venta = 6;

/**
 * Tipo de Nota de Crédito
 **/
$tipo_de_nota = 8; // 8 = Nota de Crédito B

/**
 * Número de la ultima Nota de Crédito B
 **/
$last_voucher = $afip->ElectronicBilling->GetLastVoucher($punto_de_venta, $tipo_de_nota);

/**
 * Numero del punto de venta de la Factura 
 * asociada a la Nota de Crédito
 **/
$punto_factura_asociada = 6;

/**
 * Tipo de Factura asociada a la Nota de Crédito
 **/
$tipo_factura_asociada = 6; // 6 = Factura B

/**
 * Numero de Factura asociada a la Nota de Crédito
 **/
$numero_factura_asociada = 2669;

/**
 * Concepto de la Nota de Crédito
 *
 * Opciones:
 *
 * 1 = Productos 
 * 2 = Servicios 
 * 3 = Productos y Servicios
 **/
$concepto = 1;

/**
 * Tipo de documento del comprador
 *
 * Opciones:
 *
 * 80 = CUIT 
 * 86 = CUIL 
 * 96 = DNI
 * 99 = Consumidor Final 
 **/
$tipo_de_documento = 99;

/**
 * Numero de documento del comprador (0 para consumidor final)
 **/
$numero_de_documento = 0;

/**
 * Numero de Nota de Crédito
 **/
$numero_de_nota = $last_voucher+1;

/**
 * Fecha de la Nota de Crédito en formato aaaa-mm-dd (hasta 10 dias antes y 10 dias despues)
 **/
$fecha = date('Y-m-d');

/**
 * Importe sujeto al IVA (sin icluir IVA)
 **/
$importe_gravado = 16561.98;

/**
 * Importe exento al IVA
 **/
$importe_exento_iva = 0;

/**
 * Importe de IVA
 **/
$importe_iva = 3478.02;

/**
 * Los siguientes campos solo son obligatorios para los conceptos 2 y 3
 **/
if ($concepto === 2 || $concepto === 3) {
	/**
	 * Fecha de inicio de servicio en formato aaaammdd
	 **/
	$fecha_servicio_desde = intval(date('Ymd'));

	/**
	 * Fecha de fin de servicio en formato aaaammdd
	 **/
	$fecha_servicio_hasta = intval(date('Ymd'));

	/**
	 * Fecha de vencimiento del pago en formato aaaammdd
	 **/
	$fecha_vencimiento_pago = intval(date('Ymd'));
}
else {
	$fecha_servicio_desde = null;
	$fecha_servicio_hasta = null;
	$fecha_vencimiento_pago = null;
}


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

/**
 * Mostramos por pantalla los datos de la nueva Nota de Crédito 
 **/
var_dump(array(
	'cae' => $res['CAE'], //CAE asignado a la Nota de Crédito
	'vencimiento' => $res['CAEFchVto'] //Fecha de vencimiento del CAE
));
