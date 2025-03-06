<?php 

date_default_timezone_set('America/Argentina/Buenos_Aires');
setlocale(LC_ALL,"es_ES");

try {
    $conexionIntranet = new PDO('mysql:host=localhost;dbname=sayhueque_intra;charset=utf8','sayhueque_sayhueque','ikHFx{tyaXni');
    $conexionWordPress = new PDO('mysql:host=localhost;dbname=sayhueque_wp44745;charset=utf8','sayhueque_sayhueque','ikHFx{tyaXni');
}catch(PDOException $e){
    echo "Error" . $e->getMessage();
}
    $ObtenerProductos = $conexionIntranet -> prepare("SELECT * from productos WHERE estado_producto = 1");
    $ObtenerProductos -> execute();
    foreach($ObtenerProductos as $item){
        $fechaHora = date("Y-m-d H:i:s");
        $sku_producto = $item['id_producto']; //Es el SKU de la tienda
        $stock_actual = $item['stock_3_producto'];
        $ObtenerIdPostWordpress = $conexionWordPress -> prepare("SELECT * FROM wp_postmeta WHERE meta_key= '_sku' AND meta_value=:1");
        $ObtenerIdPostWordpress -> bindParam(':1',$sku_producto);
        $ObtenerIdPostWordpress -> execute();
        if($ObtenerIdPostWordpress -> RowCount()>0){
            foreach($ObtenerIdPostWordpress as $data){
                $id_producto_tienda = $data['post_id'];
                        $stock_actual = $item['stock_3_producto'];
var_dump($stock_actual);
                if($stock_actual>0){
                    $newStatus = 'instock';
                }else{
                    $newStatus = 'outofstock';
                }
                //Actualizar STOCK
                $ActualizarStock = $conexionWordPress -> prepare("UPDATE wp_postmeta SET meta_value=:1 WHERE meta_key='_stock' AND post_id=:2");
                $ActualizarStock -> bindParam(':1',$stock_actual);
                $ActualizarStock -> bindParam(':2',$id_producto_tienda);
                if($ActualizarStock -> execute()){
                    $estado="CORRECTO";
                }else{
                    $estado="ERROR";
                }
                $ActualizarEstado = $conexionWordPress -> prepare("UPDATE wp_postmeta SET meta_value=:1 WHERE meta_key='_stock_status' AND post_id=:2");
                $ActualizarEstado -> bindParam(':1',$newStatus);
                $ActualizarEstado -> bindParam(':2',$id_producto_tienda);
                if($ActualizarEstado -> execute()){
                    $estado="CORRECTO";
                }else{
                    $estado="ERROR";
                }
                $InsertarRegisto = $conexionIntranet -> prepare("INSERT INTO sincronizaciones (fechaHora_sync,idProducto_sync,stockProducto_sync,estado_sync,estadoWP_sync) VALUES (:1,:2,:3,:4,:5)");
                $InsertarRegisto -> bindParam(":1",$fechaHora);
                $InsertarRegisto -> bindParam(":2",$id_producto_tienda);
                $InsertarRegisto -> bindParam(':3',$stock_actual);
                $InsertarRegisto -> bindParam(':4',$estado);
                $InsertarRegisto -> bindParam(':5',$newStatus);
                $InsertarRegisto -> execute();
            }
        }else{
            $estado="ERROR: NO ENCONTRADO EN TIENDA";
            $InsertarRegisto = $conexionIntranet -> prepare("INSERT INTO sincronizaciones (fechaHora_sync,idProducto_sync,stockProducto_sync,estado_sync) VALUES (:1,:2,:3,:4)");
            $InsertarRegisto -> bindParam(":1",$fechaHora);
            $InsertarRegisto -> bindParam(":2",$sku_producto);
            $InsertarRegisto -> bindParam(':3',$stock_actual);
            $InsertarRegisto -> bindParam(':4',$estado);
            $InsertarRegisto -> execute();
        }
        

    }


?>  