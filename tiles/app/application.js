define(['mouse', 'grid', 'tile', 'cliparea'], function(Mouse, Grid, Tile, ClipArea) {
	window.XK = {
		Mouse: Mouse,
		Grid: Grid,
		Tile: Tile,
		Clip: ClipArea
	};


	var fitCanvasToViewport = function(canvasEl) {
		var $window = $(window);
		var viewport = { w: $window.width(), h: $window.height() };
		// convert to an even number
		canvasEl.attr('width', (viewport.w % 2 > 0) ? viewport.w -= 1 : viewport.w);
		canvasEl.attr('height', (viewport.h % 2 > 0) ? viewport.h -= 1 : viewport.h);
	}


	$(function() {
		var $gridCanvasEl = $('#gamescreen');


		// resize canvas to fit viewport
		fitCanvasToViewport( $gridCanvasEl );


		// initialize grid
		var grid = Grid.create($gridCanvasEl, {
			cols: 40,
			rows: 20,
			cellWidth: 40,
			cellHeight: 40,
			startX: 1,
			startY: 1
		});
		grid.generate();

		
		// initialize clip area
		var clip = ClipArea.create(grid, {
			width: 10,
			height: 10,
			cellWidth: 40,
			cellHeight: 40
		});
		

		// Mouse handlers
		$(document).mousemove(function(evt) {
			Mouse.setCurrentX(evt.clientX);
			Mouse.setCurrentY(evt.clientY);
		});
	});
});