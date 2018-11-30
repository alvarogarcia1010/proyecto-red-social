$(document).ready(function () {
    console.log("ready!");

    //CODE TU MAKE TABLES WORK///////////////
    //$('#myTable').DataTable();
    ////////////////////////////////////

    /////////////codigo para validar formularios//////////////////

    /////////////////////////////////////////////////////////////


    var btnCust = '<button type="button" class="btn btn-secondary" title="Add picture tags" ' +
        'onclick="alert(\'Call your custom code here.\')">' +
        '<i class="fas fa-user"></i>' +
        '</button>';
    $("#avatar-1").fileinput({
        theme: "fas",
        //autoOrientImage: false,
        overwriteInitial: true,
        showUpload: true,
        maxFileSize: 1500,
        showClose: false,
        showCaption: false,
        browseLabel: '',
        removeLabel: '',
        browseIcon: '<i class="fas fa-folder-open"></i>',
        removeIcon: '<i class="fas fa-trash-alt"></i>',
        removeTitle: 'Cancel or reset changes',
        elErrorContainer: '#kv-avatar-errors-1',
        msgErrorClass: 'alert alert-block alert-danger',
        defaultPreviewContent: '<img src="https://s.gravatar.com/avatar/31e81597c7a59321931c6a76324c13fd?s=100" alt="Your Avatar">',
        layoutTemplates: { main2: '{preview} ' + btnCust + ' {remove} {browse}' },
        allowedFileExtensions: ["jpg", "png", "gif"]
    });

});


//SCRIPT PARA LA VALIDACION DE FORMULARIOS
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);


    //validacion para el username
    var botonUsername= document.getElementById('boton-cambiar-username');
    botonUsername.onclick= validarUsername;
    var newUsername = document.getElementById('nuevo-username');
    var regExp = /(@\w{1,15})/;

    function validarUsername() {
        if (regExp.test(newUsername.value) === false) {
            newUsername.setCustomValidity("este username no es valido");
            alert("El nuevo username debe empezar con una arroba(@)")
            return false;
        } else {
            newUsername.setCustomValidity('');
        }
    }

    //validacion para confirmar password
    var botonPassword = document.getElementById('boton-password-confirm');
    var password = document.getElementById('password-nuevo');
    var passwordConfirm = document.getElementById('password-nuevo-confirm');

    var regex = /\w{6,}/;

    function validarPassword(){
        if(regex.test(password.value)===false){
            alert("el password debe contener minimo 6 caracteres");
            return false;
        }
        if(password.value != passwordConfirm.value){
            alert("asegurese de que la password que escribio sea la misma")
            return false;
        }else{
            passwordConfirm.setCustomValidity('');
        }
    }

    botonPassword.onclick = validarPassword;

})();

