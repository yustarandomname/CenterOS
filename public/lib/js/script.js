var user;
const auth = firebase.auth();
const db = firebase.firestore();
const urlArray = window.location.href.split('/');
var isScrolling;
// const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

async function init() {
	try {
		user = await auth.currentUser;
		console.log('user', user);
		hide('loginscreen');
		show('homescreen');
	} catch (error) {
		console.log('no user was found', error);
	}
}

function show(selector) {
	$(selector).removeClass('hide');
}
function hide(selector) {
	$(selector).addClass('hide');
}
function dd(num) {
	console.log('please update function `dd` to `doubleDidgit`');
	doubleDidgit(num);
}
function doubleDidgit(digit) {
	return digit < 10 ? '0' + digit : digit;
}
function arrayItemToFront(arr, item) {
	let newArr = [ 0 ];
	for (i = 0; i < arr.length; i++) {
		if (arr[i] == item) {
			newArr[0] = item;
		} else {
			newArr.push(arr[i]);
		}
	}
	return newArr[0] == 0 ? arr : newArr;
}

function setCursorToEnd(target, end) {
	let el = $('.searchfield');
	var range = document.createRange();
	var sel = window.getSelection();
	range.setStart(el.childNodes[0], end);
	range.collapse(true);
	sel.removeAllRanges();
	sel.addRange(range);
	el.focus();
}

// lock scrolling
window.addEventListener(
	'scroll',
	function(event) {
		window.clearTimeout(isScrolling);
		isScrolling = setTimeout(function() {
			if (window.pageYOffset != 0 && ($('.app') && Math.abs(window.pageYOffset - $('.app').offset().top) < 200)) {
				window.scroll({
					top: $('.app').offset().top - 15,
					left: 0,
					behavior: 'smooth'
				});
			}
		}, 66);
	},
	false
);

// collapse
$(document).on('click', '.collapseable', function() {
	$(this).parents('.container-collapse').toggleClass('collapsed');
});

// login
function onSucces(msg) {
	console.log(msg);
	if (msg == 'login') {
		const email = $('.loginEmail').text();
		const password = $('.loginPass').text();

		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then(function(user) {
				$('.input').text('');
				console.log(user);
			})
			.catch(function(error) {
				$('.inputError').removeClass('hide').text(error.message);
				console.log(error.code, error.message);
			});
	}
}
