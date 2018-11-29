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

function callToPage(pageRefInput){
    $.ajax(    
    {
        url: pageRefInput,
        type: "GET",
        dataType: "text",

        success: function( response ) {
            mainContainer = response.split("<!-- mainContainer -->");
            $('#main-content').html(mainContainer[1]);
        }
    });
}


$(document).ready(function()
{
    console.log('i am ready');

    $('#aup-profile').on('click', function(e){
        e.preventDefault();
        var pageRef = $(this).attr('href');
        callToPage(pageRef);
        history.pushState(null, "", "profile");
    });

    $('#aup-notification').on('click', function(e){
        e.preventDefault();
        console.log('presione ir al notificaciones');
        var pageRef = $(this).attr('href');
        callToPage(pageRef);
        history.pushState(null, "", "notificaciones");
    });

    $('#aup-messages').on('click', function(e){
        e.preventDefault();
        console.log('presione ir al mensajes');
        var pageRef = $(this).attr('href');
        callToPage(pageRef);
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