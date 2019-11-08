let fileCommands = {
	saveSource : "users/"+"tf7MLQVgQUg6sHcMq995tKcRVlv1"+"/files",
	saveFormat : {
		blocks : 0,
		fileurl : 'notes',
		folderid : 0,
		title : 'untitled',
		type : 'note',
		updateKey : 0
	},
	function : {
		hint : "Open app",
		icon : "openApp",
		execute : () => openApp('file')
	},
	//edit : { func : () => console.log('to be implemented')},

	create : {
		function : {
			hint : "Inline form",
			icon : "inlineForm",
			execute : () => {
					let content = [
							{type:'input', placeholder: 'Title'},
							{type:'input', placeholder: 'Type'},
					];
					createInlineForm('Create note',content,{Title:'title',Type:'type'});
			}
		},
		note : {
			function : {
				hint : "Inline form",
				icon : "inlineForm",
				execute : () => {
					let content = [
						{type:'input', placeholder: 'Title'},
						{type:'input', placeholder: 'Type', value: 'note'},
					];
					createInlineForm('Create note',content,{Title:'title',Type:'type'});
				}
			}
		},
		presentation : { 
			function : {
				hint : "Inline form",
				icon : "inlineForm",
				execute : () => {
					let content = [
						{type:'input', placeholder: 'Title'},
						{type:'input', placeholder: 'Type', value: 'presentation'},
					];
					createInlineForm('Create presentation',content,{Title:'title',Type:'type'});
				}
			}
		},
		pdf : {
			function : {
				hint : "Inline form",
				icon : "inlineForm",
				execute : () => {
					let content = [
						{type:'input', placeholder: 'Title'},
						{type:'input', placeholder: 'Type', value: 'pdf'},
					];
					createInlineForm('Create pdf',content,{Title:'title',Type:'type'});
				}
			}
		}
	}
},