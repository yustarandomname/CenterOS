var user;
const auth = firebase.auth();
const db = firebase.firestore();
const urlArray = window.location.href.split('/');
// const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

async function init() {
  try {
    user = await auth.currentUser;
  } catch{}
}

function show(selector){$('.'+selector).removeClass('hide')}
function dd(num) { if(num<10) return '0'+num; else return num;}

function onSucces(link){
  switch (link){
    case "loginUser":
      const email = $('.loginEmail').text(); //login Email // TODO: add validation
      const password = $('.loginPassword').text();

      auth.signInWithEmailAndPassword(email, password).then(cred => {
        user = cred;
        $('.input').text(''); //reset input text fields

      }).catch(function(error) {
        $('.inputError').removeClass('hide').text('No username or password was registered. Register or try again. ' + error.message)
      });
  }
}

function setCursorToEnd(target, end){
  let el = $('.searchfield');
  var range = document.createRange();
  var sel = window.getSelection();
  range.setStart(el.childNodes[0], end);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  el.focus();
}

$('body').css('background','#efefef');
