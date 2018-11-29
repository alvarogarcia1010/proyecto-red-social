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
        var pageRef = $(this).attr('href');
        history.pushState(null, "", "notifications");
    });

    $('#aup-messages').on('click', function(e){
        e.preventDefault();
        var pageRef = $(this).attr('href');
        history.pushState(null, "", "messages");
    });

    $('#aup-config').on('click', function(e){
        e.preventDefault();
        var pageRef = $(this).attr('href');
        callToDashboard(pageRef);
        history.pushState(null, "", "config");

    });

    $('#aup-dashboard').on('click', function(e){
        e.preventDefault();
        var pageRef = $(this).attr('href');
        callToDashboard(pageRef);
        history.pushState(null, "", "dashboard");

    });

    console.log("ready from dashboard!");
    $('#user-register').DataTable();
    

    /*$("#input-20").fileinput({
        browseClass: "btn btn-primary btn-block",
        showCaption: false,
        showRemove: false,
        showUpload: false
    });*/
    

});

setTimeout(function(){
    $('#login-error-alert').alert('close');
    $('#signup-error-alert').alert('close');
}, 5000);
