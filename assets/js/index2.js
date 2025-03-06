var urlBase="./api/estadisticas/";

$(document).ready(function() {
    $.post("./api/ObtenerRol")
    .then((role)=>{
        if(role=="Administrador"){
            let desde = moment().format("YYYY-MM")+'-01';
            let hasta = moment().format("YYYY-MM-DD");
            $("#desde").val(desde);
            $("#hasta").val(hasta);
            Inicializador();
            ObtenerPatrimonio();
        };
    })

    $.post("./api/sucursales/ObtenerSucursalesSelect")
    .then((data)=>{
        data=JSON.parse(data);
        data.forEach((e)=>{
            var opcion = "<option value='"+e.id_sucursal+"'>"+e.nombre_sucursal.toUpperCase()+"</option>";
            $("#suc_home").append(opcion);
        })
        $.post("./api/ObtenerIDSucursal")
        .then((idSucursal)=>{
            $("#suc_home").val(idSucursal);
        })
        Inicializador();
    });
});

function Inicializador(){
    let idSucursal = $("#suc_home").val();
    CalcularVentaPromedio(idSucursal);
    CalcularMontoBlanco(idSucursal);
    CalcularMontoNegro(idSucursal);
    CalcularMedioDePago(idSucursal);
    CalcularTotalCompras(idSucursal);
    CalcularTotalVentas(idSucursal);
    CalcularComprasBlanco(idSucursal);
    CalcularComprasNegro(idSucursal);
}

function CalcularVentaPromedio(idSucursal) {
    let desde = $("#desde").val();
    let hasta = $("#hasta").val();
    $.post(urlBase+'ObtenerVentaPromedio',{desde,hasta,idSucursal})
    .then((response)=>{
        if(response){
            response=JSON.parse(response);
            array = [response.monto_promedio_menos_2,response.monto_promedio_menos_1,response.monto_promedio];
            $("#venta_promedio").html('$ '+response.monto_promedio);
            if(response.crecimiento>0){
                $("#crecimiento_mes_anterior").html('+'+response.crecimiento+'%'+'<i class="bi bi-arrow-up"></i>');
            }else{
                $("#crecimiento_mes_anterior").html('-'+response.crecimiento+'%'+'<i class="bi bi-arrow-down"></i>');
            }
            var options = {
                series: [{
                    name: "Venta Promedio",
                    data: array
                }],
                chart: {
                    type: "line",
                    height: 40,
                    toolbar: {
                        show: !1
                    },
                    zoom: {
                        enabled: !1
                    },
                    dropShadow: {
                        enabled: 0,
                        top: 3,
                        left: 14,
                        blur: 4,
                        opacity: .12,
                        color: "#e72e7a"
                    },
                    sparkline: {
                        enabled: !0
                    }
                },
                markers: {
                    size: 0,
                    colors: ["#e72e7a"],
                    strokeColors: "#fff",
                    strokeWidth: 2,
                    hover: {
                        size: 7
                    }
                },
                plotOptions: {
                    bar: {
                        horizontal: !1,
                        columnWidth: "35%",
                        endingShape: "rounded"
                    }
                },
                dataLabels: {
                    enabled: !1
                },
                stroke: {
                    show: !0,
                    width: 2.5,
                    curve: "smooth"
                },
                tooltip: {
                    theme: "dark",
                    fixed: {
                        enabled: !1
                    },
                    x: {
                        show: !1
                    },
                    y: {
                        title: {
                            formatter: function(e) {
                                return ""
                            }
                        }
                    },
                    marker: {
                        show: !1
                    }
                },
                colors: ["#fff"],
                xaxis: {
                    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                },
                fill: {
                    opacity: 1
                },
              };
            if ( document.querySelector("#chart1").hasChildNodes() ) {
                document.querySelector("#chart1").innerHTML = '';
            }
            var chart = new ApexCharts(document.querySelector("#chart1"), options);
            chart.render();
        }
    })
}

