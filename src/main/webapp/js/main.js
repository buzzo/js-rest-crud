$(document).ready(function() {

	// table
	$("#table").webix_datatable({
	    columns : [ {
			id : "code",
			header : [ "Codigo",{content:"textFilter"}], 
			sort:"string"
		}, {
			id : "badge",
			header : [ "Matricula",{content:"textFilter"}], 
			sort:"string"
		}, {
			id : "name",
			header : [ "Nome",{content:"textFilter"}], 
			sort:"string"
		}, {
			id : "position",
			header : [ "Cargo",{content:"textFilter"}], 
			sort:"string"
		} ],
		autoheight : true,
		autowidth : true,
		url : "http://localhost:8180/resteasy/rest/employer"
	});

	// open modal
	$('.ui.button').on('click', function() {
		$('.ui.modal').modal('show');
	});

	// hide the messages
	$('.ui.message').hide();

	// hide message box when click over the X
	$('#message-close').on('click', function() {
		$('.ui.message').hide('slow');
	});

	// close modal
	$('.ui.button.negative').on('click', function() {
		$('.ui.modal').modal('hide');
		// reset modal form
		$('#form').trigger('reset');
	});

	// initialize checkbox
	$('.ui.checkbox').checkbox();

	// form validation
	$('.ui.form').form({
		name : {
			identifier : 'name',
			rules : [ {
				type : 'empty',
				prompt : 'O nome não pode ser vazio'
			}, {
				type : 'maxLength[32]',
				prompt : 'O nome não deve ter mais que 32 caracteres'
			} ]
		},
		badge : {
			identifier : 'badge',
			rules : [ {
				type : 'empty',
				prompt : 'A matricula não pode ser vazia'
			}, {
				type : 'maxLength[16]',
				prompt : 'A matricula não deve ter mais que 16 caracteres'
			} ]
		},
		code : {
			identifier : 'code',
			rules : [ {
				type : 'empty',
				prompt : 'O codigo não pode ser vazio'
			}, {
				type : 'maxLength[16]',
				prompt : 'O codigo não deve ter mais que 16 caracteres'
			} ]
		},
		position : {
			identifier : 'position',
			rules : [ {
				type : 'maxLength[32]',
				prompt : 'O cargo não deve ter mais que 32 caracteres'
			} ]
		}
	}, {
		inline : true,
		on : 'blur',
		onSuccess : function() {
			$.ajax({
				url : 'http://localhost:8180/resteasy/rest/employer',
				type : 'post',
				contentType : 'application/json',
				data : JSON.stringify($('#form').serializeJSON()),
				success : function(data) {
					// message
					$('#message').text('Funcionario adicionado com sucesso.');
					// make it green
					$('.ui.message').addClass('success');
					// show message box
					$('.ui.message').show();
					// hide modal
					$('.ui.modal').modal('hide');
					// reset modal form
					$('#form').trigger('reset');
				}
			});

		}
	});

});
