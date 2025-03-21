<?php



require_once '../PDO.php';

include_once ('./neopdf/visor.php');

ob_start();

$idVenta = $_GET['idVenta'];
$qr="no";
$items = [];
$ivas=[];
$total_iva_10=0;
$total_iva_21=0;
$total_iva_27=0;
$total_iva=0;
$total_iva_0=0;
$baseImp_0=0;
$baseImp_21=0;
$baseImp_10=0;
$baseImp_27=0;
$saldoCC = 0.00;

$ObtenerCAE = $conexion -> prepare("SELECT * FROM ventas left join facturas ON id_factura = idFactura_venta WHERE id_venta=:1");
$ObtenerCAE -> bindParam(':1',$idVenta);
$ObtenerCAE -> execute();
foreach($ObtenerCAE as $row){
    $cae = $row['CAE_factura'];
}

$ObtenerItems = $conexion -> prepare("SELECT * FROM ventaDetalle LEFT JOIN productos ON idProducto_ventaDetalle = id_producto WHERE idVenta_ventaDetalle=:1");
$ObtenerItems -> bindParam(':1',$idVenta);
$ObtenerItems -> execute();

foreach($ObtenerItems as $row){

        $importeIVA =  (($row['cantidad_ventaDetalle']*floatval($row['precioVenta_ventaDetalle']) * $row['iva_producto'])/100);
        $importeItem = $row['cantidad_ventaDetalle']*floatval($row['precioVenta_ventaDetalle']) + $importeIVA;
        $importeUnitario = (floatval($row['precioVenta_ventaDetalle']) * $row['iva_producto'])/100;
        $importeUnitario = $importeUnitario + floatval($row['precioVenta_ventaDetalle']);
        $alicuota = $row['iva_producto'];
        if($alicuota==10){
            $importeIVA =  (($row['cantidad_ventaDetalle']*floatval($row['precioVenta_ventaDetalle']) * 10.5)/100);
            $importeItem = $row['cantidad_ventaDetalle']*floatval($row['precioVenta_ventaDetalle']) + $importeIVA;
            $alicuota=10.5;
            $total_iva_10=$total_iva_10+$importeIVA;
            $baseImp_10 = $baseImp_10 + floatval($row['precioVenta_ventaDetalle']);
            $codigoIVA = 4;
        }
        if($alicuota==21){
            $total_iva_21=$total_iva_21+$importeIVA;
            $baseImp_21 = $baseImp_21 + floatval($row['precioVenta_ventaDetalle']);
            $codigoIVA = 5;
        }
        if($alicuota==27){
            $total_iva_27=$total_iva_27+$importeIVA;
            $baseImp_27 = $baseImp_27 + floatval($row['precioVenta_ventaDetalle']);
            $codigoIVA = 6;
        }
        if($alicuota==0){
            $total_iva_0=$total_iva_0+$importeIVA;
            $baseImp_0 = $baseImp_0 + floatval($row['precioVenta_ventaDetalle']);
            $codigoIVA = 3;
        }
        $total_iva=$total_iva+$importeIVA;
    $item = Array
    (
        "codigo" => $row['codigo_producto'],
        "scanner" => $row['codigo_producto'],
        "detalle" => strtoupper($row['nombre_producto']),
        "codigoUnidadMedida" => 7,
        "UnidadMedida" => 'Unidad',
        "codigoCondicionIVA" => 5,
        "Alic" => $alicuota,
        "cantidad" => $row['cantidad_ventaDetalle'],
        "porcBonif" => 0.000,
        "impBonif" => 0.000,
        "precio" => $importeUnitario,
        "importeIVA" => $importeIVA,
        "calc_total" => $importeItem,
    );
    array_push($items,$item);
}

$ObtenerDatosVenta = $conexion -> prepare("SELECT * FROM ventas LEFT JOIN clientes ON id_cliente=idCliente_venta left join tresponsables ON tResponsable_cliente = id_tresponsable left join facturas ON idFactura_venta = id_factura LEFT JOIN tcomprobante ON codigo_tComprobante = tipo_factura left join ciudades ON idCiudad_cliente =  id_ciudades left join provincias ON id_provincia = idProvincia_ciudades WHERE id_venta=:1");
$ObtenerDatosVenta -> bindParam(':1',$idVenta);
$ObtenerDatosVenta -> execute();
foreach($ObtenerDatosVenta as $row){
    $idCliente = $row['id_cliente'];
    $compobante_numero = $row['numero_factura'];
    $comprobante_pventa = $row['PDV_factura'];
    $cae = $row['CAE_factura'];
    $letraFactura = $row['letra_tComprobante'];
    $fechaVencimientoCAE = $row['fechaVencimiento_factura'];
    $tipoResponsable = $row['nombre_tresponsable'];
    $cliente_razon = strtoupper($row['razon_cliente']);
    $cliente_dir = strtoupper($row['ciudad']) . ', ' . strtoupper($row['provincia']);
    $fecha = $row['fechaHora_venta'];
    $fecha = explode(" ",$fecha);
    $fecha = str_replace("-","",$fecha[0]);
    $codigoTipoComprobante = "00".$row['codigo_tComprobante'];
    $tipoComprobante = $row['nombre_tComprobante'];
    $codigotipodocumento = 80;
    $tipoDocumento = "CUIT";
    $numeroDocumento = $row['cuit_cliente'];
    $condicionVenta = "CONTADO";
    $total_factura_iva=floatval($row['totalVenta_venta']);
    $total_factura = $row['totalSinIVA_venta'];
    $total_iva=$total_iva;
    if($cae==0){
        $qr="no";
    }
}

