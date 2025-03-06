<?php

require_once "../PDO.php";

date_default_timezone_set("America/Argentina/Buenos_Aires");
setlocale(LC_ALL,"es_ES");
$cuando = date("Y-m-d H:i:s");


$datos = json_decode($_POST['data'],true);
$items = $datos['line_items'];
$cupones = $datos['coupon_lines'];

$idFactura=-1;

$idCliente = -1;

$total_sin_iva = floatval($datos['total']);
switch ($datos['payment_method_title']) {
    case 'Efectivo':
        $efectivo = $total_sin_iva;
        $transferencia = 0.00;
        $posnet = 0.00;
    break;
    case 'Efectivo en Bahia Blanca':
        $efectivo = $total_sin_iva;
        $transferencia = 0.00;
        $posnet = 0.00;
    break;
    case 'Mobbex':
        $efectivo = 0.00;
        $transferencia = 0.00;
        $posnet = $total_sin_iva;    
    break;
    case 'Transferencia bancaria':
        $efectivo = 0.00;
        $transferencia = $total_sin_iva;
        $posnet = 0.00;    
    break;
}

$idSucursal = 3;


$InsertarEncabezado = $conexion -> prepare("INSERT INTO ventas (fechaHora_venta,totalVenta_venta,pagoTransferencia_venta,pagoEfectivo_venta,pagoPosnet_venta,idFactura_venta,idCliente_venta,totalSinIVA_venta,idSucursal_venta,idUsuario_venta) values (:1,:2,:3,:4,:5,:6,:7,:8,:9,:10)");
$InsertarEncabezado -> bindParam(':1',$cuando);
$InsertarEncabezado -> bindParam(':2',$total_sin_iva);
$InsertarEncabezado -> bindParam(':3',$transferencia);
$InsertarEncabezado -> bindParam(':4',$efectivo);
$InsertarEncabezado -> bindParam(':5',$posnet);
$InsertarEncabezado -> bindParam(':6',$idFactura);
$InsertarEncabezado -> bindParam(':7',$idCliente);
$InsertarEncabezado -> bindParam(':8',$total_sin_iva);
$InsertarEncabezado -> bindParam(':9',$idSucursal);
$InsertarEncabezado -> bindParam(':10',$_SESSION['idUser']);



if($InsertarEncabezado->execute()){
    $idVenta = $conexion->lastInsertId();
    foreach($items as $producto){
        $cantidad = $producto['quantity'];
        $idProducto = $producto['sku'];
        $precio = floatval($producto['price']);
        $descuento = 0.00;
        $InsertarDetalle = $conexion -> prepare("INSERT INTO ventaDetalle (idVenta_ventaDetalle,precioVenta_ventaDetalle,idProducto_ventaDetalle,cantidad_ventaDetalle,dto_ventaDetalle) VALUES (:1,:2,:3,:4,:5)");
        $InsertarDetalle -> bindParam(':1',$idVenta);
        $InsertarDetalle -> bindParam(':2',$precio);
        $InsertarDetalle -> bindParam(':3',$idProducto);
        $InsertarDetalle -> bindParam(':4',$cantidad);
        $InsertarDetalle -> bindParam(':5',$descuento);
        if(!$InsertarDetalle -> execute()){
            echo "\nPDO::errorInfo():\n";
            print_r($InsertarDetalle->errorInfo());
        }
    }
    foreach($cupones as $cupon){

        //Primero insertamos el cupon como un producto como si fuera un ajuste
        $nombre = "CUPON: ".strtoupper($cupon['code']);
        $codigo = '999999';
        $precio = floatval($cupon['discount']) * -1;
        $cero = 0;

        $InsertarProducto = $conexion -> prepare("INSERT INTO productos (nombre_producto,codigo_producto,iva_producto,valorCompra_producto,valorVenta_producto,stock_1_producto,stock_2_producto,estado_producto,stock_3_producto) VALUES (:1,:2,:3,:4,:5,:6,:7,:8,:9)");
        $InsertarProducto -> bindParam(':1',$nombre);
        $InsertarProducto -> bindParam(':2',$codigo);
        $InsertarProducto -> bindParam(':3',$cero);
        $InsertarProducto -> bindParam(':4',$cero);
        $InsertarProducto -> bindParam(':5',$precio);
        $InsertarProducto -> bindParam(':6',$cero);//stock
        $InsertarProducto -> bindParam(':7',$cero);//stock
        $InsertarProducto -> bindParam(':8',$cero); //Inserto el producto como eliminado para que no aparezca en el listado,
        $InsertarProducto -> bindParam(':9',$cero);//stock
        if(!$InsertarProducto -> execute()){
          echo "\nPDO::errorInfo():\n";
          print_r($InsertarProducto->errorInfo());
        }else{
            $idProducto = $conexion -> lastInsertId();
        }

        $cantidad = 1;
        $descuento = 0.00;
        $InsertarDetalle = $conexion -> prepare("INSERT INTO ventaDetalle (idVenta_ventaDetalle,precioVenta_ventaDetalle,idProducto_ventaDetalle,cantidad_ventaDetalle,dto_ventaDetalle) VALUES (:1,:2,:3,:4,:5)");
        $InsertarDetalle -> bindParam(':1',$idVenta);
        $InsertarDetalle -> bindParam(':2',$precio);
        $InsertarDetalle -> bindParam(':3',$idProducto);
        $InsertarDetalle -> bindParam(':4',$cantidad);
        $InsertarDetalle -> bindParam(':5',$descuento);
        if(!$InsertarDetalle -> execute()){
            echo "\nPDO::errorInfo():\n";
            print_r($InsertarDetalle->errorInfo());
        }
    }
    echo "OK";
}else{
  echo "\nPDO::errorInfo():\n";
    print_r($InsertarEncabezado->errorInfo());
}


?>