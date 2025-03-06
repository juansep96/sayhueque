<?php

var_dump('dddd');


require_once "../PDO.php";

$ObtenerPatriminio = $conexion -> prepare("SELECT nombre_proveedor,
       SUM(valorCompra_producto * stock_2_producto) AS bbps,
       SUM(valorCompra_producto * stock_1_producto) AS deposito,
       SUM(valorCompra_producto * stock_3_producto) AS centro -- Verifica si la columna tiene valores
FROM productos
LEFT JOIN proveedores ON idProveedor_producto = id_proveedor
WHERE estado_producto = 1
GROUP BY idProveedor_producto");
$ObtenerPatriminio -> execute();

$result = $ObtenerPatriminio->fetchAll(\PDO::FETCH_ASSOC);

var_dump('dddd');
print_r (json_encode($result));

?>
