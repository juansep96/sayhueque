$(document).ready(function() {
    $("#desde").val( moment().format("YYYY-MM-")+'01');
    $("#hasta").val( moment().format("YYYY-MM-DD"));
});

const obtenerCuponesWC = async () => {
    url = 'https://sayhuequebb.com.ar/wp-json/wc/v3/coupons';
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

const nuevoCuponWC = async (cupon) => {
    url = 'https://sayhuequebb.com.ar/wp-json/wc/v3/coupons';
    return new Promise((resolve) => {
        $.ajax({
            type: 'POST',
            async: false,
            url: url,
            data: cupon,
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

const eliminarCuponWC = async (cupon) => {
    url = 'https://sayhuequebb.com.ar/wp-json/wc/v3/coupons/'+cupon;
    return new Promise((resolve) => {
        $.ajax({
            type: 'DELETE',
            async: false,
            url: url,
            data: cupon,
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


const ObtenerCupones = async () => {
    $(".filaCupones").remove();
    data = await obtenerCuponesWC();
        if(data.length>0){
            data.forEach((e)=> {
                acciones = '<div class="eliminar"><a href="javascript:;" onclick="EliminarCupon('+e.id+');" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-trash-fill"></i></a> </div></div>';
                tipo = ObtenerTipo(e.discount_type);
                console.log(tipo);
                tipo == 'PORCENTAJE' ? importe = parseFloat(e.amount).toFixed(0)+'%' : importe = '$ '+ parseFloat(e.amount).toFixed(2);
                uso = e.usage_count +' / '+ (e.usage_limit ? e.usage_limit : 'ILIMITADO');
                e.date_expires ? vencimiento = moment(e.date_expires).format('DD/MM/YYYY') : vencimiento = 'SIN VENCIMIENTO';
                htmlTags = '<tr class="filaCupones">' +
                                '<td>'+e.code.toUpperCase()+'</td>'+
                                '<td>'+tipo+'</td>'+
                                '<td>'+importe+'</td>'+
                                '<td>'+e.description+'</td>'+
                                '<td>'+uso +'</td>'+
                                '<td>'+vencimiento+'</td>'+
                                '<td class="text-center">'+acciones+'</td>'+
                                '</tr>';
            $('#cupones tbody').append(htmlTags);
        })
        }else{
            htmlTags = '<tr class="filaCupones">' +
            '<td colspan="7">NO SE ENCONTRARON CUPONES.</td>'+
            '</tr>';
        $('#cupones tbody').append(htmlTags);
        }
}

const InsertarNuevoCupon = async () => {
    let codigo = $("#codigo").val();
    let tipo = $("#tipo").val();
    let monto = $("#monto").val();
    let limite = $("#limite").val();
    let descripcion = $("#descripcion").val();
    let vencimiento = $("#vencimiento").val();
    if(codigo && tipo && monto && limite){
        Lobibox.confirm({
            msg: "Seguro  que desea guardar el nuevo Cupon?",
            callback: async function ($this, type, ev) {
              if(type=="yes"){
                let data = {
                    code:codigo,
                    discount_type : tipo,
                    amount:monto,
                    individual_use:true,
                    exclude_sale_items: true,
                    description:descripcion,
                    date_expires:vencimiento,
                    usage_limit:limite
                }
                await nuevoCuponWC(data);
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-message-error',
                    msg: 'Cupon creado con éxito.',
                  });
                setTimeout(() => {
                    ObtenerCupones();
                    $("#modalNuevoCupon").modal('hide');
                    $("#codigo").val('');
                    $("#tipo").val('percent');
                    $("#monto").val('');
                    $("#limite").val('0');
                    $("#descripcion").val('');
                    $("#vencimiento").val('');
                }, 1000);
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
        
    }else{
        Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-message-error',
            msg: 'Debe completar todos los campos indicados con *.',
          });
    }
}

const EliminarCupon = async (idCupon) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar el Cupon?",
        callback: async function ($this, type, ev) {
          if(type=="yes"){
            await eliminarCuponWC(idCupon);
            Lobibox.notify('success', {
                pauseDelayOnHover: true,
                continueDelayOnInactiveTab: false,
                position: 'top right',
                icon: 'bx bx-message-error',
                msg: 'Cupon eliminado con éxito.',
              });
            setTimeout(() => {
                ObtenerCupones();
            }, 2000);
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

const ObtenerTipo = (discount_type) => {
    var status;
    switch (discount_type) {
        case 'percent':
            status = 'PORCENTAJE';
        break;
        case 'fixed_cart':
            status = 'MONTO FIJO';
        break;
    }
    return status;
}