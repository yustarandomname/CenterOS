let bikeRecallRef = db.collection('users').doc(getuid()).collection('bikerecall').orderBy('when', 'asc');
// let bikeRecallRef = db.collection('/users/tf7MLQVgQUg6sHcMq995tKcRVlv1/bikerecall');

bikeRecallRef.get().then((doc) => {
	doc.forEach((bike) => {
		const data = bike.data();
		const obj = $('<div>', { class: 'active', 'bike-id': bike.id });
		obj.text(data.bikeLocation + ' ' + data.note + ' ' + data.when);
		$('.lastBikeplacements').append(obj);
	});
});
