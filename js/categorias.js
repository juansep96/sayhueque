const obtenerCategoriasWC = async () => {
    let categorias = [];
    let url = 'https://sayhuequebb.com.ar/wp-json/wc/v3/products/categories';
    let page = 1;
    let perPage = 100; // Obtén hasta 100 categorías por solicitud

    // Utilizamos un ciclo para obtener todas las categorías en caso de que haya más de 100
    while (true) {
        const response = await new Promise((resolve) => {
            $.ajax({
                type: 'GET',
                url: url,
                data: { per_page: perPage, page: page },
                crossDomain: true,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(unescape(encodeURIComponent('ck_bb21e836cc4c1900d34c271c9d55a58011cce981' + ':' + 'cs_8734c2752e0af5eab31ce996369d555265f1d400'))));
                },
                success: function(d) {
                    resolve(d);
                }
            });
        });

        if (response.length === 0) {
            // Si no hay más categorías, salimos del ciclo
            break;
        }

        // Agregamos las categorías de la página actual a la lista
        categorias = categorias.concat(response);

        // Si la respuesta contiene menos de 100 categorías, hemos obtenido todas
        if (response.length < perPage) {
            break;
        }

        // Si no, aumentamos la página para obtener las siguientes categorías
        page++;
    }

    return categorias;
}


