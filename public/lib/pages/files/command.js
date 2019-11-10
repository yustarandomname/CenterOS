fileCommands = {
	saveSource: 'users/' + 'tf7MLQVgQUg6sHcMq995tKcRVlv1' + '/files',
	saveFormat: {
		blocks: 0,
		fileurl: 'notes',
		folderid: 0,
		title: 'untitled',
		type: 'note',
		updateKey: 0
	},
	//edit : { func : () => console.log('to be implemented')},

	create: {
		note: {
			func: {
				hint: 'Inline form',
				icon: '📄',
				execute: () => {
					let content = [
						{ type: 'input', placeholder: 'Title' },
						{ type: 'input', placeholder: 'Type', value: 'note' }
					];
					createInlineForm('Create note', content, { Title: 'title', Type: 'type' });
				}
			}
		},
		presentation: {
			func: {
				hint: 'Inline form',
				icon: 'inlineForm',
				execute: () => {
					let content = [
						{ type: 'input', placeholder: 'Title' },
						{ type: 'input', placeholder: 'Type', value: 'presentation' }
					];
					createInlineForm('Create presentation', content, { Title: 'title', Type: 'type' });
				}
			}
		},
		pdf: {
			func: {
				hint: 'Inline form',
				icon: 'inlineForm',
				execute: () => {
					let content = [
						{ type: 'input', placeholder: 'Title' },
						{ type: 'input', placeholder: 'Type', value: 'pdf' }
					];
					createInlineForm('Create pdf', content, { Title: 'title', Type: 'type' });
				}
			}
		},
		func: {
			hint: 'Inline form',
			icon: '📄',
			execute: () => {
				let content = [ { type: 'input', placeholder: 'Title' }, { type: 'input', placeholder: 'Type' } ];
				createInlineForm('Create note', content, { Title: 'title', Type: 'type' });
			}
		}
	},

	func: {
		hint: 'Open app',
		icon: '⤅',
		execute: () => openApp('file')
	}
};