$ObtenerSaldoCC=$conexion -> prepare("SELECT SUM(total_cc) as saldo FROM cc WHERE idCliente_cc=:1 AND estado_cc=1");
$ObtenerSaldoCC -> bindParam(':1',$idCliente);
$ObtenerSaldoCC -> execute();
foreach($ObtenerSaldoCC as $Saldo){
    $saldoCC = floatval($Saldo['saldo']);
}


if($total_iva_10!=0){
    $iva = Array
            (
                "codigo" => 4,
                "Alic" => 10.5,
                "Importe" => $total_iva_10,
                "BaseImp" => $baseImp_10,

            );
    array_push($ivas,$iva);
}

if($total_iva_21!=0){
    $iva = Array
            (
                "codigo" => 5,
                "Alic" => 21,
                "Importe" => $total_iva_21,
                "BaseImp" => $baseImp_21,

            );
    array_push($ivas,$iva);
}

if($total_iva_27!=0){
    $iva = Array
            (
                "codigo" => 6,
                "Alic" => 27,
                "Importe" => $total_iva_27,
                "BaseImp" => $baseImp_27,

            );
    array_push($ivas,$iva);
}

$config = [
    "TRADE_SOCIAL_REASON"=> "SAYHUEQUE SH",
    "TRADE_CUIT"=> "30-71238627-0",
    "TRADE_ADDRESS"=> "SARMIENTO 2153 LOCAL 197",
    "TRADE_TAX_CONDITION"=> "RESPONSABLE INSCRIPTO",
    "TRADE_INIT_ACTIVITY"=> "20170401",
    "TRADE_IIBB"=>"30-71238627-0",
    "VOUCHER_OBSERVATION"=>"",
];

$voucher = Array
(
    "idVoucher" => $idVenta,
    "numeroComprobante" => $compobante_numero,
    "numeroPuntoVenta" => $comprobante_pventa,
    "cae" => $cae,
    "letra" => $letraFactura,
    "fechaVencimientoCAE" => $fechaVencimientoCAE,
    "tipoResponsable" => $tipoResponsable,
    "nombreCliente" =>  $cliente_razon,
    "domicilioCliente" => $cliente_dir,
    "fechaComprobante" => $fecha,
    "codigoTipoComprobante" => $codigoTipoComprobante,
    "TipoComprobante" => $tipoComprobante,
    "codigoConcepto" => 1, // 1 productos -2 servicios
    "codigoMoneda" => "PES",
    "cotizacionMoneda" => 1.000,
    "fechaDesde" => $fecha,//20190303,
    "fechaHasta" => $fecha,//20190303,
    "fechaVtoPago" => $fecha,//20190303,
    "codigoTipoDocumento" => $codigotipodocumento,
    "TipoDocumento" => $tipoDocumento,
    "numeroDocumento" => $numeroDocumento,
    "importeTotal" => $total_factura_iva,//121.000,
    "importeOtrosTributos" => 0.000,
    "importeGravado" => $total_factura,//100.000,
    "importeNoGravado" => 0.000,
    "importeExento" => 0.000,
    "importeIVA" => $total_iva,//21.000,
    "codigoPais" => 200,
    "idiomaComprobante" => 1,
    "NroRemito" => 0,
    "CondicionVenta" => $condicionVenta,
    "items" => $items,
    "subtotivas" => $ivas,
    "Tributos" => Array(),
   "CbtesAsoc" => Array(),
    "qr" => $qr,
);


$logo_path = './neopdf/logo.png';

$pdf = new PDFVoucher($voucher, $config);
$pdf->emitirPDF($logo_path);

$datetmp = date('Y-m-d', strtotime($fecha));

$pdf->Output($datetmp.'-'.$cliente_razon."-".$letraFactura.$compobante_numero.".pdf");

?>