function CalcularMontoBlanco(idSucursal) {
    let desde = $("#desde").val();
    let hasta = $("#hasta").val();
    $.post(urlBase+'ObtenerMontoBlanco',{desde,hasta,idSucursal})
    .then((response)=>{
        if(response){
            response=JSON.parse(response);
            array = [response.monto_blanco_menos_2,response.monto_blanco_menos_1,response.monto_blanco];
            $("#monto_blanco").html('$ '+response.monto_blanco);
            $("#monto_blanco_2").html('$ '+response.monto_blanco);
            if(response.crecimiento>0){
                $("#crecimiento_mes_anterior_blanco").html('+'+response.crecimiento+'%'+'<i class="bi bi-arrow-up"></i>');
                $("#crecimiento_mes_anterior_blanco_2").html('+'+response.crecimiento+'%'+'<i class="bi bi-arrow-up"></i>');
            }else{
                $("#crecimiento_mes_anterior_blanco").html('-'+response.crecimiento+'%'+'<i class="bi bi-arrow-down"></i>');
                $("#crecimiento_mes_anterior_blanco_2").html('-'+response.crecimiento+'%'+'<i class="bi bi-arrow-down"></i>');
            }
            var options = {
                series: [{
                    name: "Ventas Facturadas",
                    data: array
                }],
                chart: {
                    type: "line",
                    height: 40,
                    toolbar: {
                        show: !1
                    },
                    zoom: {
                        enabled: !1
                    },
                    dropShadow: {
                        enabled: 0,
                        top: 3,
                        left: 14,
                        blur: 4,
                        opacity: .12,
                        color: "#e72e7a"
                    },
                    sparkline: {
                        enabled: !0
                    }
                },
                markers: {
                    size: 0,
                    colors: ["#e72e7a"],
                    strokeColors: "#fff",
                    strokeWidth: 2,
                    hover: {
                        size: 7
                    }
                },
                plotOptions: {
                    bar: {
                        horizontal: !1,
                        columnWidth: "35%",
                        endingShape: "rounded"
                    }
                },
                dataLabels: {
                    enabled: !1
                },
                stroke: {
                    show: !0,
                    width: 2.5,
                    curve: "smooth"
                },
                tooltip: {
                    theme: "dark",
                    fixed: {
                        enabled: !1
                    },
                    x: {
                        show: !1
                    },
                    y: {
                        title: {
                            formatter: function(e) {
                                return ""
                            }
                        }
                    },
                    marker: {
                        show: !1
                    }
                },
                colors: ["#fff"],
                xaxis: {
                    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                },
                fill: {
                    opacity: 1
                },
              };
            if ( document.querySelector("#chart2").hasChildNodes() ) {
                document.querySelector("#chart2").innerHTML = '';
            }
            var chart = new ApexCharts(document.querySelector("#chart2"), options);
            chart.render();
        }
    })
}

