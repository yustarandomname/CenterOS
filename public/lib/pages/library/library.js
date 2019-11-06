const bookRef = db.collection('users').doc(localStorage.centerosUser).collection("books")
// 		.where("type", "==", "schoolbook");
		
bookRef.get().then(books =>{
	books.forEach(doc =>{
		const data = doc.data()
		const title = data.name.title + "<div class='subText'>"+data.name.subtitle+"</div>";
		
		obj = $('<div>',{class:'alCover gridItem clickable','data-id':doc.id})
		.append($('<div>',{class:'image',style:"background:url("+data.thumbnail+")"}))
		.append($('<div>',{class:'info',html:title}))
		.append($('<div>',{class:'remove hide mdi mdi-close roundButton'}))
		
		$('#lib-books').append(obj)
	})
})


$(document).on('click', '.alCover>*:not(.remove)',function(e){
  	bookId = $(this).parents('.alCover').attr('data-id');  	
  	xhr(bookId,'book viewer','bookviewer')//id, title, url
	localStorage.setItem('bookid',bookId)
	$('.workplace').children().hide()
})

$('.alEdit').click(function(){
	$('.alCover>.remove').toggleClass('hide');
})

$('.alRemove').click(function(){//TODO improve remove
	let id = $(this).parents('.alCover').attr('bookid');
	$('.removeBook').val(id);
})