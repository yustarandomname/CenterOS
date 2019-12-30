var userid;

function getuid() {
	if (userid) {
		return userid;
	} else {
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				hide('.loginscreen');
				show('.homescreen');

				userid = user.uid;
				return userid;
			}
		});
	}
}

getuid();
