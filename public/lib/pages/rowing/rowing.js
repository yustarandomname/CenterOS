objId = 0;

(function init() {
	const now = new Date();
	const today = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();
	$('#exerciseDate').val(today);
})();

function createAvailable(from, to) {
	$('.roplTime').attr('obj-id', objId);
	obj = $('<div>', { class: 'available' });
	obj.attr('from', from * 100).attr('to', to * 100);
	obj.attr('data-id', objId++);
	obj.css({
		left: (from - 6) * $('.roplHour').width(),
		width: (to - 6 - (from - 6)) * $('.roplHour').width()
	});
	$('.roplTimeLine').append(obj);
}

function setTimeById(id) {
	const sel = '.available[data-id=' + id + ']';
	const from = $(sel).attr('from');
	const to = $(sel).attr('to');

	const fromH = doubleDidgit(Math.round(from / 100));
	const toH = doubleDidgit(Math.round(to / 100));
	const fromM = doubleDidgit(from % 100);
	const toM = doubleDidgit(to % 100);

	$('.timeFrom').val(fromH + ':' + fromM);
	$('.timeTo').val(toH + ':' + toM);
}

$('.roplHour').click(function() {
	let fr = parseInt($(this).text());
	$('.roplTime').removeClass('hide');
	console.log(fr + ':00');
	$('.timeFrom').val(doubleDidgit(fr) + ':00');
	$('.timeTo').val(doubleDidgit(fr + 1) + ':00');
	createAvailable(fr, fr + 1);
});

$(document).on('click', '.available', function() {
	$('.roplTime').removeClass('hide');
	$('.roplTime').attr('obj-id', $(this).attr('data-id'));
	setTimeById($(this).attr('data-id'));
});

$('.timeRemove').click(function() {
	id = $(this).parents('.roplTime').attr('obj-id');
	$('.available[data-id=' + id + ']').remove();
	$('.timeFrom,.timeTo').text();
	$('.roplTime').addClass('hide');
});

function varifyTime(splitTime) {
	let result = true;
	if (!splitTime[0].length || !splitTime[1].length) {
		result = false;
	}
	return result;
}

$('.roplTime .inputTime').keyup(function() {
	id = $(this).parents('.roplTime').attr('obj-id');
	obj = $('.available[data-id=' + id + ']');

	const timeFrom = $('.timeFrom').val().split(':');
	const timeTo = $('.timeTo').val().split(':');

	if (varifyTime(timeFrom) && varifyTime(timeTo)) {
		const fromH = parseInt(timeFrom[0]);
		const toH = parseInt(timeTo[0]);
		const fromM = parseInt(timeFrom[1]);
		const toM = parseInt(timeTo[1]);
		const fr = fromH - 6 + fromM / 60;
		const to = toH - 6 + toM / 60;

		obj.css({
			left: fr * $('.roplHour').width() + 'px',
			width: (to - fr) * $('.roplHour').width() + 'px'
		});
		console.log(fromH);
		console.log(fromM);
	} else {
		console.log('not valid time stamp' + (timef + ' ' + timet));
	}
});
