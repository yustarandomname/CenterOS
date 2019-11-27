let crumbs = [];
let pageSource;
let pageOpenObj;
let commandSrc;
let commands;
let appIcon;

let installed = [
	{ name: 'Files', icon: 'i-file', opened: true, pageSrc: 'files/command.js' },
	{ name: 'Library', icon: 'i-book', opened: true, pageSrc: 'library/command.js' },
	{ name: 'Bike recall', icon: 'i-bike', opened: true, pageSrc: 'bikerecall/command.js' }
];

function openApp() {
	const pageCap = $('.suggestion.active>.suggestionName').text();

	installed.forEach((obj) => {
		if (obj.name == pageCap) pageOpenObj = obj;
	});

	const page = pageCap.toLowerCase().replace(/\s/g, ''); //TODO remove spaces
	const link = `/lib/pages/${page}/${page}`;
	const pageurl = link + '.html?v=' + Math.random(); //when production is ready remove no cashing
	const scrtipurl = link + '.js?v=' + Math.random();

	return new Promise((resolve) => {
		if ($(`.app[appid=${page}]`).length) {
			console.log('page is already opened');
			//if page is already opened
			show(`.app[appid=${page}]`);
			if (pageOpenObj.pageSrc) {
				// if page has commands page => load commands page / set var commands to commands of app
				$.getScript('/lib/pages/' + pageOpenObj.pageSrc, (data, status) => {
					if (status == 'success') commands = appCommands;
					resolve('Resolve');
				});
			} else {
				resolve('Resolved');
			}
		} else {
			if (pageOpenObj.opened) {
				// if command is a page => open html / js
				$.ajax({
					url: pageurl,
					success: function(data) {
						let obj = $('<div>', { class: 'app', appid: page, pagesource: pageOpenObj.pageSrc }).append(data);
						$('.workplace').append(obj);
					}
				});
				$.getScript(scrtipurl);
			}

			if (pageOpenObj.pageSrc) {
				// if page has commands page => load commands page / set var commands to commands of app
				$.getScript('/lib/pages/' + pageOpenObj.pageSrc, (data, status) => {
					if (status == 'success') commands = appCommands;
					resolve('Resolve');
				});
			} else {
				resolve('Resolved');
			}
		}
	});
}

// Hints / Suggestion
function getHint(item) {
	let suggestion = $('<div>', { class: 'suggestion' });
	let hintIcon = commandSrc[item].icon ? commandSrc[item].icon : pageOpenObj.icon;

	suggestion.append($('<i>', { class: 'suggestionIcon ' + hintIcon }));

	// const tempCommandSrc = commandSrc[item].func ? commandSrc[item] : commandSrc;
	// item = commandSrc[item].func ? 'func' : item;

	switch (item) {
		case 'hint':
		case 'icon':
			break;
		case 'list':
			//TODO : implement get list with hints
			break;
		case 'func':
			let func = commandSrc.func;
			suggestion.attr('action', 'function');
			suggestion.append($('<div>', { class: 'suggestionName', text: func.hint }));
			suggestion.append($('<i>', { class: 'suggestionIcon i-functions' }));
			return suggestion;
			break;
		default:
			suggestion.append($('<div>', { class: 'suggestionName', text: item }));
			return suggestion;
			break;
	}
}

function initHint() {
	$('.searchSuggestions>div').remove();
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

function iterateHint() {
	$('.searchSuggestions>div').remove();
	if (crumbs.length > 0) {
		// if there is a crumb in crumbs[]
		commandSrc = commands;
		for (i = 1; i < crumbs.length; i++) {
			commandSrc = commandSrc[crumbs[i]];
		}

		Object.keys(commandSrc).forEach((item, index) => {
			if (getHint(item)) {
				$('.searchSuggestions').append(getHint(item));
			}
		});

		$('.suggestion').first().addClass('active');
	} else {
		initHint();
	}
}

function sortHints() {
	$('.suggestion').each((index) => {
		console.log($(this).attr('appname'));
		// let count = 0;
		// const searchStr = $('.searchField').val();
		// const hintStr = item.text();

		// for (i = 0; i < searchStr.length; i++) {
		// 	if (hintStr.match(new RegExp(searchStr[i], 'g'))) count++;
		// }

		// console.log(hintStr + ' - match count ' + count);
	});
}

// BREADCRUMBS
function setBreadcrumb(addCrumb) {
	$('div.breadcrumb').remove();

	//if there is a crumb to be added => add it to crumb[]
	if (addCrumb) crumbs.push(addCrumb);

	// display all crumbs
	crumbs.forEach((crumb) => {
		let obj = $('<div>', { class: 'breadcrumb', text: crumb });
		$('.breadcrumbContainer').append(obj);
	});
}

$(document).on('click', '.breadcrumb', function() {
	crumbs.length = $(this).index();
	setBreadcrumb();
	iterateHint();
	if ($(this).hasClass('i-centeros')) {
		hide('.app');
	}
});

// EXECUTE
async function executeSuggestion() {
	const base = $('.suggestion.active');

	setBreadcrumb(base.text());

	//if base has a certain action => execute set function
	if (base.attr('action')) {
		var result;
		switch (base.attr('action')) {
			case 'openApp':
				result = await openApp(base.attr('appname'));
				iterateHint();
				break;
			case 'function':
				console.log('function has to be executed');
				commandSrc.func.execute();
				crumbs.length = 1;
				iterateHint();
				setBreadcrumb();
				window.scroll({
					top: $('.app').offset().top - 15,
					left: 0,
					behavior: 'smooth'
				});
				break;
		}
	} else {
		iterateHint();
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
		case 13: //enter
			e.preventDefault();
			executeSuggestion();
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

$('.searchField').keyup(function(e) {
	if (e.which != 38 && e.which != 40 && e.which != 13) {
		sortHints();
	}
});

$(document).on('click', '.resultitem', function() {
	if (!$(this).hasClass('.resultFunction')) {
		appendSuggestion($(this).text());
		suggestField();
	}
});

$(document).on('click', '.suggestion', function() {
	$(this).addClass('active').siblings().removeClass('active');

	executeSuggestion();
	//openApp(app);
});

initHint();
