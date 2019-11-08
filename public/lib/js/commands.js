var val = [];

let installed = [
	{name:"go",pageSrc:"/main/goCommand.js",commandSrc:() => goCommands},
	{name:"files",pageSrc:"files/command.js",commandSrc:() => filecommands}
]

function openApp(app){console.log(`app: ${app} is opened`);}

function suggestField () {
	let suggestions = [];

	let val = $('.searchfield').val();
	let splitval = val.split(' ');
	let lastArg = splitval[splitval.length - 1];
	
	if (splitval.length == 1) { // if there is 0 / 1 argument
		installed.forEach((obj) => {
			suggestions.push(obj.name);
		})
		console.log(suggestions);
	} else { // if there is at least 1 argument
		console.warn("second arg is not yet implemented")
	}

	// print suggestions
	$('.searchresults').children().remove(); // reset values in searchresults
	suggestions.forEach((suggestion) => {
		let obj = $('<div>',{class:'resultitem',text:suggestion});
		$('.searchresults').append(obj);
	})

	$('.searchError').addClass('hide');
	$('.resultitem').first().addClass('active');

	if ($('.searchresults').text()) {
		$('.searchresults').removeClass('hide');
	}else{
		$('.searchresults').addClass('hide');
	}
}
// function suggestField (){
//   $('.searchresults').children().remove();
//   let src = commands;
//   let val = $('.searchfield').val();
//   let splitval = val.split(' ');
//   let arg = splitval[splitval.length - 1];

//   for (i = 0; i < splitval.length -1; i++) src = src[splitval[i]];

//   // //todo : check if there are hints avialble
//   Object.keys(src).forEach((hint, index) => { //go thruogh all object children names
//     if (index < 6 && (hint.match(arg) || !arg)){ //if there are hints and 'hint' has letter which matches 'arg'
//       switch (hint){ // if hint is special case
//         case 'func':
//           $('.searchresults').append($('<div>',{class:'resultitem resultFunction',text:val}))
//           break;
//         case 'saveSource':
//         case 'saveFormat':
//           break;
//         default:
//           obj = (hint == splitval[splitval.length - 1] && src[hint].func) ? $('<div>',{class:'resultitem resultFunction',text:val}) : $('<div>',{class:'resultitem',text:hint});
//           $('.searchresults').append(obj);
//       }

//     }
//   })

//   $('.searchError').addClass('hide');
//   $('.resultitem').first().addClass('active');

//   // check if suggestion field has any items
//   if ($('.searchresults').text()) {
//     $('.searchresults').removeClass('hide');
//   }else{
//     $('.searchresults').addClass('hide');
//   }
// }

function appendSuggestion(suggestion){
	let text = $('.searchfield').val();
	let lastIndex = text.lastIndexOf(" ");
	let fullText = text.substring(0, lastIndex) + ((text.split(' ').length > 1)?' ':'') + suggestion + ' ';

	$('.searchfield').val(fullText);
}

// function exicuteFunction() { //change searchfield to active
//   let src = commands;

//   if ($('.active').hasClass('resultFunction')){ // active is a funtion
//     let val = $('.resultFunction.active').text();
//     val = (val.slice(-1) == ' ')? val.slice(0, -1).split(' ') : val.split(' '); //remove space if val has space at end
//     val.forEach(opp => {src = (src[opp])?src[opp] : src;}) //if function doesn't make sense, tries to make sense of command

//     src.func();
//     $('.searchfield').val('');
//     $('.searchresults').children().remove();
//   }else{
//     $('.searchError').removeClass('hide').text('This command is not a function');
//   }
// }

$('.searchbar').keydown(function(e){
	switch (e.which) {
		case 9: //tab
			e.preventDefault();
			appendSuggestion($('.resultitem.active').text())
			break;
		case 13: //enter
			e.preventDefault();
			exicuteFunction();
			break;
		case 38: //up
			e.preventDefault();
			for (let i = 0; i<$('.resultitem').length;i++) {
				if ($('.resultitem').eq(i).hasClass('active')) {
					$('.resultitem').eq(i-1).addClass('active').siblings().removeClass('active');
					break;
				}
			};
			break;
		case 40:
			e.preventDefault();
			for (let i = 0; i<$('.resultitem').length;i++) {
				if ($('.resultitem').eq(i).hasClass('active')) {
					$('.resultitem').eq(i+1).addClass('active').siblings().removeClass('active');
					break;
				}
			};
			break;
	}
})

$('.searchfield').keyup(function(e){
	if (e.which != 38 && e.which != 40 && e.which != 13){
		suggestField();
	}
})

$(document).on('click','.resultitem',function(){
	if (!$(this).hasClass('.resultFunction')) appendSuggestion($(this).text());
	suggestField();
})
