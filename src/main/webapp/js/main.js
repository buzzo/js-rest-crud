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

					$scope.edit = function(obj) {
						// uses local storage

						// $('#form').trigger('reset');
						// $('#add_form').modal('show');
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

	// open modal
	$('#add_btn').on('click', function() {
		$('#add_form').modal('show');
	});

	// hide the messages
	$('#message_box').hide();

	// hide message box when click over the X
	$('#message_close').on('click', function() {
		$('#message_box').hide('slow');
	});

	// close modal
	$('#add_form_cancel').on('click', function() {
		$('#add_form').modal('hide');
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
					$('#message_box').addClass('success');
					// show message box
					$('#message_box').show();
					// hide modal
					$('#add_form').modal('hide');
					// reset modal form
					$('#form').trigger('reset');
					// call to angularjs to reload
					angular.element('#body_crud').scope().tableReload();
				},
				error : function(data) {
					console.log(data);
					// message
					$('#message').text('Erro na comunicacao com o servidor.');
					// make it red
					$('#message_box').addClass('error');
					// show message box
					$('#message_box').show();
					// hide modal
					$('#add_form').modal('hide');
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
				$('#message').text('Funcionario removido com sucesso.');
				// make it green
				$('#message_box').addClass('success');
				// show message box
				$('#message_box').show();
				// hide modal
				$('#add_form').modal('hide');
				// reset modal form
				$('#form').trigger('reset');
				// call to angularjs to reload
				angular.element('#body_crud').scope().tableReload();
			},
			error : function(data) {
				console.log(data);
				// message
				$('#message').text('Erro na comunicacao com o servidor.');
				// make it red
				$('#message_box').addClass('error');
				// show message box
				$('#message_box').show();
				// hide modal
				$('#add_form').modal('hide');
			}
		});
	});

});
