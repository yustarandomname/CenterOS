var todoProjects = db.collection('users').doc(localStorage.centerosUser).collection('todo');
todoProjects.doc('--init--').onSnapshot(doc =>{
	$('.todoProjects').children().remove();//remove existing item
	const lastProject = doc.data().lastOpened;
	const showDone = doc.data().showDone;

	showDone?$('.todoShowDone').addClass('checked'):$('.todoShowDone').removeClass('checked')
	
	doc.data().projects.forEach(project => {
		$('.todoItems').children().remove()
		let projectItem = $('<div>',{class:'gridItem',html:'<div>'+project+'</div>'});
		if (project == lastProject) { //if project == lastProject
			projectItem.addClass('grid-active');//add Active tag to lastProject

			const query = todoProjects.where('project','==',project).orderBy('subject','asc');
			query.onSnapshot(items => {
				$('.todoItem').remove();
				let lastSubject = 'firstSubject';
				items.forEach(doc => {
					const data = doc.data()
					
					const item = $('<div>',{class:'todoCheck','data-id':doc.id,text:data.item})
					item.addClass((data.checked)?' todoChecked':'')
					item.addClass((data.checked && !showDone)?' hide':' ')

					if (lastSubject != data.subject){//if new subject
						lastSubject = data.subject; //make lastSubject newSubject
						obj = $('<div>',{class:'gridItem'})
						.append($('<div>',{class:'itemNav',html:"<div class='todoAdd mdi mdi-plus'></div><div class='todoNavRemove mdi mdi-close'></div>"}))//create nav
						.append($('<div>',{class:'todoSubject',text:lastSubject}))
						.append(item)
						
						$('.todoItems').append(obj)//add object to all items
					}else{
						$('.gridItem').last().append(item)//add object to lastSubject
					}
				})
			})
			$('#newProject').text(project)
		}
		$('.todoProjects').append(projectItem);
	})
})

$(document).on('click','.todoProjects>div:not(.grid-active)',function(){//change last Project (tab)
	let val = $(this).text()
	todoProjects.doc('--init--').update({
		lastOpened: val
	})
})

$(document).on('click','.todoCheck:not(.newCheck)',function(){//change check state
	$('.todoItems').children().remove()
	let id = $(this).data('id');
	$(this).toggleClass('todoChecked');
	todoProjects.doc(id).update({checked:$(this).hasClass('todoChecked')});
})

//ADD item
function onSucces(link) {
  console.log('submit form')
  if (link == 'todoPopAdd'){
    todoProjects.add({
			checked:false,
			project:$('#newProject').text(),
			subject:$('#newSubject').text(),
			item:$('#newItem').text()
		})
  }
}
$(document).on('click','.todoAdd',function(){//Setup addItem
	$('.newCheck').remove()
	obj = "<div class='todoCheck newCheck' contenteditable='true' placeholder='new item'><div>";
	$(this).parents('.gridItem').append(obj)
})

$(document).on('keydown','.newCheck',function(e){//create new item
	if(e.which == 13){
		e.preventDefault();
		todoProjects.add({
			checked:false,
			project:$('.grid-active').text(),
			subject:$(this).siblings('.todoSubject').text(),
			item:$(this).text()
		})
	}
})

// remove item
$(document).on('click','.todoNavRemove',function(){//Setup removeItem
	$('.todoRemove').removeClass('todoRemove')
	$(this).parents('.gridItem').addClass('todoRemove')
})

$(document).on('click','.todoNavRemove>div',function(){//removeItem
	let id = $(this).data('id');
	if(id){
		todoProjects.doc(id).delete().then()
		$(this).remove()
	}	
	$('.todoRemove').removeClass('todoRemove')
})

// info
$(document).on('click','.todoShowDone',function(){
	$(this).toggleClass('checked')
	console.log($('.todoShowDone').hasClass('checked'))
	todoProjects.doc('--init--').update({
		showDone: $('.todoShowDone').hasClass('checked')
	})
})