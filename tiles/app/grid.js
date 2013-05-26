
//===========================
//			Grid
//===========================

define(['tile'], function(Tile) {

	var Grid = SK.Object.extend({
		map: null,

		rows: 0,

		cols: 0,

		cellWidth: 0,

		cellHeight: 0,

		startX: 0,

		startY: 0,

		canvas: null,

		initialize: function(canvas, options) {
			var opt = options || {};
			this.canvas = canvas;
			this.rows = opt.rows || 4;
			this.cols = opt.cols || 4;
			this.cellWidth = opt.cellWidth || 40;
			this.cellHeight = opt.cellHeight || 40;
			this.setStartX(opt.startX);
			this.setStartY(opt.startY);
			this.initializeMap();
		},

		setStartX: function(val) {
			var middleX = ($(window).width() / 2) - (this.cellWidth * this.cols / 2);
			this.startX = val || middleX;
		},

		setStartY: function(val) {
			var middleY = $(window).height() / 2 - (this.cellHeight * this.rows / 2);
			this.startY = val || middleY;
		},

		generate: function() {
			var lastX = this.startX;
			var lastY = this.startY;

			for(var i = 1; i <= this.cols; i++) {
				lastY = this.startY;

				for(var j = 1; j <= this.rows; j++) {
					var cell = Tile.create(lastX, lastY, this.cellWidth, this.cellHeight);
					cell.setAttachedCanvas(this.canvas).draw();
					this.pushToMap(i - 1, j - 1, cell);
					lastY += this.cellHeight;
				}

				lastX += this.cellWidth;
			}
		},

		pushToMap: function(x, y, value) {
			this.map[x][y] = value;
		},

		popFromMap: function() {
			//
		},

		initializeMap: function() {
			this.map = new Array(this.cols);
			var len = this.map.length;
			for(var i = 0; i < len; i++) {
				this.map[i] = new Array(this.rows);
			}
		},

		/* 
			!!!!!!!!!!!!!!!!!!!!!!
			CACHE the cell getters
			!!!!!!!!!!!!!!!!!!!!!!

			- getTileByMouseCoords and getTileByVectorCoords
			should cache the indexes of the previous found tiles
			and return the pointer to those tiles instead
		*/

		/**
		 * Gets tile by vector coordinates
		 * 
		 * @param  {Integer} x vector [x]
		 * @param  {Integer} y vector [x][y]
		 * @return {Object}  Cell object
		 */
		getTileByVectorCoords: function(x, y) {
			var xc = this.map[x];
			if(!xc)
				return null;
			return this.map[x][y];
		},

		/**
		 * Gets a tile by mouse x, y coordinates
		 * 
		 * @param {Integer} mouseX mouse x cooordinate - XK.Mouse.getCurrentX()
		 * @param {Integer} mouseY mouse Y cooordinate - XK.Mouse.getCurrentY()
		 * @return {Object} Cell object
		 */
		getTileByMouseCoords: function(mouseX, mouseY) {
			var cell = this.getTileIndexesByMouseCoords(mouseX, mouseY);
			return this.getTileByVectorCoords(cell.x, cell.y);
		},

		/**
		 * Returns a tile's index by mouse coords
		 * 
		 * @param  {Integer} mx mouse x coordinate
		 * @param  {Integer} my mouse y coordinate
		 * @return {Object} the indexes of the tile
		 */
		getTileIndexesByMouseCoords: function(mx, my) {
			// tile index -> (mouse current x location - tile x location) / tile width
			return {
				x: Math.floor((mx - this.startX) / this.cellWidth),
				y: Math.floor((my - this.startY) / this.cellHeight)
			};
		},

		/**
		 * Returns a tile by specifying the index
		 * @param  {Object} tile a tile object
		 * @return {Object} returns the indexes at which the tile is located(inside the map vector)
		 */
		getTileIndex: function(tile) {
			var cell = this.getTileIndexesByMouseCoords(tile.x, tile.y);
			var tileVectorCoords = this.getTileByVectorCoords(cell.x, cell.y);
			return cell;
		}
	});

	return Grid;
});