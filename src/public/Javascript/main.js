
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
                console.log("jnksnioas" + response);
                console.log('the page was loaded', response);
                $('#main-content').html(response);
                history.pushState(null, "", "dashboard");
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

    });

        // $.ajax(
        // {
        //     type: 'POST',
        //     data: JSON.stringify(data),
        //     dataType : 'json',
        //     url: url,
        //     error: function (jqXHR, textStatus, errorThrown)
        //     {
        //         handleServerExceptions(jqXHR, 'sale-cm-form');
        //     },
        //     beforeSend:function()
        //     {
        //         $('#app-loader').removeClass('hidden');
        //         disabledAll();
        //     },
        //     success:function(json)
        //     {
        //         if(json.success)
        //         {
        //             if($('#sale-cm-journals-section').attr('data-target-id') == '#sale-cm-form-section')
        //             {
        //                 $('#sale-cm-btn-close').click();
        //                 $('#sale-cm-btn-toolbar').showAlertAfterElement('alert-success alert-custom',json.success, 6000);
        //                 acctJmClientLabelArrayData = saleSomClientLabelArrayData = json.clients;
        //                 $('#acct-jm-client-label, #sale-som-client-label').autocomplete('option', 'source', json.clients);
        //             }
        //             else
        //             {
        //                 // $('#sale-cm-form').showAlertAsFirstChild('alert-success', json.info);
        //             }
        //         }
        //         else if(json.info)
        //         {
        //             if($('#sale-cm-journals-section').attr('data-target-id') == '#sale-cm-form-section')
        //             {
        //                 $('#sale-cm-form').showAlertAsFirstChild('alert-info', json.info);
        //             }
        //             else
        //             {
        //                 // $('#sale-cm-form').showAlertAsFirstChild('alert-info', json.info);
        //             }
        //         }
        //         $('#app-loader').addClass('hidden');
        //         enableAll();
        //     }
        // });

});

setTimeout(function(){
    $('#login-error-alert').alert('close');
    $('#signup-error-alert').alert('close');
}, 5000);