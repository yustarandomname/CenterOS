function getuid() {
	if (!firebase.auth().currentUser) {
		// if user is not loged in
		firebase.auth().signInWithEmailAndPassword('abeltest1@hotmail.com', '123456');
	}
	return firebase.auth().currentUser.uid;
}
