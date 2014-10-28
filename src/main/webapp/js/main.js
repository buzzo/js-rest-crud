var app = angular
		.module('main', [ 'ngTable', 'ngResource' ])
		.controller(
				'listController',
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
				});

$(document).ready(function() {

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
				},
				error: function(data) {
					console.log(JSON.stringify($('#form').serializeJSON()));
				}
			});

		}
	});

});
