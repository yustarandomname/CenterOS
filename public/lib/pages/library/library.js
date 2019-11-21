const bookRef = db
	.collection('users')
	.doc(localStorage.centerosUser)
	.collection('books')
	.where('type', '==', 'schoolbook');

bookRef.get().then((books) => {
	books.forEach((doc) => {
		const data = doc.data();

		const obj = $('<div>', { class: 'lib-book', 'data-id': doc.id, lastpage: data.lastPage, link: data.link })
			.append($('<div>', { class: 'lib-bookImage', style: `url(${data.thumbnail})` }))
			.append($('<div>', { class: 'lib-bookTitle', text: data.name.title }));

		$('.lib-bookdisplay').append(obj);
	});
});

$(document).on('click', '.lib-book', function() {
	hide('.lib-bookdisplay');
	const lastpage = parseInt($(this).attr('lastpage'));
	const link = $(this).attr('link');

	$('.book-single').attr('data', link + lastpage + '.svg');
	$('.book-dual').attr('data', link + (lastpage + 1) + '.svg');
});
