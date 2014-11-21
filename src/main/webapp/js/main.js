var URL = 'http://localhost:8180/resteasy/rest/employer';

function actionFormatter(value, row) {
	// value is the ID
	var edit = '<button type="button" data-id="' + value
			+ '" class="btn btn-default edit-act"> <span data-id="' + value
			+ '" class="glyphicon glyphicon-pencil"></span></button>';
	var remove = '<button type="button" data-id="' + value
			+ '" class="btn btn-default remove-act"> <span data-id="' + value
			+ '" class="glyphicon glyphicon-remove"></span></button>';
	return edit + remove;
}

function statusFormatter(value, row) {
	var icon = value ? 'glyphicon-ok' : 'glyphicon-lock';
	var text = value ? 'Habilitado' : 'Desabilitado';
	return '<i class="glyphicon ' + icon + '" style="padding-right:10px" ></i>'
			+ text;
}

// this holds the current callback HTTP function
var httpCallBack;

function openForm(title, okBtn, http) {
	// modal title
	$('.modal-title').text(title);
	// modal ok button
	$('#frm-ok-btn').text(okBtn);
	// show modal
	$('#form_div').modal('show');
	// sets the http callback for this form
	httpCallBack = http;
}

function closeForm() {
	$('#form_div').modal('hide');
}

function clearForm() {
	$('#form').bootstrapValidator('resetForm', true);
}

function refreshTable() {
	$('#table').bootstrapTable('refresh');
}

function get(id, onSuccess) {
	$.ajax({
		url : URL + "/" + id,
		type : 'get',
		data : null,
		success : function(data) {
			// callback
			onSuccess(data);
		},
		error : function(data) {
			$.notify("Error na comunicação com o servidor. Tente novamente.",
					"error");
		}
	});
}

function post(data) {
	$.ajax({
		url : URL,
		type : 'post',
		contentType : 'application/json',
		data : data,
		success : function(data) {
			refreshTable();
			$.notify("Funcionário adicionado com sucesso!", "success");
		},
		error : function(data) {
			$.notify("Error na comunicação com o servidor. Tente novamente.",
					"error");
		},
		complete : function(data, status) {
			closeForm();
		}
	});
}

function put(data) {
	$.ajax({
		url : URL,
		type : 'put',
		contentType : 'application/json',
		data : data,
		success : function(data) {
			refreshTable();
			$.notify("Funcionário atualizado com sucesso!", "success");
		},
		error : function(data) {
			$.notify("Error na comunicação com o servidor. Tente novamente.",
					"error");
		},
		complete : function(data, status) {
			closeForm();
		}
	});
}

function remove(id) {
	$.ajax({
		url : URL,
		type : 'delete',
		contentType : 'text/plain',
		data : id + "",
		success : function(data) {
			refreshTable();
			$.notify("Funcionário removido com sucesso!", "info");
		},
		error : function(data) {
			$.notify("Error na comunicação com o servidor. Tente novamente.",
					"error");
		}
	});
}

function openRemovePopup(event) {
	var id = $(event.target).data('id');
	bootbox.confirm("Tem certeza que deseja remover este funcionário?",
			function(result) {
				if (result) {
					remove(id);
				}
			});
}

function fillForm(data) {
	$.each(data, function(key, value) {
		var e = $('[name=' + key + ']', '#form')
		if (e.is(':checkbox')) {
			// checkbox
			if (value) {
				e.attr('checked', 'checked');
			} else {
				e.removeAttr('checked');
			}
		} else {
			// inputtext
			e.val(value);
		}
	});
}

$(document).ready(function() {

	// load table
	$('#table').bootstrapTable({
		url : URL
	});

	// open modal
	$('#open_form_btn').on('click', function() {
		clearForm();
		openForm('Adicionar Funcionário', 'Adicionar', function(data) {
			post(data);
		});
	});

	$(document).on('click', '.remove-act', function(event) {
		openRemovePopup(event);
	});

	$(document).on('click', '.edit-act', function(event) {
		clearForm();
		get($(event.target).data('id'), function(data) {
			fillForm(data);
		});
		openForm('Atualizar Funcionário', 'Salvar', function(data) {
			put(data);
		});
	});

	// validate modal
	$('#form').bootstrapValidator(validators);
	
	// configures what happens when the form is successfully submited
	$('#form').bootstrapValidator().on('success.form.bv', function(e) {
		// prevent form submission
		e.preventDefault();
		// get data from form
		var data = JSON.stringify($(e.target).serializeJSON());
		if (httpCallBack != null) {
			// executes the callback function set before when the form was open 
			httpCallBack(data);
		}
	});

});
