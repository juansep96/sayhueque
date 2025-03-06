$(document).ready(function() {
    $("#desde").val( moment().format("YYYY-MM-")+'01');
    $("#hasta").val( moment().format("YYYY-MM-DD"));
});

const obtenerPedidosWC = async (fechaDesde = null,fechaHasta = null, estado = null) => {
    if(estado == 'all'){
        url = 'https://sayhuequebb.com.ar/wp-json/wc/v3/orders';
        fechaDesde ? url = url + '?after=' + fechaDesde + 'T00:00:00' : '';
    }else{
        url = 'https://sayhuequebb.com.ar/wp-json/wc/v3/orders/?status='+estado;
        fechaDesde ? url = url + '&after=' + fechaDesde + 'T00:00:00' : '';
    }
    fechaHasta ? url = url + '&before=' + fechaHasta + 'T23:59:59': '';
    return new Promise((resolve) => {
        $.ajax({
            type: 'GET',
            async: false,
            url: url,
            data: {},
            crossDomain: true,
            beforeSend: function(xhr) {
              xhr.setRequestHeader('Authorization', 'Basic ' + btoa(unescape(encodeURIComponent('ck_bb21e836cc4c1900d34c271c9d55a58011cce981' + ':' + 'cs_8734c2752e0af5eab31ce996369d555265f1d400'))))
            },
            success: function(d){
              resolve(d);
            }
          });
      });
}

const obtenerPedidoWC = async (idPedido) => {
    return new Promise((resolve) => {
        $.ajax({
            type: 'GET',
            async: false,
            url: 'https://sayhuequebb.com.ar/wp-json/wc/v3/orders/'+idPedido,
            data: {},
            crossDomain: true,
            beforeSend: function(xhr) {
              xhr.setRequestHeader('Authorization', 'Basic ' + btoa(unescape(encodeURIComponent('ck_bb21e836cc4c1900d34c271c9d55a58011cce981' + ':' + 'cs_8734c2752e0af5eab31ce996369d555265f1d400'))))
            },
            success: function(d){
              resolve(d);
            }
          });
      });
}
const ObtenerOrdenes = async () => {
    $(".filaOrdenes").remove();
    fechaDesde = $("#desde").val();
    fechaHasta = $("#hasta").val();
    estado = $("#estado").val();
    if(fechaDesde && fechaHasta && estado){
        data = await obtenerPedidosWC(fechaDesde,fechaHasta,estado);
        if(data.length>0){
            data.forEach((e)=> {
                cliente = e.billing.first_name + ' ' + e.billing.last_name;
                acciones = '';
                estado = obtenerEstado(e.status);
                console.log(estado);
                switch (estado) {
                    case 'PENDIENTE':
                        acciones =  '<div class="d-flex align-items-center gap-3 fs-6 text-center"><div class="exportar"><a href="javascript:;" onclick="AbrirOrden(`'+e.id+'`);" class="text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-eye-fill"></i></a></div>'+
                                    '<div class="exportar"><a href="javascript:;" onclick="ConfirmarOrden(`'+e.id+'`);" class="text-success" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-check"></i></a></div>'+
                                    '<div class="eliminar"><a href="javascript:;" onclick="CancelarOrden(`'+e.id+'`);" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-trash-fill"></i></a> </div></div>';
                    break;
                    case 'CANCELADA':
                        acciones =  '<div class="d-flex align-items-center gap-3 fs-6 text-center"><div class="exportar"><a href="javascript:;" onclick="AbrirOrden(`'+e.id+'`);" class="text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-eye-fill"></i></a></div></div>';
                    break;

                    case 'COMPLETADA':
                        acciones =  '<div class="d-flex align-items-center gap-3 fs-6 text-center"><div class="exportar"><a href="javascript:;" onclick="AbrirOrden(`'+e.id+'`);" class="text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-eye-fill"></i></a></div></div>';
                    break;
                    default:
                    break;
                }
                htmlTags = '<tr class="filaOrdenes">' +
                '<td>'+e.id+'</td>'+
                '<td>'+moment(e.date_created).format('DD/MM/YYYY')+'</td>'+
                '<td>'+moment(e.date_created).format('H:ss')+'</td>'+
                '<td>'+cliente.toUpperCase()+'</td>'+
                '<td> $ '+parseFloat(e.total).toFixed(2)+'</td>'+
                '<td>'+obtenerEstado(e.status)+'</td>'+
                '<td class="text-center">'+acciones+'</td>'+
                '</tr>';
            $('#ordenes tbody').append(htmlTags);
        })
        }else{
            htmlTags = '<tr class="filaOrdenes">' +
            '<td colspan="7">NO SE ENCONTRARON ORDENES.</td>'+
            '</tr>';
        $('#ordenes tbody').append(htmlTags);
        }
        
       
    }
}

