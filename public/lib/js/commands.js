var val = [];

let installed = [
	{ name: 'go', pageSrc: 'main/goCommand.js', commandSrc: () => goCommands },
	{ name: 'files', pageSrc: 'files/command.js', commandSrc: () => fileCommands }
];

function openApp(app) {
	console.log(`app: ${app} is opened`);
}

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

	// TODO: set limitation to hint size

	// print suggestions
	$('.resultitem').eq(0).addClass('active');

	if (splitval[0]) {
		$('.searchresults').removeClass('hide');
	} else {
		$('.searchresults').addClass('hide');
	}
}

function appendSuggestion(suggestion) {
	let text = $('.searchfield').val();
	let lastIndex = text.lastIndexOf(' ');
	let fullText = text.substring(0, lastIndex) + (text.split(' ').length > 1 ? ' ' : '') + suggestion + ' ';

	$('.searchfield').val(fullText);
}

//   if ($('.active').hasClass('resultFunction')){ // active is a funtion
//     let val = $('.resultFunction.active').text();
//     val = (val.slice(-1) == ' ')? val.slice(0, -1).split(' ') : val.split(' '); //remove space if val has space at end
//     val.forEach(opp => {src = (src[opp])?src[opp] : src;}) //if function doesn't make sense, tries to make sense of command

//     src.func();
//     $('.searchfield').val('');
//     $('.searchresults').children().remove();

$('.searchbar').keydown(function(e) {
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
			for (let i = 0; i < $('.resultitem').length; i++) {
				if ($('.resultitem').eq(i).hasClass('active')) {
					$('.resultitem').eq(i - 1).addClass('active').siblings().removeClass('active');
					break;
				}
			}
			break;
		case 40:
			e.preventDefault();
			for (let i = 0; i < $('.resultitem').length; i++) {
				if ($('.resultitem').eq(i).hasClass('active')) {
					$('.resultitem').eq(i + 1).addClass('active').siblings().removeClass('active');
					break;
				}
			}
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
