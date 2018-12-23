publicaciones();



document.querySelector('#formPublicacion').addEventListener('submit', function (e) {
    e.preventDefault();
    console.log(e);

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
        //alert("publicacion ingresada con exito!");
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
                            <img class="rounded-circle" src="/${element.user_Id.urlImage}" style="height:45px;width:45px;">
                        </a>
                    </div>
                    <div class="flex-align-center px-2">
                        <h6 class="card-title mb-0">
                            <a href="#" class="text-dark font-weight-bold">${element.user_Id.username}</a>
                        </h6>
                        <p class="card-subtitle"><small class="text-muted">${element.created_at}</small></p>
                    </div>
                    <div class="ml-auto">
                        <div class="dropdown flex-end">
                            <i class="fas fa-ellipsis-h btn" id="publication-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="publication-1">
                                <a id="eliminar" class="dropdown-item" href="/post/${element._id}">Eliminar publicación</a>
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
                                    <img class="rounded-circle" src="/${element.user_Id.urlImage}">
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
        document.querySelector('#espacioPublicaciones').innerHTML = posts;
        document.querySelector('#texto').value="";
        //funcion para borrar una publicacion
        let btnEliminar = document.querySelectorAll('#eliminar');
        console.log(btnEliminar);
        btnEliminar.forEach(boton=>{
            boton.addEventListener("click",function(e){
                e.preventDefault();
                let url = this["href"];
                fetch(
                    url,
                    {
                    method:"DELETE"
                }).then(res=>res.json()).then(response=>{
                    alert("la publicacion ha sido borrada con exito!");
                    publicaciones();
                }).catch(err=>{
                    //res.json("hubo un error al eliminar la publicacion");
                    console.log(err);
                });
            });
        })
    })
}
