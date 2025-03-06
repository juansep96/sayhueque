var urlBase = "./api/nuevaVenta/";
var urlImpresion = urlBase+"ImprimirVentaB";
var urlFacturador = "./AFIP/facturarB";

var guardado = localStorage.getItem('arrayVentas');
var guardado=JSON.parse(guardado);
var arrayProductos;
var total;


async function obtenerIdStockPorSucursalLogueada() {
    try {
        const idSucursal = await $.post("./api/ObtenerIDSucursal");
        const parsedIdSucursal = parseInt(idSucursal);
        switch (parsedIdSucursal) {
            case 1:
                return "stock_1_producto";
            case 2:
                return "stock_2_producto";
            case 3:
                return "stock_1_producto";
            case 5:
                return "stock_3_producto";
            default:
                return "not_found";
        }
    } catch (error) {
        console.error('Error al obtener el ID de la sucursal:', error);
        return "error";
    }
}


$(document).ready(function() {
    $("#buscadorProducto").on('keyup', function (e) {
    e.preventDefault();
    var keycode = e.keyCode || e.which;
      if (keycode == 13) {
          BuscarProductos();
      }
    });


    if(!guardado){
      arrayProductos=[{}];
    }else{
      arrayProductos = guardado;
      ActualizarTabla(arrayProductos);
    }
});



function updateInput(cant,id){
  id="#"+id;
  $(id).val(cant);
  ActualizarCarrito(arrayProductos);
}

function updateInput2(desc,id){
  id="#"+id;
  $(id).val(desc);
  ActualizarCarrito(arrayProductos);
}

function ActualizarCarrito(carrito){
  for(var i=0;i<carrito.length;i++){
    id = carrito[i].id;
    selector = "#cant_"+id;
    carrito[i].cantidad = $(selector).val();
    selector2 = "#dto_"+id;
    carrito[i].descuento = $(selector2).val();

  }
  ActualizarTabla(carrito);
}

function ActualizarTabla(array){
  $("#totalizador").val("");
  $(".filaTabla").remove();
  total=0;
  for(var i = 1;i<array.length;i++){
    precio = parseFloat(array[i].precio);
    subtotal = precio * array[i].cantidad;
    descuento = array[i].descuento;
    if(descuento>0 && descuento<99){
      descuento = "0."+descuento;
      subtotal = subtotal-(subtotal*descuento);
    }else{
      if(descuento==100){
        descuento = 1;
        subtotal = subtotal-(subtotal*descuento);
      }
    }
    total=total+parseFloat(subtotal);
    subtotal = subtotal.toFixed(2);
    precio = precio.toFixed(2);
    var htmlTags = '<tr class="filaTabla">' +
                    '<td>' + array[i].codigo + '</td>'+
                    '<td>' + array[i].nombre + '</td>'+
                    '<td> $' + array[i].precio + '</td>'+
                    '<td><input type="number" onchange="updateInput(this.value,this.id);" min="1" class="form-control inputCantidad text-center" style="width:80px !important" id="cant_'+array[i].id+'" value="'+array[i].cantidad+'"></td>'+
                    '<td><input type="number" onchange="updateInput2(this.value,this.id);" min="0" class="form-control inputDescuento text-center" style="width:80px !important" id="dto_'+array[i].id+'" value="'+array[i].descuento+'"></td>'+
                    '<td> $' + subtotal + '</td>'+
                    '<td class="text-center"><div class="eliminar"><a href="javascript:;" onclick="EliminarItem('+i+');" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-trash-fill"></i></a> </div></td>'+
                    '</tr>';
    $('#tabla-venta tbody').append(htmlTags);
  }
  total=parseFloat(total);
  total = total.toFixed(2);
  $("#totalizador").val(total);
  localStorage.setItem('arrayVentas', JSON.stringify(array));
}

