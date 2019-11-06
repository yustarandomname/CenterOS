ref = db.collection('users').doc(localStorage.centerosUser).collection('files');
ref.onSnapshot(files => { //get files
	$('.filesContainer>div').children().remove();
	files.forEach(doc => {
		const data = doc.data();
		obj = $('<div>',{class:'afFile gridItem oaHide1 clickable', type:data.type,fileid:doc.id,fileurl:data.fileurl})
		//,draggable:'true',ondragstart:'drag(event)'
		obj.append($('<div>',{html:data.title}))
		obj.append($('<div>',{class:'notesInfo',text:data.type}))
		
		$('.afFiles').append(obj)
	})
})

//open file
$(document).on('click','.afFile',function() {
	xhr($(this).attr('fileid'),'notes','notes')//id, title, url
	localStorage.setItem('file',$(this).attr('fileid'))
	$('.workplace').children().hide()
})

//create new file
function onSucces(msg){
	if (msg == newFile){
		let title = $('.fileNewTitle').text();
		let type = $('.fileNewType').text();
		console.log(title + ' '+type)
		switch (type){
			case 'note':
				ref.add({
					blocks:1,
					fileurl:'notes',
					type:'note',
					folderid:0,
					title:title,
					updateKey:Math.random()
				}).then(docRef => {
					console.log(docRef.id)
					ref.doc(docRef.id).collection('blocks').add({
						order:0,
						style:[],
						text:'New paragraph for '+title,
						type:'text'
					})
				})
				window.location.href = "https://centeros.nl/notes/"+docRef.id
				break;
			case 'pres':
				url = 'presentation'
				break;
			default:
				$('.newFileSubmit').text('type is unknown')
		}
	}
}