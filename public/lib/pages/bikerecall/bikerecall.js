let bikeRecallRef = db.collection('users').doc(getuid()).collection('bikerecall');

bikeRecallRef.orderBy('when', 'desc').onSnapshot((doc) => {
	$('.lastBikeplacements').children().remove();
	doc.forEach((bike) => {
		const data = bike.data();
		const obj = $('<div>', { class: 'active', 'bike-id': bike.id });
		const date = data.when.toDate();
		const day = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
		const time = date.getHours() + ':' + date.getMinutes();

		obj.html(data.bikeLocation + '<br>' + data.note + '<br>' + day + ' | ' + time);

		$('.lastBikeplacements').append(obj);
	});
});

// onSuccess
function onSucces(msg) {
	console.log(msg);
	if ((msg = 'newBike')) {
		bikeRecallRef.add({
			bikeLocation: $('.bikeLocation').text(),
			note: $('.bikeNote').text(),
			when: firebase.firestore.Timestamp.fromDate(new Date())
		});
	}
}
