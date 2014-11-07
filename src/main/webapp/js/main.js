var app = angular
		.module('main', [ 'ngTable', 'ngResource' ])
		.controller(
				'formController',
				function($scope, $filter, $resource, $location, $timeout,
						ngTableParams) {

					var data = [];
					var api = $resource('http://localhost:8180/resteasy/rest/employer');

					$scope.tableParams = new ngTableParams({
						page : 1, // show first page
						count : 10, // count per page
						sorting : {
							code : 'desc' // initial sorting
						}
					}, {
						total : data.length, // length of data
						getData : function($defer, params) {
							$location.search(params.url());
							api.get(params.url(), function(data) {
								$timeout(function() {
									params.total(data.total);
									$defer.resolve(data.result);
								}, 500);
							});
						}
					});

					// edit button was pressed
					$scope.edit = function(obj) {
						// angular call removes $$hashkey from the obj and then
						// we transform back string to json object
						$.each($.parseJSON(angular.toJson(obj)), function(key,
								value) {
							var e = $('[name=' + key + ']', '#edit_form_div')
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
						$('#edit_form_div').modal('show');
					}

					// remove button was pressed
					$scope.remove = function(obj) {
						// uses local storage
						localStorage.setItem('id', obj);
						$('#remove_confirmation').modal('show');
					}

					// exposed method for jquery call and reload table
					$scope.tableReload = function() {
						$scope.tableParams.reload();
					}

				});

$(document).ready(function() {

	// initialize growl
	$container = $("#growl").notify();

	function showSuccess(header, msg) {
		$container.notify("create", "growl_div_success", {
			title : header,
			text : msg
		}, {
			expires : 3000
		});
	}
	
	function showInfo(header, msg) {
		$container.notify("create", "growl_div_info", {
			title : header,
			text : msg
		}, {
			expires : 3000
		});
	}
	
	function showError(header, msg) {
		$container.notify("create", "growl_div_error", {
			title : header,
			text : msg
		}, {
			expires : 3000
		});
	}

	// open modal
	$('#add_btn').on('click', function() {
		$('#add_form_div').modal('show');
	});

	// close modal
	$('#add_form_cancel').on('click', function() {
		$('#add_form_div').modal('hide');
		// reset modal form
		$('#add_form').trigger('reset');
		$('input:checkbox', '#add_form_div').removeAttr('checked');
	});
	$('#edit_form_cancel').on('click', function() {
		$('#edit_form_div').modal('hide');
		// reset modal form
		$('#edit_form').trigger('reset');
		$('input:checkbox', '#edit_form_div').removeAttr('checked');
	});

	// initialize checkbox
	$('.ui.checkbox').checkbox();

	// add form validation
	$('#add_form_div').form({
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
				prompt : 'A matrícula não pode ser vazia'
			}, {
				type : 'maxLength[16]',
				prompt : 'A matrícula não deve ter mais que 16 caracteres'
			} ]
		},
		code : {
			identifier : 'code',
			rules : [ {
				type : 'empty',
				prompt : 'O código não pode ser vazio'
			}, {
				type : 'maxLength[16]',
				prompt : 'O código não deve ter mais que 16 caracteres'
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
				data : JSON.stringify($('#add_form').serializeJSON()),
				success : function(data) {
					// message
					showSuccess('Funcionário adicionado com sucesso!','');
					// hide modal
					$('#add_form_div').modal('hide');
					// reset modal form
					$('#add_form').trigger('reset');
					// call to angularjs
					// to reload
					angular.element('#body_crud').scope().tableReload();
				},
				error : function(data) {
					// message
					showSuccess('Erro de comunicação com o servidor', 'Por favor tente novamente novamente ou entre em contato com o administrador');
					// hide modal
					$('#add_form_div').modal('hide');
				}
			});

		}
	});

	// edit form validation
	$('#edit_form_div').form({
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
				prompt : 'A matrícula não pode ser vazia'
			}, {
				type : 'maxLength[16]',
				prompt : 'A matrícula não deve ter mais que 16 caracteres'
			} ]
		},
		code : {
			identifier : 'code',
			rules : [ {
				type : 'empty',
				prompt : 'O código não pode ser vazio'
			}, {
				type : 'maxLength[16]',
				prompt : 'O código não deve ter mais que 16 caracteres'
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
			console.log(JSON.stringify($('#edit_form').serializeJSON()))
			$.ajax({
				url : 'http://localhost:8180/resteasy/rest/employer',
				type : 'put',
				contentType : 'application/json',
				data : JSON.stringify($('#edit_form').serializeJSON()),
				success : function(data) {
					// message
					showSuccess('Funcionário atualizado com sucesso!','');
					// hide modal
					$('#edit_form_div').modal('hide');
					// reset modal form
					$('#edit_form').trigger('reset');
					// call to angularjs
					// to reload
					angular.element('#body_crud').scope().tableReload();
				},
				error : function(data) {
					// message
					showSuccess('Erro de comunicação com o servidor', 'Por favor tente novamente novamente ou entre em contato com o administrador');
					// hide modal
					$('#edit_form_div').modal('hide');
				}
			});

		}
	});

	$('#remove_ok').on('click', function() {
		$.ajax({
			url : 'http://localhost:8180/resteasy/rest/employer',
			type : 'delete',
			contentType : 'text/plain',
			data : localStorage.getItem('id'),
			success : function(data) {
				// message
				$('#message').text('Funcionário removido com sucesso.');
				// make it green
				$('#message_box').addClass('success');
				// show message box
				$('#message_box').show();
				// hide modal
				$('#add_form_div').modal('hide');
				// reset modal form
				$('#add_form_div').trigger('reset');
				// call to angularjs to
				// reload
				angular.element('#body_crud').scope().tableReload();
			},
			error : function(data) {
				console.log(data);
				// message
				$('#message').text('Erro de comunicação com o servidor.');
				// make it red
				$('#message_box').addClass('error');
				// show message box
				$('#message_box').show();
				// hide modal
				$('#add_form_div').modal('hide');
			}
		});
	});

});
