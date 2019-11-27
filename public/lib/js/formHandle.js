// input
function validate(input) {
	let val = input.text();
	switch (input.attr('type')) {
		case 'date':
			let vArr = val.split('-');
			let d = parseInt(vArr[0]);
			let m = parseInt(vArr[1]);
			let y = parseInt(vArr[2]);
			if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > 2100) {
				input.siblings('.inputError').text('A date field is not filled in correctly').removeClass('hide');
				return false;
			} else {
				return true;
			}
			break;
		default:
			return true;
			break;
	}
}

function submitForm(input, link) {
	let field = input.parents('.inlineForm').children('.input');
	let isValid = true;

	field.each(function(index) {
		val[index] = $(this).text();
		if (!$(this).text() || !validate($(this))) {
			isValid = false;
			$(this).addClass('inputNotFilled');
		}
	});

	// check if values are all valid
	if (isValid && link) {
		onSucces(link);
	} else {
		input.siblings('.inputError').removeClass('hide').text('a value is not correctly specified');
	}
}

// KEYPRESSES
$(document).on('keydown', '.inlineForm .input', function(e) {
	$(this).removeClass('inputNotFilled');
	if (e.which == 13) e.preventDefault();
});

$(document).on('keyup', '.inlineForm .input', function(e) {
	let onSuccesLink = $(this).parent('.inputSubmit').attr('onSucces');
	if (e.which == 13) submitForm($(this), onSuccesLink);
});

$(document).on('click', '.inputSubmit', function() {
	let onSuccesLink = $(this).attr('onSucces');
	console.log(onSuccesLink);
	submitForm($(this), onSuccesLink);
});

// inlineForm
function openInlineForm(className, values) {
	show(className);

	if (values) {
		Object.keys(values).forEach((item) => {
			const sel = className + ' ' + item;
			$(sel).text(values[item]);
		});
	}
}

$(document).on('click', '.formClose', function() {
	$(this).parent('.inlineForm').addClass('hide');
});
