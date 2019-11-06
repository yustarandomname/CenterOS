// input
function validate(input){
	let val = input.text()
	switch (input.attr('type')){
		case 'date':
			let vArr = val.split('-')
			let d = parseInt(vArr[0]);
			let m = parseInt(vArr[1]);
			let y = parseInt(vArr[2]);
			if ((d<1) || (d>31) || (m<1) || (m>12) || (y<1900) || (y>2100)){input.siblings('.inputError').text('A date field is not filled in correctly').removeClass('hide');return false;}else{return true;}
			break;
		default :
			return true;
			break;
	}
}

function submitForm(that,link){
	let field = that.parents('div').children('.input');
	let isValid = true;

	field.each(function(index){
		val[index] = $(this).text();
		if (!$(this).text() || !validate($(this))) {
			isValid = false;
			$(this).addClass('inputNotFilled');
		}
	})

	if (isValid){ // if values are all valid
		if (link){ // if results are handeled within the app
			onSucces(link);
		}else{
			let src = commands
			let source = that.parents('.inlineForm').attr('source').split(' ');
			let variable = JSON.parse(that.parents('.inlineForm').attr('variable'));
			source.forEach(command => src = src[command]);

			Object.entries(variable).forEach((object) => {
				let selector = ".input[placeholder='"+object[0]+"']";
				let value = $(selector).text();
				src.saveFormat[object[1]] = value;
				console.log(value , src.saveFormat)
			})

			let saveSource = src.saveSource;
			let saveFormat = src.saveFormat;

			db.collection(saveSource).add(saveFormat);
		}
	}else{
		that.siblings('.inputError').removeClass('hide').text('a value is not correctly specified')
	}
}

$(document).on('keydown','.popupForm .input,.inlineForm .input',function(e){
	$(this).removeClass('inputNotFilled')
	if (e.which == 13) e.preventDefault();
})

$(document).on('keyup','.popupForm .input',function(e){//KEYDOWN
	let onSuccesLink = $(this).siblings('.inputSubmit').attr('onSucces')
	if ((e.which == 13)) submitForm($(this),onSuccesLink)
})

$(document).on('click','.inputSubmit',function(){
	let onSuccesLink = $(this).attr('onSucces');
	console.log(onSuccesLink);
	submitForm($(this),onSuccesLink)
})

// inlineForm
function createInlineForm(title,content,variable){
  $('.homescreen .inlineForm').remove(); //remove any existing formClose

  //create form(Header)
  let obj = $('<div>',{class:'inlineForm',source:'file', variable: JSON.stringify(variable)}); //source : commands['file']['saveFormat/saveSource'];
  let header = $('<div>',{class:'formHeader'})
  .append($('<div>',{class:'formTitle',text:title}))
  .append($('<div>',{class:'formClose mdi mdi-close'}))
  obj.append(header); //assemble form

  content.forEach(input => { //create input
    obj.append($('<div>',{class:input.type,text:input.value,'placeholder':input.placeholder, 'contenteditable':'true'}));
  })

  obj.append($('<div>',{class:'inputError hide'}));
  obj.append($('<div>',{class:'inputSubmit',html:'<span>submit form</span>'}))

  $('.homescreen').append(obj);//prepend form
}

// popupform
var moveWindow = false;
$(document).on('mousedown','.popupForm .subTitle',function(e){
	moveWindow = true;
	var tab = $(this).parents('.popupForm')
	var tabH = tab.height() / 2 - 30;
	$(document).on('mousemove','body',function(e){
		if (moveWindow){
			tab.css({
				top: e.clientY + tabH + 'px',
				left: e.clientX +'px'
			})
		}
	})
})
$(document).on('mouseup','body',function(){moveWindow = false;})

$(document).on('click','.popClose',function(){$(this).parent('.popupForm').addClass('hide');})
$(document).on('click','.menuPop',function(){ //toggleClass()
	popName = '.pop' + $(this).data('pop')
	$(popName).toggleClass('hide')
})
