function init(){
	setTimeout(function(){
		userid = 'tf7MLQVgQUg6sHcMq995tKcRVlv1';
		if (userid){//if logged in
			show('navbar')

			if (urlArray[3]) { //if app is opened
				db.collection('users').doc(userid).collection('apps').where('shortName','==',urlArray[3]).get().then(apps => {
					apps.forEach(doc => {
						xhr(doc.id,urlArray[3],urlArray[3]); //id, pageTitle, url, extra
						$('.workplace').removeClass('hide')
					})
				})
			}else{ //if on homescreen
				loadApps();
			}
		}else{//if not logged in
			$('.login').removeClass('hide');
		}
	},1000)
}

function loadApps(){
	show('dashboard')
	let appRef = db.collection('users').doc(userid).collection('apps').where("visible", "==",true);
	appRef.get().then(apps => {
		apps.forEach(doc => {
			const data = doc.data();
			const url = data.name.replace(/\s/g, '');

			obj = $('<div>',{class:'gridItem clickable dashApp','style':'order:'+data.order,'data-id':doc.id,'data-url':url});
			obj.append($('<div>',{text:data.name}))
			$('.appdrawer').append(obj);
		})
	})
}

//get page
var getHTML = function ( url, callback ) {
	if ( !window.XMLHttpRequest ) return;
	var xhr = new XMLHttpRequest();
	// Setup callback
	xhr.onload = function() {
		if ( callback && typeof( callback ) === 'function' ) {
			callback( this.responseXML );
		}
	}
	// Get the HTML
	xhr.open( 'GET', url );
	xhr.responseType = 'document';
	xhr.send();

};

function xhr(id, pageTitle, url){//TODO: add validation
	history.pushState(id, pageTitle, '/'+url); //'2', 'Title', '/Title'
	document.title = "Center OS - "+pageTitle;
	show('workplace');
	let alreadyopen = false;

	$('.workplace .app').each(function(){
		if ($(this).attr('appid') == id){//app is already opened
			$(this).removeClass('hide');
			alreadyopen = true;
		}
	})

	if (!alreadyopen){
		let link = 'lib/pages/'+url+'/'+url;
		getHTML(link+'.html', function (response) {
		 	let data =  $('<div>',{class:'app',appid:id,html:$(response).find('body').html()})
			$('.workplace').append(data)
			setTimeout(function(){
				if (url && url != 'login' && urlArray[2] == "centeros.nl"){
					$.get(link+'.js').then(function(){
			    	}).catch(function(e) {
			        	console.error(url + " js doesn't exists")
			    	})
				}
			}, 100)

		});
	}

	db.collection('users').doc(userid).collection('apps').doc(id).update({
		opened: firebase.firestore.FieldValue.increment(1)
	})
}

// openapp
$(document).on('mousedown','.dashApp',function(e){
	e.preventDefault();
	var link = $(this).attr('data-url').replace(/\s/g, '').toLowerCase();
	var title = $(this).text().replace(/\s/g, '');
	var id = $(this).attr('data-id');

	switch(e.which){
		case 1:
			//id, pageTitle, url, extra
			xhr(id, title, link); //bj5qR3yuliOMA6uDyNKw, Settings, settings
			$('.dashboard').addClass('hide');
			$('.workplace').removeClass('hide')
			break;
		case 2:
			url = 'https://centeros.nl/'+link
			window.open(url, '_blank').focus();
			break;
		case 3://for right mouse button
			break;
	}

})

init()