function CalcularMontoNegro(idSucursal) {
    let desde = $("#desde").val();
    let hasta = $("#hasta").val();
    $.post(urlBase+'ObtenerMontoNegro',{desde,hasta,idSucursal})
    .then((response)=>{
        if(response){
            response=JSON.parse(response);
            array = [response.monto_negro_menos_2,response.monto_negro_menos_1,response.monto_negro];
            $("#monto_negro").html('$ '+response.monto_negro);
            $("#monto_negro_2").html('$ '+response.monto_negro);
            if(response.crecimiento>0){
                $("#crecimiento_mes_anterior_negro").html('+'+response.crecimiento+'%'+'<i class="bi bi-arrow-up"></i>');
                $("#crecimiento_mes_anterior_negro_2").html('+'+response.crecimiento+'%'+'<i class="bi bi-arrow-up"></i>');
            }else{
                $("#crecimiento_mes_anterior_negro").html('-'+response.crecimiento+'%'+'<i class="bi bi-arrow-down"></i>');
                $("#crecimiento_mes_anterior_negro_2").html('-'+response.crecimiento+'%'+'<i class="bi bi-arrow-down"></i>');
            }
            var options = {
                series: [{
                    name: "Ventas Facturadas",
                    data: array
                }],
                chart: {
                    type: "line",
                    height: 40,
                    toolbar: {
                        show: !1
                    },
                    zoom: {
                        enabled: !1
                    },
                    dropShadow: {
                        enabled: 0,
                        top: 3,
                        left: 14,
                        blur: 4,
                        opacity: .12,
                        color: "#e72e7a"
                    },
                    sparkline: {
                        enabled: !0
                    }
                },
                markers: {
                    size: 0,
                    colors: ["#e72e7a"],
                    strokeColors: "#fff",
                    strokeWidth: 2,
                    hover: {
                        size: 7
                    }
                },
                plotOptions: {
                    bar: {
                        horizontal: !1,
                        columnWidth: "35%",
                        endingShape: "rounded"
                    }
                },
                dataLabels: {
                    enabled: !1
                },
                stroke: {
                    show: !0,
                    width: 2.5,
                    curve: "smooth"
                },
                tooltip: {
                    theme: "dark",
                    fixed: {
                        enabled: !1
                    },
                    x: {
                        show: !1
                    },
                    y: {
                        title: {
                            formatter: function(e) {
                                return ""
                            }
                        }
                    },
                    marker: {
                        show: !1
                    }
                },
                colors: ["#fff"],
                xaxis: {
                    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                },
                fill: {
                    opacity: 1
                },
              };
            if ( document.querySelector("#chart3").hasChildNodes() ) {
                document.querySelector("#chart3").innerHTML = '';
            }
            var chart = new ApexCharts(document.querySelector("#chart3"), options);
            chart.render();
        }
    })
}

function CalcularMedioDePago(idSucursal) {
    let desde = $("#desde").val();
    let hasta = $("#hasta").val();
    
    $.post(urlBase + 'ObtenerMedioDePago', { desde, hasta, idSucursal })
    .then((response) => {
        if (response) {
            response = JSON.parse(response);
            
            // Actualizar los valores en los elementos del DOM
            $("#efectivo").html('$ ' + parseFloat(response.efectivo).toLocaleString());
            $("#posnet").html('$ ' + parseFloat(response.posnet).toLocaleString());
            $("#transferencia").html('$ ' + parseFloat(response.transferencia).toLocaleString());

            // Crear el gráfico
            const data = [
                parseFloat(response.efectivo),
                parseFloat(response.posnet),
                parseFloat(response.transferencia)
            ];
            
            const options = {
                series: [{
                    name: "Medios de Pago",
                    data: data
                }],
                chart: {
                    type: "bar",
                    height: "100%",
                    toolbar: { show: false },
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: "55%",
                        endingShape: "rounded",
                    },
                },
                dataLabels: { enabled: false },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ["transparent"]
                },
                xaxis: {
                    categories: ["Efectivo", "Posnet", "Transferencia"]
                },
                yaxis: {
                    title: { text: "$ (monto)" }
                },
                fill: {
                    opacity: 1,
                    colors: ["#28a745", "#007bff", "#ff7700"]
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return "$ " + val.toLocaleString();
                        }
                    }
                }
            };
            
            // Limpiar y renderizar el nuevo gráfico
            const chartContainer = document.querySelector("#chart4");
            if (chartContainer.hasChildNodes()) {
                chartContainer.innerHTML = '';
            }
            const chart = new ApexCharts(chartContainer, options);
            chart.render();
        }
    })
    .catch((error) => {
        console.error("Error al obtener los datos:", error);
    });
}

