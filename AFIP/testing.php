<?php

include "./afip.php";

$afip = new Afip(array(
	'CUIT' => "XXXXXX"
));
/**
 * Numero del punto de venta
 **/
$punto_de_venta = 4;

/**
 * Tipo de comprobante
 **/
$tipo_de_comprobante = 11; // 11 = Factura C

/**
 * Número de la ultima Factura C
 **/
$ultima_factura_C = $afip->ElectronicBilling->GetLastVoucher($punto_de_venta, $tipo_de_comprobante);

/**
 * Mostramos por pantalla el número de la ultima Factura C
 **/
var_dump($ultima_factura_C);
?>
