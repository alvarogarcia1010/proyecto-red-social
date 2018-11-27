var newUsername = document.getElementById('nuevo-username');
var regExp = /([a-z0-9_]{1,15})/;

function validarUsername(){
    if(regExp.test(newUsername.value)===false){
        newUsername.setCustomValidity("este username no es valido")
    }else{
        newUsername.setCustomValidity('');
    }
}

newUsername.onchange = validarUsername;

