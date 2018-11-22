
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


    $('#aup-profile').click(function()
    {
        console.log('presione ir al perfil');
        $.ajax(    
        {
            url: "/dashboard",
            type: "GET",
            dataType: "text/html",

            success: function( response ) {
                console.log('the page was loaded', response);
            },
            success: function( error ) {
                console.log('the page was NOT loaded', error);
            },
            success: function( error ) {
                console.log('the page was NOT loaded', error);
            },

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

});

setTimeout(function(){
    $('#login-error-alert').alert('close');
    $('#signup-error-alert').alert('close');
}, 5000);