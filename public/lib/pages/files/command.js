appCommands = {
	open: {
		icon: 'i-open',
		list: () => getFilesList()
	},
	create: {
		icon: 'i-community',
		note: {
			func: {
				hint: 'Inline form',
				execute: () => openInlineForm('.formnewfile', { '.fileNewType': 'note' })
			}
		},
		presentation: {
			func: {
				hint: 'open inline form',
				icon: 'i-centeros',
				execute: () => openInlineForm('.formnewfile', { '.fileNewType': 'presentation' })
			}
		},
		pdf: {
			icon: 'i-pdf',
			func: {
				hint: 'open inline form',
				icon: 'i-pdf',
				execute: () => openInlineForm('.formnewfile', { '.fileNewType': 'pdf' })
			}
		},
		func: {
			hint: 'open inline form',
			execute: () => openInlineForm('.formnewfile', null)
		}
	},
	edit: { func: { execute: () => console.log('to be implemented') } }
};