async function BuscarProductos(){
  query = $("#buscadorProducto").val();
  $("#errorBusqueda h3").remove();
  $("#buscadorProducto").val("");
  $.post(urlBase+"ObtenerProductos",{query})
  .then(async (rta)=>{
          rta = JSON.parse(rta);
          if(rta.length==1){
            stockAConsultar = await obtenerIdStockPorSucursalLogueada();
            
            if(rta[0][stockAConsultar]>0){
                producto = {
                    id: rta[0].id_producto,
                    codigo : rta[0].codigo_producto,
                    nombre : rta[0].nombre_producto,
                    precio : rta[0].valorVenta_producto,
                    cantidad : 1,
                    descuento : 0,
                  }
                  arrayProductos.push(producto);
                  ActualizarTabla(arrayProductos);
                  Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Agregado!',
                  });
            }else{
                Lobibox.notify('error', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-error-circle',
                    msg: 'El producto no tiene stock, no puedes venderlo.',
                  });
            }
              
          }else if(rta.length==0){
            Lobibox.notify('error', {
                pauseDelayOnHover: true,
                continueDelayOnInactiveTab: false,
                position: 'top right',
                icon: 'bx bx-message-error',
                msg: 'No se encontraron productos.',
              });
          }else if(rta.length>1){
            SeleccionarProducto(rta);
          }
  });
}

async function SeleccionarProducto(array){
  $(".filaElegirProducto").remove();
  for (var i = 0;i<array.length;i++){
    precio = parseFloat(array[i].valorVenta_producto);
    precio = precio.toFixed(2);
    stockAConsultar = await obtenerIdStockPorSucursalLogueada();
    if(array[i][stockAConsultar]>0){
        var htmlTags = '<tr class="filaElegirProducto" onclick="CargarProductoArray('+array[i].id_producto+');">' +
        '<td>' + array[i].codigo_producto + '</td>'+
        '<td>' + array[i].nombre_producto + '</td>'+
        '<td> $ ' + precio + '</td>'+
        '</tr>';
    }else{
        var htmlTags = '<tr class="filaElegirProducto withoutStock">' +
                    '<td>' + array[i].codigo_producto + '</td>'+
                    '<td>' + array[i].nombre_producto + ' <b> --- SIN STOCK </b> </td>'+
                    '<td> $ ' + precio + '</td>'+
                    '</tr>';
    }
    $('#tabla-elegirproducto tbody').append(htmlTags);
    $("#modalElegirproducto").modal('show');
    
  }
}

function CerrarElegirProducto(){
  $("#modalElegirproducto").modal('hide');
}

function CargarProductoArray(idProducto){
  CerrarElegirProducto();
  $.post(urlBase+"ObtenerProducto",{idProducto})
  .then((rta)=>{
          rta = JSON.parse(rta);
          if(rta.length==1){
            producto = {
              id: rta[0].id_producto,
              codigo : rta[0].codigo_producto,
              nombre : rta[0].nombre_producto,
              precio : rta[0].valorVenta_producto,
              cantidad : 1,
              descuento : 0,
            }
              arrayProductos.push(producto);
              ActualizarTabla(arrayProductos);
              Lobibox.notify('success', {
                pauseDelayOnHover: true,
                continueDelayOnInactiveTab: false,
                position: 'top right',
                icon: 'bx bx-check-circle',
                msg: 'Agregado!',
              });
          }
  });
}

function EliminarItem(datos){
    arrayProductos.splice(datos, 1);
    Lobibox.notify('success', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        position: 'top right',
        icon: 'bx bx-check-circle',
        msg: 'Item Eliminado!',
      });
    ActualizarTabla(arrayProductos);
}



function NuevoAjuste(){
  $("#modalAjuste").modal('show');
}

function CargarAjuste(){
  detalle = $("#detalle_item").val();
  precio = $("#importe_item").val();
  if(precio.length>0){
    precio = precio.replace(",",".");
  }
  if(detalle && !isNaN(precio) && precio){
    detalle = detalle.toUpperCase();
    producto = {
      id: 0,
      codigo : "999999",
      nombre : detalle,
      precio : precio,
      cantidad : 1,
      descuento : 0,
    }
    arrayProductos.push(producto);
    ActualizarTabla(arrayProductos);
    Lobibox.notify('success', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        position: 'top right',
        icon: 'bx bx-check-circle',
        msg: 'Ajuste agregado!',
      });
    $("#detalle_item").val('');
    $("#importe_item").val('');
    CerrarCargarAjuste();
  }else{
    Lobibox.notify('error', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        position: 'top right',
        icon: 'bx bx-message-error',
        msg: 'Faltan campos por completar.',
      });
  }

}

