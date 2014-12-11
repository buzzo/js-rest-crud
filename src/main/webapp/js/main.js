var URL = 'rest/employer';

// i18n support
i18n.init({
	lng : "pt-BR",
	fallbackLng : false
}, function(t) {
	$(".container").i18n();
	$(".form").i18n();
});

// table formatter for action column
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

// table formatter for status column
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

function http_get(id, onSuccess) {
	$.ajax({
		url : URL + "/" + id,
		type : 'get',
		data : null,
		success : function(data) {
			// callback
			onSuccess(data);
		},
		error : function(data) {
			$.notify($.t("error.server"), "error");
		}
	});
}

function http_post(data) {
	$.ajax({
		url : URL,
		type : 'post',
		contentType : 'application/json',
		data : data,
		success : function(data) {
			refreshTable();
			$.notify($.t("employee.add.msg.success"), "success");
		},
		error : function(data) {
			$.notify($.t("error.server"), "error");
		},
		complete : function(data, status) {
			closeForm();
		}
	});
}

function http_put(data) {
	$.ajax({
		url : URL,
		type : 'put',
		contentType : 'application/json',
		data : data,
		success : function(data) {
			refreshTable();
			$.notify($.t("employee.update.msg.success"), "success");
		},
		error : function(data) {
			$.notify($.t("error.server"), "error");
		},
		complete : function(data, status) {
			closeForm();
		}
	});
}

function http_delete(id) {
	$.ajax({
		url : URL,
		type : 'delete',
		contentType : 'text/plain',
		data : id + "",
		success : function(data) {
			refreshTable();
			$.notify($.t("employee.remove.msg.success"), "success");
		},
		error : function(data) {
			$.notify($.t("error.server"), "error");
		}
	});
}

function openRemovePopup(event) {
	var id = $(event.target).data('id');

	bootbox.dialog({
		message : $.t("employee.remove.msg.confirmation") + "?",
		buttons : {
			cancel : {
				label : $.t("cancel"),
				className : "btn-default"
			},
			ok : {
				label : $.t("remove"),
				className : "btn-primary",
				callback : function() {
					http_delete(id);
				}
			}
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
		openForm($.t("employee.add.title"), $.t("add"), function(data) {
			http_post(data);
		});
	});

	$(document).on('click', '.remove-act', function(event) {
		openRemovePopup(event);
	});

	$(document).on('click', '.edit-act', function(event) {
		clearForm();
		http_get($(event.target).data('id'), function(data) {
			fillForm(data);
		});
		openForm($.t("employee.update.title"), $.t("save"), function(data) {
			http_put(data);
		});
	});

	// validate modal
	$('#form').bootstrapValidator({
		excluded : [ ':disabled' ],
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		}
	});

	// configures what happens when the form is successfully
	// submited
	$('#form').bootstrapValidator().on('success.form.bv', function(e) {
		// prevent form submission
		e.preventDefault();
		// get data from form
		var data = JSON.stringify($(e.target).serializeJSON());
		if (httpCallBack != null) {
			// executes the callback function set before
			// when the form was open
			httpCallBack(data);
		}
	});

});