function CalcularTotalCompras(idSucursal) {
    let desde = $("#desde").val();
    let hasta = $("#hasta").val();

    $.post(urlBase + 'ObtenerCompras', { desde, hasta, idSucursal })
        .then((response) => {
            try {
                // Si la respuesta es un string, conviértela en un objeto JSON
                response = JSON.parse(response);
                console.log(response);

                // Verificar que las claves correctas están presentes
                let compras = parseFloat(response.compras || 0).toFixed(2);
                let crecimiento = parseFloat(response.crecimiento || 0).toFixed(2);
                let compras_menos_1 = parseFloat(response.compras_menos_1 || 0).toFixed(2);
                let compras_menos_2 = parseFloat(response.compras_menos_2 || 0).toFixed(2);

                // Asignar los valores al HTML
                $("#total_compras").html('$ ' + compras);
                if (crecimiento > 0) {
                    $("#crecimiento_mes_anterior_compras").html('+' + crecimiento + '%' + '<i class="bi bi-arrow-up"></i>');
                } else {
                    $("#crecimiento_mes_anterior_compras").html(crecimiento + '%' + '<i class="bi bi-arrow-down"></i>');
                }

                let array = [compras_menos_2, compras_menos_1, compras];

                var options = {
                    series: [{
                        name: "Compras",
                        data: array
                    }],
                    chart: {
                        type: "line",
                        height: 40,
                        toolbar: { show: false },
                        zoom: { enabled: false },
                        sparkline: { enabled: true }
                    },
                    markers: { size: 0 },
                    stroke: { show: true, width: 2.5, curve: "smooth" },
                    tooltip: { theme: "dark" },
                    colors: ["#e72e7a"],
                    xaxis: { categories: ["Hace 2 meses", "Mes anterior", "Este mes"] },
                    fill: { opacity: 1 }
                };

                // Reemplazar el contenido del gráfico si ya existe
                if (document.querySelector("#chart5").hasChildNodes()) {
                    document.querySelector("#chart5").innerHTML = '';
                }

                var chart = new ApexCharts(document.querySelector("#chart5"), options);
                chart.render();
            } catch (e) {
                console.error("Error procesando la respuesta del servidor: ", e);
            }
        })
        .catch((error) => {
            console.error("Error en la solicitud AJAX:", error);
        });
}

function CalcularTotalVentas(idSucursal) {
    let desde = $("#desde").val();
    let hasta = $("#hasta").val();

    $.post(urlBase + 'ObtenerVentas', { desde, hasta, idSucursal })
        .then((response) => {
            try {
                // Si la respuesta es un string, conviértela en un objeto JSON
                response = JSON.parse(response);
                console.log(response);

                // Verificar que las claves correctas están presentes
                let monto_ventas = parseFloat(response.ventas || 0).toFixed(2);
                let crecimiento = parseFloat(response.crecimiento || 0).toFixed(2);
                let monto_ventas_menos_1 = parseFloat(response.ventas_menos_1 || 0).toFixed(2);
                let monto_ventas_menos_2 = parseFloat(response.ventas_menos_2 || 0).toFixed(2);

                // Asignar los valores al HTML
                $("#total_ventas").html('$ ' + monto_ventas);
                if (crecimiento > 0) {
                    $("#crecimiento_mes_anterior_ventas").html('+' + crecimiento + '%' + '<i class="bi bi-arrow-up"></i>');
                } else {
                    $("#crecimiento_mes_anterior_ventas").html(crecimiento + '%' + '<i class="bi bi-arrow-down"></i>');
                }

                // Preparar los datos para el gráfico
                let array = [monto_ventas_menos_2, monto_ventas_menos_1, monto_ventas];

                var options = {
                    series: [{
                        name: "Ventas Facturadas",
                        data: array
                    }],
                    chart: {
                        type: "line",
                        height: 40,
                        toolbar: { show: false },
                        zoom: { enabled: false },
                        dropShadow: {
                            enabled: false,
                            top: 3,
                            left: 14,
                            blur: 4,
                            opacity: 0.12,
                            color: "#e72e7a"
                        },
                        sparkline: { enabled: true }
                    },
                    markers: {
                        size: 0,
                        colors: ["#e72e7a"],
                        strokeColors: "#fff",
                        strokeWidth: 2,
                        hover: { size: 7 }
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: "35%",
                            endingShape: "rounded"
                        }
                    },
                    dataLabels: { enabled: false },
                    stroke: {
                        show: true,
                        width: 2.5,
                        curve: "smooth"
                    },
                    tooltip: {
                        theme: "dark",
                        fixed: { enabled: false },
                        x: { show: false },
                        y: {
                            title: {
                                formatter: function () {
                                    return "";
                                }
                            }
                        },
                        marker: { show: false }
                    },
                    colors: ["#fff"],
                    xaxis: {
                        categories: ["Hace 2 meses", "Mes anterior", "Este mes"]
                    },
                    fill: { opacity: 1 }
                };

                // Reemplazar el contenido del gráfico si ya existe
                if (document.querySelector("#chart6").hasChildNodes()) {
                    document.querySelector("#chart6").innerHTML = '';
                }

                var chart = new ApexCharts(document.querySelector("#chart6"), options);
                chart.render();
            } catch (e) {
                console.error("Error procesando la respuesta del servidor: ", e);
            }
        })
        .catch((error) => {
            console.error("Error en la solicitud AJAX:", error);
        });
}

