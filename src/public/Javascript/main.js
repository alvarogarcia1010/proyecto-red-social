function enableAll()
{
	$('#main-content').removeAttr('disabled');
}

function disabledAll()
{
	$('#main-content').attr('disabled','disabled');
}

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
				error: function (jqXHR, textStatus, errorThrown)
				{
					alertify.error('Ocurrio un error en su petición');
					$('#app-loader').addClass('d-none');
					enableAll();
				},
				beforeSend:function()
				{
					$('#app-loader').removeClass('d-none');
					disabledAll();
				},
        success: function( response ) {
            mainContainer = response.split("<!-- mainContainer -->");
            $('#main-content').html(mainContainer[1]);
						$('#app-loader').addClass('d-none');
						enableAll();
        }
    });
}


$(document).ready(function()
{
	var urlCounters = "/api/users/counters/" + $("#aup-username").attr("data-id");
	var imgProfile;
	var page = 2;
	imgProfile = $("#img-profile").attr('src');

	if($("#aup-username").attr("data-id") !== undefined){

		$.ajax({
			url: urlCounters,
			type: "GET",
			dataType: "json",

			error: function (jqXHR, textStatus, errorThrown)
			{
				alertify.error('Ocurrio un error en su petición');
				$('#app-loader').addClass('d-none');
				enableAll();
			},
			beforeSend:function()
			{
				$('#app-loader').removeClass('d-none');
				disabledAll();
			},

			success: function(response){
					console.log(response.siguiendo);
					console.log(response.seguidores);
					$('#app-loader').addClass('d-none');
					enableAll();
			}
		});
	}

	$("#update-statistics").click(()=>{
		$("#role-user").text("10");
		$("#role-admin").text("3");
		$("#count-publications").text("100");
		$("#count-me-empeluda").text("10");
	});

	$("#update-users").click(()=>{
		$.ajax({
			url: "api/users",
			type: "GET",
			dataType: "json",
			error: function (jqXHR, textStatus, errorThrown)
			{
				alertify.success('Ocurrio un error en su petición');
				$('#app-loader').addClass('d-none');
				enableAll();
			},
			beforeSend:function()
			{
				$('#app-loader').removeClass('d-none');
				disabledAll();
			},

			success: function(response){
					console.log(response.users);
					$('#app-loader').addClass('d-none');
					enableAll();
			}

		});
	});

    console.log(urlCounters);
    $('#send-mail-recover-pass').on('click',function(e){
        e.preventDefault();
        $.ajax({
            url: '/forgot',
            type: "POST",
            dataType: "json",
            data: {email: $('#email').val()},

            error: function (jqXHR, textStatus, errorThrown)
            {
              alertify.success('Ocurrio un error en su petición');
            },
            beforeSend:function()
            {
              $('#app-loader').removeClass('d-none');
              disabledAll();
            },

            success: function(response){
                //alertify.alert("Mensaje enviado con éxito. Favor revise su correo.", function(){alertify.message('OK');});
                $('#recoverPass').modal('hide');
                alertify.success('Mensaje Enviado. Favor revise su correo.');
                // console.log(response);
                $('#app-loader').addClass('d-none');
                enableAll();
            }
        });
    });

		$("#aup-refresh-suggestions").on("click", function(e){
			e.preventDefault();
			var pageRef = $(this).attr('href') +page;
			$.ajax({
					url: pageRef,
					type: "GET",
					dataType: "json",

					error: function (jqXHR, textStatus, errorThrown)
					{
						alertify.success('Ocurrio un error en su petición');
					},
					beforeSend:function()
					{
						$('#app-loader').removeClass('d-none');
						disabledAll();
					},
					success: function(response){
							//alertify.alert("Mensaje enviado con éxito. Favor revise su correo.", function(){alertify.message('OK');});
							var newUsers = "";
							if(page < response.pages){
								page++;
							}else{
								page = 1;
							}

							response.users.forEach(user => {
								newUsers+= `<li class="list-group-item p-2">
															<div class="d-flex m-1">
													    <div class="flex-align-center pr-2">
													      <a href="/${user.username}">
													        <img class="rounded-circle" src="${user.urlImage}" style="width: 45px; height: 45px;">
													      </a>
													    </div>
													    <div class="flex-align-center px-2">
													      <a href="/${user.username}" class="card-link text-dark font-weight-bold"> ${user.name}  ${user.surname}</a>
													      <p class="m-0 text-muted username" >${user.username}</p>
													    </div>
													    <div class="flex-align-center ml-auto">
													      <button type="button" class="btn btn-outline-success seguir" data-id="${user._id}">Seguir</button>
													    </div>
														</div>
													 </li>`
							});
							console.log(newUsers)
							$("#aup-list-suggestions").html(newUsers)
							$('#app-loader').addClass('d-none');
							enableAll();
					}
			});
		})
		console.log(imgProfile);

		$("#form-upload-picture").submit(function(evt){
			 evt.preventDefault();
				var logoImg = $('input[name="file"]').get(0).files[0];
				var formData = new FormData();
				formData.append('file', logoImg);
			$.ajax({
					url: 'file/upload-image',
					type: 'POST',
					data: formData,
					async: false,
					cache: false,
					contentType: false,
					enctype: 'multipart/form-data',
					processData: false,
					success: function (response) {
						alertify.success("Perfil actualizado con exito, favor refresque la pantalla");
					}
			});
		return false;
	});


    $('#aup-home').on('click', function(e){
        e.preventDefault();
        var pageRef = $(this).attr('href');
        callToPage(pageRef);
				$('#aup-home').parent().addClass('active');
				$('#aup-profile').parent().removeClass('active');
				$('#aup-messages').parent().removeClass('active');

        history.pushState(null, "", "home");
    });

    $('#aup-profile').on('click', function(e){
        e.preventDefault();
        var pageRef = $(this).attr('href');
        callToPage(pageRef);
				$('#aup-profile').parent().addClass('active');
				$('#aup-home').parent().removeClass('active');
				$('#aup-messages').parent().removeClass('active');
        history.pushState(null, "", pageRef);
    });

    $('#aup-notification').on('click', function(e){
        e.preventDefault();
        var pageRef = $(this).attr('href');
        callToPage(pageRef);
        history.pushState(null, "", "notifications");
    });

    $('#aup-messages').on('click', function(e){
        e.preventDefault();
        var pageRef = $(this).attr('href');
        callToPage(pageRef);
				$('#aup-messages').parent().addClass('active');
				$('#aup-profile').parent().removeClass('active');
				$('#aup-home').parent().removeClass('active');
        history.pushState(null, "", "messages");
    });

    $('#aup-config').on('click', function(e){
        e.preventDefault();
        var pageRef = $(this).attr('href');
        callToPage(pageRef);
				$('#aup-home').parent().removeClass('active');
				$('#aup-profile').parent().removeClass('active');
				$('#aup-messages').parent().removeClass('active');
        history.pushState(null, "", "config");

    });

    $('#aup-dashboard').on('click', function(e){
        e.preventDefault();
        var pageRef = $(this).attr('href');
        callToPage(pageRef);
				$('#aup-home').parent().removeClass('active');
				$('#aup-profile').parent().removeClass('active');
				$('#aup-messages').parent().removeClass('active');
        history.pushState(null, "", "dashboard");

	});
	
	$('body').on('click','#btn-update-profile', function(e){
        e.preventDefault();
        $.ajax({
            url: '/api/update-user',
            type: 'put',
            dataType: 'json',
            data: {name: $('#name').val(), surname: $('#surname').val(), 
                    username: $('#username').val(), fecha_nacimiento: $('#datepicker').val(), 
                    pais: $('#pais').val(), sobre_mi: $('#sobremi').val()},

            success: function(response){
                console.log(response);
                alertify.success('Perfil actualizado');
                $('#name').val('');
                $('#surname').val('');
                $('#username').val('');
                $('#sobremi').val('');  
            }
        })
    });


		$('#datepicker').datepicker({
				uiLibrary: 'bootstrap4'
		});
    //console.log("ready from dashboard!");
    //$('#user-register').DataTable();
    $('body').on('click','#boton-password-confirm', function(e){
        e.preventDefault();
        $.ajax({
            url: '/config',
            type: "POST",
            dataType: "json",
            data: {password: $('#password').val()},

            success: function(response){
                console.log(response);
                alertify.success('Contraseña actualizada');
                $('#password-actual').val('');
                $('#password').val('');
                $('#password-nuevo-confirm').val('');
            }
        });
    });

    $("#input-20").fileinput({
        browseClass: "btn btn-primary",
        showCaption: false,
        showRemove: false,
        showUpload: true
    });

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
        defaultPreviewContent: `<img src="${imgProfile}" alt="Your Avatar" style="height:125px">`,
        layoutTemplates: { main2: '{preview} ' + btnCust + ' {remove} {browse}' },
        allowedFileExtensions: ["jpg", "png", "gif"]
    });


			// console.log($("button.seguir"));
			// $("button.seguir").on("click", function(e){
			// 	e.preventDefault();
			// 	$.ajax({
			// 			url: 'api/follow/' + $("p.username").attr("data-id"),
			// 			type: "POST",
			// 			dataType: "json",
			//
			// 			error: function (jqXHR, textStatus, errorThrown)
			// 			{
			// 				alertify.success('Ocurrio un error en su petición');
			// 			},
			// 			success: function(response){
			// 					console.log(response);
			// 					$("btn.seguir").removeClass("btn-outline-success");
			// 					$("btn.seguir").removeClass("btn-success");
			// 					$("btn.seguir").val("Siguiendo");
			// 			}
			// 	});
			// });


});

setTimeout(function(){
    $('#login-error-alert').alert('close');
    $('#signup-error-alert').alert('close');
}, 5000);
