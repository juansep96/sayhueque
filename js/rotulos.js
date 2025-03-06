$(document).ready(function() {
    $("#desde").val( moment().format("YYYY-MM-")+'01');
    $("#hasta").val( moment().format("YYYY-MM-DD"));
});

const obtenerRotulosCorreoWC = async (fechaDesde = null,fechaHasta = null) => {
    jQuery.ajax(
        {
            type: 'POST',
            url: 'https://sayhuequebb.com.ar/wp-admin/admin-ajax.php',
            responseType: 'json',
            data: {
                action: 'wanderlust_ca_export',
                desde: fechaDesde,
                hasta: fechaHasta
            },
            success: function( data ) {
                let elemento = String(data);
                elemento = elemento.split('"');
                if(elemento.length==1){
                    let btn = '<button disabled type="button" class="btn btn-pink">NO HAY ROTULOS DISPONIBLES PARA DESCARGAR</button>';
                    $("#resultado").html(btn);   
                }else{
                    url = elemento[3];
                    let btn = '<button onclick="DescargarArchivo(`'+url+'`);" type="button" class="btn btn-pink">Descargar</button>';
                    $("#resultado").html(btn);
                }
               
            },
            error: function( errorThrown ) {
                let btn = 'ERROR AL OBTENER ROTULOS';
                $("#resultado").html(btn);                
            }
        }
    );
}


const ObtenerRotulos = async () => {
    $(".filaOrdenes").remove();
    fechaDesde = $("#desde").val();
    fechaHasta = $("#hasta").val();
    if(fechaDesde && fechaHasta){
        data = await obtenerRotulosCorreoWC(fechaDesde,fechaHasta);
        console.log(data);     
       
    }
}

const DescargarArchivo = (url) => {
    window.open(url,'_blank');
}
