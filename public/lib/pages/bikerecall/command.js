appCommands = {
	'place new bike': {
		icon: 'i-bike',
		func: {
			hint: 'Inline form',
			icon: 'i-functions',
			execute: () => openInlineForm('.formNewBike', null)
		},
		at: {
			icon: 'i-bike',
			list: () => getBikeLocations()
		}
	},
};
