appCommands = {
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
	open: {
		icon: 'i-open',
		list: () => getFilesList()
	},
	create: {
		icon: 'i-community',
		note: {
			func: {
				hint: 'Inline form',
				icon: 'i-file',
				execute: () => openInlineForm('.formnewfile', { '.fileNewType': 'note' })
			}
		},
		presentation: {
			func: {
				hint: 'Inline form',
				icon: 'i-centeros',
				execute: () => openInlineForm('.formnewfile', { '.fileNewType': 'presentation' })
			}
		},
		pdf: {
			func: {
				hint: 'Inline form',
				icon: 'i-centeros',
				execute: () => openInlineForm('.formnewfile', { '.fileNewType': 'pdf' })
			}
		},
		func: {
			hint: 'Inline form',
			icon: 'i-centeros',
			execute: () => openInlineForm('.formnewfile', null)
		}
	}
};
