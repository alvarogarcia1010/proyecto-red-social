
$(document).ready(function()
{
    console.log('i am ready')

    function isEmpty()
    {
        if(this.is("select"))
        {
            return this.val() == "";
        }
        else
        {
            return $.trim(this.val()) == "";
        }
    };

    function callToDashboard(pageRefInput){
        $.ajax(    
        {
            url: pageRefInput,
            type: "GET",
           dataType: "text",

            success: function( response ) {
                hoola = response.split("<!-- mainContainer -->");
                console.log(hoola[1]);
                $('#main-content').html(hoola[1]);
                
            }
            /*success: function( error ) {
                console.log('the page was NOT loaded', error);
            },
            success: function( error ) {
                console.log('the page was NOT loaded', error);
            },*/
        });
    }


    $('#aup-profile').on('click', function(e){
        e.preventDefault();
        console.log('presione ir al perfil');
        var pageRef = $(this).attr('href');
        console.log(pageRef);
        callToDashboard(pageRef);
        history.pushState(null, "", "profile");

    });

    $('#aup-notification').on('click', function(e){
        e.preventDefault();
        console.log('presione ir al notificaciones');
        var pageRef = $(this).attr('href');
        console.log(pageRef);
        callToDashboard(pageRef);
        history.pushState(null, "", "notificaciones");

    });

    $('#aup-messages').on('click', function(e){
        e.preventDefault();
        console.log('presione ir al mensajes');
        var pageRef = $(this).attr('href');
        console.log(pageRef);
        callToDashboard(pageRef);
        history.pushState(null, "", "mensajes");

    });

    $('#aup-config').on('click', function(e){
        e.preventDefault();
        console.log('presione ir al config');
        var pageRef = $(this).attr('href');
        console.log(pageRef);
        callToDashboard(pageRef);
        history.pushState(null, "", "configuraciones");

    });

    $('#aup-dashboard').on('click', function(e){
        e.preventDefault();
        console.log('presione ir al dashboard');
        var pageRef = $(this).attr('href');
        console.log(pageRef);
        callToDashboard(pageRef);
        history.pushState(null, "", "dashboard");

    });

    console.log("ready from dashboard!");
    $('#user-register').DataTable();
    
});

setTimeout(function(){
    $('#login-error-alert').alert('close');
    $('#signup-error-alert').alert('close');
}, 5000);