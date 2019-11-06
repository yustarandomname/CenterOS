ref = db.collection('users').doc(userid);
ref.get().then(doc => {
	const data = doc.data();
	const fullname = data.name.first + ' ' + data.name.last;
	$('#set-name').html(data.name.first);
	$('#set-email').text(auth.currentUser.email)
	$('#set-fullname').html(fullname)
	$('#set-school').html(data.school)
})

$('.aseOpenUpdates').click(function(){
	window.location.href = "https://centeros.nl/community";
})

query = db.collection("version").orderBy("version", "desc").limit(1);
query.get().then(versions => {
	versions.forEach(doc =>{
		const data = doc.data();
		const v = 'v'+data.version;
		$('#set-version').html(v)
	})
});