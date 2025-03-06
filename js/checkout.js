$(document).ready(function(){
    $.post("./api/DestruirSesion")
    .then(()=>{
        setTimeout(()=>{
            window.location.replace("index.html");
        },2000)
    })   
});