const nuevaCategoriaWC = async (categoria) => {
    url = 'https://sayhuequebb.com.ar/wp-json/wc/v3/products/categories';
    return new Promise((resolve) => {
        $.ajax({
            type: 'POST',
            async: false,
            url: url,
            data: categoria,
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

const actualizarCategoriaWC = async (idCategoria,data) => {
    url = 'https://sayhuequebb.com.ar/wp-json/wc/v3/products/categories/'+idCategoria;
    return new Promise((resolve) => {
        $.ajax({
            type: 'PUT',
            async: false,
            url: url,
            data: data,
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

const eliminarCategoriaWC = async (categoria) => {
    url = 'https://sayhuequebb.com.ar/wp-json/wc/v3/products/categories/'+categoria+'?force=true';
    return new Promise((resolve) => {
        $.ajax({
            type: 'DELETE',
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

const obtenerCategoriaWC = async (categoria) => {
    url = 'https://sayhuequebb.com.ar/wp-json/wc/v3/products/categories/'+categoria;
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


const ObtenerCategorias = async () => {
    $(".filaCategorias").remove();
    data = await obtenerCategoriasWC();
    padres = data.filter((el) => el.parent == 0);
    hijos = data.filter((el) => el.parent != 0);
    opcion = "<option value=''></option>";
    opcion2 = "<option value='0'>SIN PADRE</option>";
    $("#padre").prepend(opcion);
    $("#padre_edit").append(opcion2);
        if(data.length>0){
            padres.forEach((e)=> {
                opcion = "<option value='"+e.id+"'>"+e.name+"</option>";
                $("#padre").append(opcion);
                $("#padre_edit").append(opcion);
                acciones = '<div class="d-flex align-items-center gap-3 fs-6"><div class="eliminar"><i class="bi bi-trash-fill"></i></div></div>';
                if(e.id!=76){
                    acciones =  '<div class="d-flex align-items-center gap-3 fs-6"><div class="export"><a href="javascript:;" onclick="EditarCategoria('+e.id+')" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit info" aria-label="Editar"><i class="bi bi-pencil-fill"></i></a></div>';
                    acciones = acciones + '<div class="eliminar"><a href="javascript:;" onclick="EliminarCategoria('+e.id+');" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-trash-fill"></i></a> </div></div>';
                }
                //Esto lo hizo Danilo
                htmlTags = '<tr class="filaCategorias">' +
                            '<td class="text-left" style="text-align: left !important"> '+e.name.toUpperCase()+'</td>'+
                            '<td class="text-left">'+acciones+'</td>'+
                                '</tr>';
                $('#categorias tbody').append(htmlTags);
                hijosListado = hijos.filter((el) => el.parent == e.id);
                hijosListado.forEach((f)=> {
                    opcion = "<option value='"+f.id+"'>"+f.name+"</option>";
                    $("#padre").append(opcion);
                    $("#padre_edit").append(opcion);
                    acciones2 = '<div class="d-flex align-items-center gap-3 fs-6"><div class="export"><a href="javascript:;" onclick="EditarCategoria('+f.id+')" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit info" aria-label="Editar"><i class="bi bi-pencil-fill"></i></a></div>';
                    acciones2 = acciones2 + '<div class="eliminar"><a href="javascript:;" onclick="EliminarCategoria('+f.id+');" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-trash-fill"></i></a> </div></div>';
                    htmlTags = '<tr class="filaCategorias">' +
                                    '<td class="text-left" style="text-align: left !important">  &nbsp;&nbsp;&nbsp;&nbsp; ⮕  &nbsp;&nbsp;&nbsp;&nbsp; '+f.name.toUpperCase()+'</td>'+
                                    '<td class="text-left">'+acciones2+'</td>'+
                                    '</tr>';
                    $('#categorias tbody').append(htmlTags);
                    nietosListado = hijos.filter((fe) => fe.parent == f.id);
                    nietosListado.forEach((g)=> {
                        opcion = "<option value='"+g.id+"'>"+g.name+"</option>";
                        $("#padre").append(opcion);
                        $("#padre_edit").append(opcion);
                        acciones2 = '<div class="d-flex align-items-center gap-3 fs-6"><div class="export"><a href="javascript:;" onclick="EditarCategoria('+g.id+')" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit info" aria-label="Editar"><i class="bi bi-pencil-fill"></i></a></div>';
                        acciones2 =  acciones2 + '<div class="eliminar"><a href="javascript:;" onclick="EliminarCategoria('+g.id+');" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-trash-fill"></i></a> </div></div>';
                        htmlTags = '<tr class="filaCategorias">' +
                                        '<td class="text-left" style="text-align: left !important">  &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; ⮕  &nbsp;&nbsp;&nbsp;&nbsp; '+g.name.toUpperCase()+'</td>'+
                                        '<td class="text-left">'+acciones2+'</td>'+
                                        '</tr>';
                        $('#categorias tbody').append(htmlTags);
                        bisnietosListado = hijos.filter((fe) => fe.parent == g.id);
                        bisnietosListado.forEach((h)=> {
                            opcion = "<option value='"+h.id+"'>"+h.name+"</option>";
                            $("#padre").append(opcion);
                            $("#padre_edit").append(opcion);
                            acciones2 =  '<div class="d-flex align-items-center gap-3 fs-6"><div class="export"><a href="javascript:;" onclick="EditarCategoria('+h.id+')" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit info" aria-label="Editar"><i class="bi bi-pencil-fill"></i></a></div>';
                            acciones2 = acciones2 +'<div class="eliminar"><a href="javascript:;" onclick="EliminarCategoria('+h.id+');" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-trash-fill"></i></a> </div></div>';
                            htmlTags = '<tr class="filaCategorias">' +
                                            '<td class="text-left" style="text-align: left !important">  &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; ⮕  &nbsp;&nbsp;&nbsp;&nbsp;'+h.name.toUpperCase()+'</td>'+
                                            '<td class="text-left">'+acciones2+'</td>'+
                                            '</tr>';
                            $('#categorias tbody').append(htmlTags);
                        })
                    })
                })
            })
        }else{
            htmlTags = '<tr class="filaCategorias">' +
            '<td colspan="2">NO SE ENCONTRARON CATEGORIAS.</td>'+
            '</tr>';
        $('#categorias tbody').append(htmlTags);
        }
}

const InsertarNuevaCategoria = async () => {
    let categoria = $("#categoria").val();
    let padre = $("#padre").val();
    if(categoria){
        Lobibox.confirm({
            msg: "Seguro  que desea crear la categoria?",
            callback: async function ($this, type, ev) {
              if(type=="yes"){
                if(padre){
                    data = {
                        name:categoria,
                        parent : padre
                    }
                }else{
                    data = {
                        name:categoria
                    }
                }
               await nuevaCategoriaWC(data);
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-message-error',
                    msg: 'Categoria creada con éxito.',
                  });
                setTimeout(() => {
                    ObtenerCategorias();
                    $("#modalNuevaCategoria").modal('hide');
                    $("#categoria").val('');
                    $("#padre").val('');

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

const EliminarCategoria = async (idCategoria) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar la Categoria?",
        callback: async function ($this, type, ev) {
          if(type=="yes"){
            await eliminarCategoriaWC(idCategoria);
            Lobibox.notify('success', {
                pauseDelayOnHover: true,
                continueDelayOnInactiveTab: false,
                position: 'top right',
                icon: 'bx bx-message-error',
                msg: 'Categoria eliminada con éxito.',
              });
            setTimeout(() => {
                ObtenerCategorias();
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

const EditarCategoria = async (idCategoria)  =>{
    let data = await obtenerCategoriaWC(idCategoria);
    if(data){
        $("#padre_edit").val(data.parent);
        $("#categoria_edit").val(data.name);
        $("#idCategoria_edit").val(data.id);        
        $("#modalEditarCategoria").modal('show');
    }
}

const ActualizarCategoria = async () => {
    idPadre = $("#padre_edit").val();
    nombre = $("#categoria_edit").val();
    idCategoria = $("#idCategoria_edit").val();
    if(nombre && idCategoria){
        data = {
            name:nombre,
            parent : idPadre,
            id : idCategoria
        }
        await actualizarCategoriaWC(idCategoria,data);
        Lobibox.notify('success', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-message-error',
            msg: 'Categoria actualizada con éxito.',
          });
        setTimeout(() => {
            ObtenerCategorias();
            $("#modalEditarCategoria").modal('hide');
            $("#categoria_edit").val('');
            $("#padre_edit").val('');
        }, 1000);
    }else{
        Lobibox.notify('warning', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-message-error',
            msg: 'La categoria tiene que tener un nombre.',
          });
    }
}