function DescartarVenta(){
    Lobibox.confirm({
        msg: "Seguro  que desea descartar esta venta?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            arrayProductos=[{}];
            ActualizarTabla(arrayProductos);
            Lobibox.notify('success', {
                pauseDelayOnHover: true,
                continueDelayOnInactiveTab: false,
                position: 'top right',
                icon: 'bx bx-check-circle',
                msg: 'Venta descartada!',
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

function CerrarCargarAjuste(){
  $("#modalAjuste").modal('hide');
}

function CerrarMetodoPago(){
  $("#modalMetodo").modal('hide');
}

function GuardarVenta(){
  cero='0.00';
  $("#efectivo").val(cero);
  $("#transferencia").val(cero);
  $("#posnet").val(cero);
  $("#pagaCon").val(cero);
  CalcularVuelto();
  if(arrayProductos.length>1){
    total = $("#totalizador").val();
    $("#efectivo").val(total);
    $("#facturar").val("0");
    $("#botonGuardar").prop('hidden',true);
    $("#modalMetodo").modal('show');
  }else{
    Lobibox.notify('error', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        position: 'top right',
        icon: 'bx bx-message-error',
        msg: 'No hay productos en la venta.',
      });
  }
}


function CalcularVuelto(){
  efectivo = $("#efectivo").val();
  pagaCon = $("#pagaCon").val();
  if(efectivo>0){
    vuelto = pagaCon-efectivo;
    vuelto = "$ "+vuelto;
    $("#vuelto").val(vuelto);
  }

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

function InsertarVenta(){
    efectivo = $("#efectivo").val();
    total = $("#totalizador").val();
    posnet = $("#posnet").val();
    transferencia = $("#transferencia").val();
    facturar = $("#facturar").val();
    dni = $("#dni_facturador").val();
  
      if(total && efectivo && posnet && transferencia){
          arrayProductos.shift();
              var datos = {
                productos : arrayProductos,
                efectivo,
                transferencia,
                posnet,
                total,
              }
          datos = JSON.stringify(datos);
          if(facturar == 'NO'){ // Mandamos solo a insertar venta, sin facturar
              $("#modalGuardando").modal('show');
              $.post(urlBase+"InsertarVenta",{datos})
                .then((idVenta)=>{
                  $.post("./api/transacciones/ObtenerVenta",{idVenta})
                  .then((data)=> {
                      $("#modalGuardando").modal('hide');
                      window.open(urlImpresion+'?idVenta='+idVenta, '_blank');
                      CerrarMetodoPago();
                      arrayProductos=[{}];
                      ActualizarTabla(arrayProductos);
                      $("#modalGuardando").modal('hide');
                      data = JSON.parse(data);
                      data.forEach((e)=> {
                          actualizarStockWC(e.id_producto,e.stock_2_producto);
                      })
                      
                  })
                  
              });              
          }else{ // Facturar si --> Hay que verificar los totales primero para pedir o no CF
              if(parseFloat(total)>417288){ // Pasamos el DNI y ponemos en una variable llamada CF el 0 (False). Validar DNI no sea igual a '123456789'
                  if( dni && dni != '123456789' && dni.length>6 && dni.length<9){
                      let cf = 0;
                      $.post(urlFacturador,{total,dni,cf})
                          .then((response)=>{
                              response = JSON.parse(response);
                              if(response.success){ // Se facturó
                              idFactura = response.idFactura;
                              $.post(urlBase+"InsertarVenta",{datos,idFactura})
                              .then((idVenta)=>{
                                      $("#modalGuardando").modal('hide');
                                      window.open(urlImpresion+'?idVenta='+idVenta, '_blank');
                                      CerrarMetodoPago();
                                      arrayProductos=[{}];
                                      ActualizarTabla(arrayProductos);
                                      $("#modalGuardando").modal('hide');
                                      reset();
                                  $.post("./api/transacciones/ObtenerVenta",{idVenta})
                                  .then((data)=> {
                                      data = JSON.parse(data);
                                      data.forEach((e)=> {
                                          actualizarStockWC(e.id_producto,e.stock_2_producto);
                                      })
                                      
                                  })
                                 
                              })
                              }else{ //Error al facturar, no mandamos a imprimir pero insertamos y damos un cartel modal.
                              $.post(urlBase+"InsertarVenta",{datos})
                              .then((idVenta)=>{
                                  $.post("./api/transacciones/ObtenerVenta",{idVenta})
                                  .then((data)=> {
                                       $("#modalGuardando").modal('hide');
                                      CerrarMetodoPago();
                                      arrayProductos=[{}];
                                      ActualizarTabla(arrayProductos);
                                      $("#modalGuardando").modal('hide');
                                      $("#modalErrorFacturarAFIP").modal('show');
                                      $("#modalGuardando").modal('hide');
                                      reset();
                                      data = JSON.parse(data);
                                      data.forEach((e)=> {
                                          actualizarStockWC(e.id_producto,e.stock_2_producto);
                                      })
                                     
                                  })
                                 
                              })
                              }        
                      })
                  }else{
                      Lobibox.notify('error', {
                          pauseDelayOnHover: true,
                          continueDelayOnInactiveTab: false,
                          position: 'top right',
                          icon: 'bx bx-message-error',
                          msg: 'Debe completar un DNI válido ya que la venta supera los $92.720.',
                      });
                  }
              }else{
                  let cf = 1;
                  $.post(urlFacturador,{total,dni,cf})
                      .then((response)=>{
                          response = JSON.parse(response);
                          if(response.success){ // Se facturó
                          idFactura = response.idFactura;
                          $.post(urlBase+"InsertarVenta",{datos,idFactura})
                          .then((idVenta)=>{
                              $.post("./api/transacciones/ObtenerVenta",{idVenta})
                              .then((data)=> {
                                  data = JSON.parse(data);
                                  data.forEach((e)=> {
                                      actualizarStockWC(e.id_producto,e.stock_2_producto);
                                  })
                                  $("#modalGuardando").modal('hide');
                                  window.open(urlImpresion+'?idVenta='+idVenta, '_blank');
                                  CerrarMetodoPago();
                                  arrayProductos=[{}];
                                  ActualizarTabla(arrayProductos);
                                  $("#modalGuardando").modal('hide');
                                  reset();
                              })
                          })
                          }else{ //Error al facturar, no mandamos a imprimir pero insertamos y damos un cartel modal.
                          $.post(urlBase+"InsertarVenta",{datos})
                          .then(()=>{
                              $("#modalGuardando").modal('hide');
                              CerrarMetodoPago();
                              arrayProductos=[{}];
                              ActualizarTabla(arrayProductos);
                              $("#modalGuardando").modal('hide');
                              $("#modalErrorFacturarAFIP").modal('show');
                              $("#modalGuardando").modal('hide');
                              reset();
                          })
                      }        
                })
              }
              
          }
      }else{
          Lobibox.notify('error', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-message-error',
              msg: 'Complete todos los campos.',
          });
      }
    
  }
  
  function CerrarElegirMetodo(){
    $("#modalMetodo").modal('hide');
  }
  
  function ActivarBotonGuardar(){
      facturar = $("#facturar").val();
      $("#dni_facturador").val('123456789');
      if(facturar == 'SI'){
          document.getElementById('contenedor_dni').classList.remove('d-none');
      }else{
          document.getElementById('contenedor_dni').classList.add('d-none');
      }
    $("#botonGuardar").prop('hidden',false);
  }
  
  const AplicarIntereses = () => {
      $("#modalPlanesAhora").modal('show');
  }
  
  const AplicarInteresesOK = () => {
      let planElegido = document.querySelector('input[name="plan_tarjeta"]:checked').value;
      let total = parseFloat($("#totalizador").val()).toFixed(2);
      let nuevoTotal;
      switch (planElegido){
          case '6':
              nuevoTotal = total * 1.2;
          break;
          case '12':
              nuevoTotal = total * 1.4;
          break;
      }
      let interesAsumar = parseFloat(nuevoTotal).toFixed(2) - parseFloat(total).toFixed(2);    
      interesAsumar = parseFloat(interesAsumar).toFixed(2);
      if(planElegido){
          detalle = 'PLAN AHORA '+planElegido;
          precio = interesAsumar;
          producto = {
              id: 0,
              codigo : "999999",
              nombre : detalle,
              precio : precio,
              cantidad : 1,
              descuento : 0,
          }
              arrayProductos.push(producto);
              ActualizarTabla(arrayProductos);
              Lobibox.notify('success', {
                  pauseDelayOnHover: true,
                  continueDelayOnInactiveTab: false,
                  position: 'top right',
                  icon: 'bx bx-check-circle',
                  msg: 'Intereses calculados!',
              });
          $("#modalPlanesAhora").modal('hide');
      }else{
      Lobibox.notify('error', {
          pauseDelayOnHover: true,
          continueDelayOnInactiveTab: false,
          position: 'top right',
          icon: 'bx bx-message-error',
          msg: 'Debe seleccionar un plan.',
        });
    }
  }
  
  const CerrarElegirPlanAhora = async () => {
      $("#modalPlanesAhora").modal('hide');
  }