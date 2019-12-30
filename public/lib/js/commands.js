let crumbs = [];
let pageSource;
let pageOpenObj;
let commandSrc;
let commands;
let appIcon;
let installed = localStorage.installed ? JSON.parse(localStorage.installed) : null;

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
function getHint(name, properties) {
	let suggestion = $('<div>', { class: 'suggestion' });
	let hintIcon = properties.icon ? properties.icon : pageOpenObj.icon; //set to own icon if hint has its own icon

	suggestion.append($('<i>', { class: 'suggestionIcon ' + hintIcon }));

	// const tempCommandSrc = commandSrc[item].func ? commandSrc[item] : commandSrc;
	// item = commandSrc[item].func ? 'func' : item;

	switch (name) {
		case 'hint':
		case 'icon':
			break;
		case 'list':
			//TODO : implement get list with hints
			break;
		case 'func':
			suggestion.attr('action', 'function');
			suggestion.append($('<div>', { class: 'suggestionName', text: properties.hint }));
			suggestion.append($('<i>', { class: 'suggestionIcon i-functions' }));
			return suggestion;
			break;
		default:
			suggestion.append($('<div>', { class: 'suggestionName', text: name }));
			return suggestion;
			break;
	}
}

function getInstalledFromServer() {
	console.log(installed);
	return new Promise((resolve) => {
		if (JSON.stringify(installed) != 'null') {
			resolve();
		} else {
			obj = [];
			db.collection('users').doc('tf7MLQVgQUg6sHcMq995tKcRVlv1').collection('apps').get().then((apps) => {
				apps.forEach((app) => {
					obj.push(app.data());
				});

				installed = obj;
				console.log(JSON.stringify(installed));
				localStorage.installed = JSON.stringify(installed);
				resolve();
			});
		}
	});
	console.log(installed);
}

async function initHint() {
	$('.searchSuggestions>div').remove();

	await getInstalledFromServer();

	installed.sort((a, b) => b.order - a.order).forEach((obj, index) => {
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

		if (obj.name == 'Log out') {
			suggestion.attr('action', 'logout');
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
			//commandSrc has all the objects at the good location of the breadcrumbs
		}
		let searchField = $('.searchField').val();
		commandSrc = Object.entries(commandSrc).sort((a, b) => b.order - a.order);
		// commandSrc = commandSrc.filter((word) => word[0].match(searchField));

		commandSrc.forEach((item, index) => {
			$('.searchSuggestions').append(getHint(item[0], item[1]));
		});

		$('.suggestion').first().addClass('active');
	} else {
		initHint();
	}
}

function filterHints() {
	let searchField = $('.searchField').val();
	commandSrc = commandSrc.filter((word) => word.name.match(searchField)).sort((a, b) => b.order - a.order);
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
				let f = commandSrc.filter((word) => word[0] == 'func');
				console.log('function has to be executed', f[0][1]);
				f[0][1].execute();
				crumbs.length = 1;
				iterateHint();
				setBreadcrumb();
				window.scroll({
					top: $('.app').offset().top - 15,
					left: 0,
					behavior: 'smooth'
				});
				break;
			case 'logout':
				firebase.auth().signOut().then(function() {
					show('.loginscreen');
					hide('.homescreen');
					$('.suggestion,.app').remove();
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
		iterateHint();
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