function formatearMonto(monto) {
    return Number(monto).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function CalcularComprasBlanco(idSucursal) {
    let desde = $("#desde").val();
    let hasta = $("#hasta").val();
    $.post(urlBase+'ObtenerComprasBlanco', {desde, hasta, idSucursal})
    .then((response) => {
        if (response) {
            response = JSON.parse(response);
            $("#monto_compras_blanco").html('$ ' + formatearMonto(response.blanco || 0));
        }
    });
}

function CalcularComprasNegro(idSucursal) {
    let desde = $("#desde").val();
    let hasta = $("#hasta").val();
    $.post(urlBase+'ObtenerComprasNegro', {desde, hasta, idSucursal})
    .then((response) => {
        if (response) {
            response = JSON.parse(response);
            $("#monto_compras_negro").html('$ ' + formatearMonto(response.negro || 0));
        }
    });
}
function ObtenerPatrimonio(idSucursal) {
    let desde = $("#desde").val();
    let hasta = $("#hasta").val();

    $.post(urlBase + 'ObtenerPatrimonio', { desde, hasta })
        .then((response) => {
            let tbody = $("#patrimonio");
            tbody.empty(); // Limpiar la tabla antes de llenarla

            let totalDeposito = 0;
            let totalBBPS = 0;
            let totalCentro = 0;
            let totalGeneral = 0;

            JSON.parse(response).forEach((item) => {
                let row = $("<tr>");

                let deposito = Number(item.deposito) || 0;
                let bbps = Number(item.bbps) || 0;
                let centro = Number(item.centro) || 0;
                let total = deposito + bbps + centro;

                // Acumulando totales
                totalDeposito += deposito;
                totalBBPS += bbps;
                totalCentro += centro;
                totalGeneral += total;

                row.append(`<td>${item.nombre_proveedor || 'No disponible'}</td>`);
                row.append(`<td>${formatearMonto(deposito)}</td>`);
                row.append(`<td>${formatearMonto(bbps)}</td>`);
                row.append(`<td>${formatearMonto(centro)}</td>`);
                row.append(`<td>${formatearMonto(total)}</td>`);

                tbody.append(row);
            });

            // Agregar fila de total por sucursal
            let totalRow = $("<tr>").css("font-weight", "bold");
            totalRow.append(`<td>Total por sucursal</td>`);
            totalRow.append(`<td>${formatearMonto(totalDeposito)}</td>`);
            totalRow.append(`<td>${formatearMonto(totalBBPS)}</td>`);
            totalRow.append(`<td>${formatearMonto(totalCentro)}</td>`);
            totalRow.append(`<td>${formatearMonto(totalGeneral)}</td>`);

            tbody.append(totalRow);
        })
        .catch((error) => {
            console.error("Error al obtener patrimonio:", error);
        });
}