const AbrirOrden = async (idOrden) => {
    $(".filaDetalle").remove();
    data = await obtenerPedidoWC(idOrden);
    cliente = data.billing;
    envio = data.shipping;
    envioDetalle = data.shipping_lines[0];

    items = data.line_items;
    cupones =  data.coupon_lines;
    items.forEach((e)=> {
        $.post('./api/productos/ObtenerProducto.php',{idProducto:e.sku})
        .then((data)=> {
            data = JSON.parse(data);
            data = data[0];
            htmlTags = '<tr class="filaDetalle">' +
            '<td>'+ data.codigo_producto +'</td>'+
            '<td>'+ data.nombre_producto.toUpperCase()+'</td>'+
            '<td> $ '+parseFloat(e.subtotal).toFixed(2)+'</td>'+
            '<td>'+e.quantity+'</td>'+
            '<td> $ '+parseFloat(e.subtotal).toFixed(2)+'</td>'+
            '</tr>';
            $('#tabla-items tbody').append(htmlTags);
        })
    })
    cupones.forEach((f)=> {
        console.log(f);
        price = parseFloat(f.discount) * -1;
        htmlTags = '<tr class="filaDetalle">' +
        '<td>999999</td>'+
        '<td>'+ 'CUPON: ' + f.code.toUpperCase()+'</td>'+
        '<td> $ '+parseFloat(price).toFixed(2)+'</td>'+
        '<td>1</td>'+
        '<td> $ '+parseFloat(price).toFixed(2)+'</td>'+
        '</tr>';
        $('#tabla-items tbody').append(htmlTags);
    })

    $("#nombre").val(cliente?.first_name.toUpperCase());
    $("#apellido").val(cliente?.last_name.toUpperCase());
    $("#telefono").val(cliente?.phone.toUpperCase());
    $("#email").val(cliente?.email.toUpperCase());

    $("#total").val(' $ '+parseFloat(data?.total).toFixed(2));
    $("#metodoPago").val(data?.payment_method_title.toUpperCase());
    $("#estadoPago").val(obtenerEstadoPago(data?.status));
    data.transaction_id ?  $("#cuponPago").val(data.transaction_id) : $("#cuponPago").val('');
    if(envio){
        $(".envio").prop('hidden',false);
        $("#nombre_envio").val(envio.first_name ? envio.first_name.toUpperCase() : '');
        $("#apellido_envio").val(envio.last_name ? envio.last_name.toUpperCase() : '');
        $("#telefono_envio").val(envio.phone ? envio.phone.toUpperCase() : '');
        $("#email_envio").val(envio.email? envio.email.toUpperCase() : '');

        $("#direccion").val(envio.address_1 ? envio.address_1.toUpperCase()  : '' + envio.address_2 ? envio.address_2.toUpperCase(2) : '');
        $("#cp").val(envio?.postcode? envio.postcode.toUpperCase() : '');
        $("#ciudad").val(envio.city ? envio.city.toUpperCase() : '');
        $("#provincia").val(envio.state ? envio.state.toUpperCase() : '');
        $("#metodo").val(envioDetalle.method_title ? envioDetalle.method_title.toUpperCase() : '');

    }else{
        $(".envio").prop('hidden',true);
    }
    $("#modalVerOrden").modal('show');
}

const ConfirmarOrden = async (idOrden) => {
    Lobibox.confirm({
        msg: "Seguro  que desea confirmar esta Orden?",
        callback: async function ($this, type, ev) {
          if(type=="yes"){
            data = await obtenerPedidoWC(idOrden);
            data = JSON.stringify(data);
            $.post("./api/nuevaVenta/InsertarVentaOnline",{data})
            .then(async ()=>{
              await ConfirmarOrdenWC(idOrden);
              Lobibox.notify('success', {
                pauseDelayOnHover: true,
                continueDelayOnInactiveTab: false,
                position: 'top right',
                icon: 'bx bx-check-circle',
                msg: 'Venta confirmada con éxito.',
            });
            setTimeout(() => {
                ObtenerOrdenes();
            }, 1000);
           
         });
          }else{
            Lobibox.notify('warning', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-message-error',
              msg: 'Acción cancelada.',
            });
          }
      }
      });
}

