require.config({
	paths: {
		jquery: 	'../../js/libs/jquery-1.7.2.min',
		jqueryui: 	'//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min',
		console: 	'../../js/libs/console.wrapper',
		seek: 		'../../js/libs/seek-a-boo',
		app:  		'app'
	},
	
	baseUrl: './app'
});

require(['bootstrap']);