appCommands = {
	'create new excersise': {
		icon: 'i-bike',
		func: {
			hint: 'Create new exercise',
			icon: 'i-functions',
			execute: () => openInlineForm('.formNewExercise', null)
		}
	},
	func: {
		hint: 'Edit exercise',
		execute: () => console.log('to be implemented')
	}
};