const CancelarOrden = async (idOrden) => {
    Lobibox.confirm({
        msg: "Seguro  que desea cancelar esta Orden? Esto devolverá el stock de los productos del pedido.",
        callback: async function ($this, type, ev) {
          if(type=="yes"){
            data = await obtenerPedidoWC(idOrden);
            data = JSON.stringify(data);
            $.post("./api/nuevaVenta/CancelarVentaOnline",{data})
            .then(async ()=>{
              await CancelarOrdenWC(idOrden);
              Lobibox.notify('success', {
                pauseDelayOnHover: true,
                continueDelayOnInactiveTab: false,
                position: 'top right',
                icon: 'bx bx-check-circle',
                msg: 'Venta cancelada con éxito.',
            });
            setTimeout(() => {
                ObtenerOrdenes();
            }, 1000);
           
         });
          }else{
            Lobibox.notify('warning', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-message-error',
              msg: 'Acción cancelada.',
            });
          }
      }
      });
}


const obtenerProductoSKUWC = async (idProducto) => {
    return new Promise((resolve) => {
        $.ajax({
            type: 'GET',
            async: false,
            url: 'https://sayhuequebb.com.ar/wp-json/wc/v3/products/?sku='+idProducto,
            data: {},
            crossDomain: true,
            beforeSend: function(xhr) {
              xhr.setRequestHeader('Authorization', 'Basic ' + btoa(unescape(encodeURIComponent('ck_bb21e836cc4c1900d34c271c9d55a58011cce981' + ':' + 'cs_8734c2752e0af5eab31ce996369d555265f1d400'))))
            },
            success: function(d){
              resolve(d);
            }
          });
      });
}

const actualizarStockWC = async (idProducto,stockNuevo) => {
    var dataProducto = await obtenerProductoSKUWC(idProducto);
    dataProducto = dataProducto[0];
    var nuevoProducto = {
        id:dataProducto.id,
        stock_quantity:stockNuevo
    }
    const options = {
        method: "PUT",
        headers: {
            'Authorization': 'Basic ' + btoa('ck_bb21e836cc4c1900d34c271c9d55a58011cce981:cs_8734c2752e0af5eab31ce996369d555265f1d400'),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto),
      };
      
    fetch("https://sayhuequebb.com.ar/wp-json/wc/v3/products/" + nuevoProducto.id, options)
        .then((response) => response.json())
        .then((data) => console.log(data));    
}

const ConfirmarOrdenWC = async (idOrden) => {
    var dataToSend = {
        "status" : "completed"
    }
    const options = {
        method: "PUT",
        headers: {
            'Authorization': 'Basic ' + btoa('ck_bb21e836cc4c1900d34c271c9d55a58011cce981:cs_8734c2752e0af5eab31ce996369d555265f1d400'),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend),
      };
      
    fetch("https://sayhuequebb.com.ar/wp-json/wc/v3/orders/" + idOrden, options)
        .then((response) => response.json())
        .then((data) => console.log(data));    
}

const CancelarOrdenWC = async (idOrden) => {
    var dataToSend = {
        "status" : "cancelled"
    }
    const options = {
        method: "PUT",
        headers: {
            'Authorization': 'Basic ' + btoa('ck_bb21e836cc4c1900d34c271c9d55a58011cce981:cs_8734c2752e0af5eab31ce996369d555265f1d400'),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend),
      };
      
    fetch("https://sayhuequebb.com.ar/wp-json/wc/v3/orders/" + idOrden, options)
        .then((response) => response.json())
        .then((data) => console.log(data));    
}

const obtenerEstado = (status) => {
    switch (status) {
        case 'pending':
            status = 'PENDIENTE';
        break;
        case 'on-hold':
            status = 'PENDIENTE';
        break;
        case 'processing':
            status = 'PENDIENTE';
        break;
        case 'cancelled':
            status = 'CANCELADA';
        break;
        case 'completed':
            status = 'COMPLETADA';
        break;
        case 'refunded':
            status = 'DEVUELTA';
        break;
    }
    return status;
}

const obtenerEstadoPago = (status) => {
    switch (status) {
        case 'pending':
            status = 'PENDIENTE';
        break;
        case 'on-hold':
            status = 'EN ESPERA';
        break;
        case 'processing':
            status = 'APROBADO';
        break;
        case 'approved':
            status = 'APROBADO';
        break;
        case 'rejeted':
            status = 'RECHAZADO';
        break;
        case 'refunded':
            status = 'DEVUELTA';
        break;
    }
    return status;
}