console.log(document.forms.formPublicacion.texto.value);



document.querySelector('#formPublicacion').addEventListener('submit', function (e) {
    console.log(e);
    e.preventDefault();
    //alert("hola");
    let publicacion = {
        texto: document.forms.formPublicacion.texto.value
    };

    console.log(publicacion);
    fetch('/post', {
        method: "POST",
        body: JSON.stringify(publicacion),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(response =>{
        alert("publicacion ingresada con exito!");
        publicaciones(); //METODO A DEFINIR PARA INSERTAR PUBLICACIONES CON AJAX
    }).catch(err =>{
        alert("no se ha podido insetar la publicacion");
        console.log(err);
    });


    
});

//FUNCION PARA AGREGAR PUBLICACIONES AJAX
function publicaciones(){
    fetch('/post',{
        method: "GET"
    }).then(res=>res.json()).then(data => {
        let posts = "";
        data.forEach(element =>{
            posts = posts + `<div class="card mb-2">
            <div class="card-body p-2">
                <!-- Información personal de la publicación -->
                <div class="d-flex">
                    <div class="pl-1">
                        <a href="#">
                            <img class="rounded-circle" src="https://s.gravatar.com/avatar/47dc454dc555e624caf972e9ecb3a67c?s=45">
                        </a>
                    </div>
                    <div class="flex-align-center px-2">
                        <h6 class="card-title mb-0">
                            <a href="#" class="text-dark font-weight-bold">Fernando Anstirman</a>
                        </h6>
                        <p class="card-subtitle"><small class="text-muted">Last updated 3 mins ago</small></p>
                    </div>
                    <div class="ml-auto">
                        <div class="dropdown flex-end">
                            <i class="fas fa-ellipsis-h btn" id="publication-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="publication-1">
                                <a class="dropdown-item" href="#">Editar publicación</a>
                                <a class="dropdown-item" href="#">Eliminar publicación</a>
                                <a class="dropdown-item" href="#">Copiar enlace de publicación</a>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Fin de la información personal -->
                <!-- Texto -->
                <p class="card-text my-1">${element.text}</p>
                <!-- Footer -->
                <div class="d-flex btn-group w-100" role="group" aria-label="post-action">
                    <button type="button" class="btn btn-outline-success btn-sm flex-fill"><i class="fas fa-paw"></i> <span class="d-none d-sm-inline d-md-none d-xl-inline">Me empeluda</span> <span class="badge badge-light">20</span></button>
                    <button type="button" class="btn btn-outline-success btn-sm flex-fill" data-toggle="collapse" data-target="#collapse-comment" aria-expanded="false" aria-controls="collapse-comment"><i class="far fa-comment"></i> <span class="d-none d-sm-inline d-md-none d-xl-inline">Comentar</span>
                        <span class="badge badge-light">20</span></button>
                    <button type="button" class="btn btn-outline-success btn-sm flex-fill" data-toggle="modal" data-target="#share-publication"><i class="fas fa-share"></i> <span class="d-none d-sm-inline d-md-none d-xl-inline">Compartir</span> <span
                        class="badge badge-light">20</span></button>
                    <button type="button" class="btn btn-outline-success btn-sm flex-fill" data-toggle="modal" data-target="#send-private-message"><i class="fas fa-envelope"></i> <span class="d-none d-sm-inline d-md-none d-xl-inline">Mensaje directo</span> </button>
                </div>
        
                <div class="collapse" id="collapse-comment">
                    <div class="card card-body border-0 py-2 px-0">
                        <form class="form-inline">
                            <div class="">
                                <a href="#">
                                    <img class="rounded-circle" src="https://s.gravatar.com/avatar/47dc454dc555e624caf972e9ecb3a67c?s=35">
                                </a>
                            </div>
                            <div class="form-group flex-grow-1 mx-2 my-0">
                                <textarea class="form-control form-control-sm w-100 js-auto-size" id="comment-box" rows="1" placeholder="Escribe un comentario..."></textarea>
                            </div>
                            <button type="submit" class="btn btn-outline-success btn-sm">Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>`
        });
        document.querySelector('#espacioPublicaciones').innerHTML = `<div class="card mb-2">
        <div class="card-body py-2 px-3">
            <form id="formPublicacion" name="formPublicacion" method="post">
                <div class="d-flex">
                    <div class="">
                        <a href="#">
                            <img class="rounded-circle" src="https://s.gravatar.com/avatar/47dc454dc555e624caf972e9ecb3a67c?s=35" style="height: 45px; width: 45px; ">
                        </a>
                    </div>
                    <div class="flex-align-center pl-2 pr-0 flex-fill">
                        <input type="text" id="texto" name="texto" placeholder="escribe un comentario...">
                    </div>
                </div>
                <div class="collapse my-2" id="upload-image">
                    <div class="card card-body">
                        <div class="file-loading">
                            <input id="input-20" type="file">
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-end my-2">
                    <a class="px-3" data-toggle="collapse" href="#upload-image" role="button" aria-expanded="false"
                        aria-controls="upload-image" style="font-size:1.5rem;"><i class="fas fa-image text-success"></i></a>
                    <input type="submit" id="add-post" class="btn btn-outline-success text-align-center px-3" value="Publicar">
                </div>
            </form>
        </div>
    </div>` + posts;
    })
}

