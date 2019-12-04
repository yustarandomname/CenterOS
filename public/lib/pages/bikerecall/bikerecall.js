let lastLocation;
let bikeRecallRef = db.collection('users').doc(getuid()).collection('bikerecall');

bikeRecallRef.where('found', '==', false).orderBy('when', 'desc').limit(5).onSnapshot((doc) => {
	$('.lastBikeplacements').children('.bike').remove();
	doc.forEach((bike, index) => {
		const data = bike.data();

		const date = data.when.toDate();
		const day = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
		const time = date.getHours() + ':' + date.getMinutes();

		let obj = $('<div>', { class: 'bike', 'bike-id': bike.id })
			.append($('<div>', { html: `<div class='subText'> ${day} | ${time} - ${data.bikeLocation}</div>${data.note}` }))
			.append($('<div>', { class: 'button', text: 'mark found' }));

		if ($('.lastBikeplacements[bike-name=' + data.name + ']').length) {
			// if loaction is same location
			$('.lastBikeplacements[bike-name=' + data.name + ']').append(obj);
		} else {
			// <div class="container container-collapse list lastBikeplacements" bike-name='hgdf7srhg485h'></div>
			bikeName = $('<div>', {
				class: 'container container-collapse list lastBikeplacements',
				'bike-name': data.name
			})
				.append($('<i>', { class: 'i-arrow-down collapseable' }))
				.append($('<div>', { class: 'subTitle', text: data.name }))
				.append(obj.addClass('active'));
			$('.bikePlacementContainer').append(bikeName);
		}
	});
});

// get Tags for new bike
bikeRecallRef.doc('--INIT--').get().then((doc) => {
	let tags = '';
	doc.data().bikes.forEach((tag) => {
		tags += tag + ',';
	});

	$('.bikeName').attr('tag', tags);
});

// onSuccess
function onSucces(msg) {
	if ((msg = 'newBike')) {
		bikeRecallRef.add({
			bikeLocation: $('.bikeLocation').text(),
			note: $('.bikeNote').text(),
			when: firebase.firestore.Timestamp.fromDate(new Date()),
			name: $('.bikeName').attr('val'),
			found: false
		});
	}

	$('.input').text('');
}

// eventlistener
$(document).on('click', '.bike .button', function() {
	const id = $(this).parents('.bike').attr('bike-id');
	bikeRecallRef.doc(id).update({
		found: true
	});
});
