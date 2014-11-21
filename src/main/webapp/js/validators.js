var validators = {
	excluded: [':disabled'],
	feedbackIcons : {
		valid : 'glyphicon glyphicon-ok',
		invalid : 'glyphicon glyphicon-remove',
		validating : 'glyphicon glyphicon-refresh'
	},
	fields : {
		name : {
			validators : {
				notEmpty : {
					message : 'O nome não pode ser vazio'
				},
				stringLength : {
					max : 32,
					message : 'O nome não deve ter mais que 32 caracteres'
				}
			}
		},
		code : {
			validators : {
				notEmpty : {
					message : 'O código não pode ser vazio'
				},
				stringLength : {
					max : 16,
					message : 'O código não deve ter mais que 16 caracteres'
				}
			}
		},
		badge : {
			validators : {
				notEmpty : {
					message : 'A matrícula não pode ser vazia'
				},
				stringLength : {
					max : 16,
					message : 'A matrícula não deve ter mais que 16 caracteres'
				}
			}
		},
		position : {
			validators : {
				stringLength : {
					max : 32,
					message : 'O cargo não deve ter mais que 32 caracteres'
				}
			}
		}
	}
};