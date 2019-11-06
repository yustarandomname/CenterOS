var bookid = localStorage.bookid;

var pagelink = '';
var pageid = 0;
var pageType = 'jpg';

var bookRefr = db.collection('users').doc(userid).collection("books").doc(bookid);
var chapRef = db.collection('books').doc(bookid).collection("chapter").orderBy("pageStart", "asc").orderBy('type','asc')

function getChapters(){
	chapRef.get().then(chapters =>{
		chapters.forEach(doc =>{
			d = doc.data()
			console.log(d.type)
			if (d.type == 'chapter'){
				obj = $('<div>',{class:'abvChap',text:d.name,'data-start':d.pageStart,'data-end':d.pageEnd})
				$('.oSideBarScroll').append(obj);
			}else{
				obj = $('<div>',{class:'abvPara hide',text:d.name,'data-start':d.pageStart,'data-end':d.pageEnd})
				$('.abvChap').last().append(obj)
			}		
		})
	})
}


function updatePage(pageid){
	bookRefr.update({
		lastPage : pageid
	});
	
	$('#bv-lastpage').html(pageid-2)
	$('.abvSingle').css('background','url('+ pagelink + pageid +'.'+ pageType + ')');
	if ($(window).width() > 1150){
		$('.abvDual').css('background','url('+ pagelink + (pageid+1) +'.' + pageType + ')');
	}
}


bookRefr.get().then(doc => {
	const data = doc.data()
	pageid = ($(window).width() > 1150)? Math.floor( parseInt(data.lastPage)/2)*2 +2 :  parseInt(data.lastPage)+1;;
	pagedualid = pageid + 1;
	pagelink = data.link;
	pageType = data.linkType;
	
	$('#bv-lastpage').html(pageid-2)
	$('.abvSingle').css('background','url('+ pagelink + pageid +'.'+ pageType + ')');
	if ($(window).width() > 1150){
		$('.abvDual').css('background','url('+ pagelink + pagedualid+'.' + pageType + ')');
	}
	getChapters()
})

$('.bvmNext').click(function(){
	pageid = ($(window).width() > 1150)? Math.floor(pageid/2)*2 +2 : pageid+1;
	updatePage(pageid)
})
$('.bvmPrev').click(function(){
	pageid = ($(window).width() > 1150)? Math.floor(pageid/2)*2 -2 : pageid-1;
	updatePage(pageid)
})

$('#bv-lastpage').keydown(function(e){
	pageid = parseInt($(this).text()) + 2
	if (e.which == 13){
		e.preventDefault();
		updatePage(($(window).width() > 1150)? Math.floor(pageid/2)*2 +2 : pageid+1)
	}
})

//chapter
$(document).on('click','.abvChap',function(){
	$('.abvPara').addClass('hide')
	$(this).children().removeClass('hide')
})
$(document).on('click','.abvPara',function(){
	page = parseInt($(this).attr('data-start'));
	updatePage(page + 2)
})
$('.bvmChapter').click(function(){
	$('body').toggleClass('onSideBar').removeClass('onRecent')
})

