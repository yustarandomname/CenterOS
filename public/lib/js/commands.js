var val = [];

let installed = [
	{ name: 'Go', icon: 'i-compare', opened: false, pageSrc: 'main/goCommand.js', commandSrc: () => goCommands },
	{ name: 'Files', icon: 'i-file', opened: true, pageSrc: 'files/command.js', commandSrc: () => fileCommands },
	{ name: 'Library', icon: 'i-book', opened: true, pageSrc: 'library/command.js', commandSrc: () => fileCommands }
];

function openApp(page) {
	//const page = $('.suggestion.active').attr('appname');
	const pageurl = `/lib/pages/${page}/${page}.html`;

	if ($(`.app[appid=${page}]`).length) {
		console.log(`${page} is already open`);
	} else {
		$.ajax({
			url: pageurl,
			success: function(data) {
				let obj = $('<div>', { class: 'app', appid: page }).append(data);
				$('.workplace').append(obj);
				console.log('data', data);
			}
		});
	}
}

function initHint() {
	installed.forEach((obj, index) => {
		let suggestion = $('<div>', { class: 'suggestion', appname: obj.name.toLowerCase() })
			.append($('<i>', { class: `suggestionIcon ${obj.icon}` })) //icon
			.append($('<div>', { class: 'suggestionName', text: obj.name }));

		if (index == 0) {
			suggestion.addClass('active');
		}

		if (obj.opened) {
			suggestion.attr('action', 'openApp');
			suggestion.append($('<i>', { class: `suggestionIcon i-open` }));
		}

		$('.searchSuggestions').append(suggestion);
	});
}

// not in use
function placeHint(task, lastArg, src) {
	switch (task) {
		case 'func':
			obj = $('<div>', { class: 'resultitem resultFunction', text: src.func.icon + ' ' + task });
			$('.searchresults').prepend(obj);
			break;
		case 'saveFormat':
		case 'saveSource':
			break;
		default:
			obj = $('<div>', { class: 'resultitem', text: task });
			if (!lastArg || task.match(lastArg)) {
				$('.searchresults').prepend(obj);
			} else {
				$('.searchresults').append(obj);
			}
			break;
	}
}

// not in use
function suggestField() {
	$('.searchresults').children().remove(); // reset values in searchresults
	//hide('.searchError');

	let val = $('.searchfield').val();
	let splitval = val.split(' ');
	let lastArg = splitval[splitval.length - 1];

	if (splitval.length == 1) {
		// if there is 0 / 1 argument
		installed.forEach((item) => placeHint(item.name, lastArg, null));
	} else {
		// if there is at least 1 argument
		installed.forEach((obj) => {
			if (splitval[0] == obj.name) {
				let url = '/lib/pages/' + obj.pageSrc;
				$.getScript(url, (_data, status) => {
					if (status == 'success') {
						let commands = obj.commandSrc();
						let src = commands;

						for (i = 1; i < splitval[i] - 1; i++) {
							src = src[i];
						}

						Object.keys(commands).forEach((item) => {
							placeHint(item, lastArg, src);
							console.log(item, lastArg);
						});
					}
				});
			}
		});
	}

	// print suggestions
	$('.resultitem').eq(0).addClass('active');

	if (splitval[0]) {
		$('.searchresults').removeClass('hide');
	} else {
		$('.searchresults').addClass('hide');
	}
}

// not in use
function appendSuggestion(suggestion) {
	let text = $('.searchfield').val();
	let lastIndex = text.lastIndexOf(' ');
	let fullText = text.substring(0, lastIndex) + (text.split(' ').length > 1 ? ' ' : '') + suggestion + ' ';

	$('.searchfield').val(fullText);
}

// EXECUTE
function exicuteFunction() {
	const base = $('.suggestion.active');

	switch (base.attr('action')) {
		case 'openApp':
			openApp(base.attr('appname'));
			break;
		default:
			displaySearchError('');
			break;
	}
}

//HANDLE ERRORS
function displaySearchError(error) {
	// set error color
	$('.searchBar').addClass('searchError');

	//remove error color after certain time
	setTimeout(() => {
		$('.searchBar').removeClass('searchError');
	}, 2000);

	// if there is an error message
	if (error != '') {
	}
}

// KEYBOARD ACTIONS
$('.searchBar').keydown(function(e) {
	switch (e.which) {
		case 9: //tab
			e.preventDefault();
			appendSuggestion($('.resultitem.active').text());
			break;
		case 13: //enter
			e.preventDefault();
			exicuteFunction();
			break;
		case 38: //up
			e.preventDefault();
			currentIndex = $('.suggestion.active').index() | 0;
			$('.suggestion').removeClass('active');
			$('.suggestion').eq(currentIndex - 1).addClass('active');
			break;
		case 40: // down
			e.preventDefault();
			currentIndex = $('.suggestion.active').index() | 0;
			currentSize = $('.suggestion').length;
			$('.suggestion').removeClass('active');
			$('.suggestion').eq((currentIndex + 1) % currentSize).addClass('active');
			break;
	}
});

$('.searchfield').keyup(function(e) {
	if (e.which != 38 && e.which != 40 && e.which != 13) {
		suggestField();
	}
});

$(document).on('click', '.resultitem', function() {
	if (!$(this).hasClass('.resultFunction')) {
		appendSuggestion($(this).text());
		suggestField();
	}
});

$(document).on('click', '.i-open', function() {
	const app = $(this).parents('.suggestion').attr('appname');
	openApp(app);
});

initHint();
