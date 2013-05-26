
//===========================
//			Clip area
//===========================

define(function() {
	var ClipArea = SK.Object.extend({
		el: null,

		left: 0,

		top: 0,

		width: 0,

		height:0,

		cellWidth: 40,

		cellHeight: 40,

		gridObject: null,

		border: 2,

		cacheTiles: null,

		initialize: function(grid, options) {
			var opt = options || {};
			this.el = $("#clip");
			this.gridObject = grid;
			this.cacheTiles = [];
			this.setBoxWidth(opt.width);
			this.setBoxHeight(opt.height);
			this._initDraggable();
		},

		_initDraggable: function() {
			var self = this;
			this.el.draggable({
				drag: function(evt, ui) {
					self.setBoxOffsets(ui.position);
					self.buildClipAreaTiles();
				}
			});
		},

		buildClipAreaTiles: function() {
			this.drawTilesToClipRange(this.left, this.top, { x: -1, y: -1 }, { x: 3, y: 3 });
			return this;
		},

		drawTilesToClipRange: function(mouseX, mouseY, startRange, endRange) {
			var index = this.gridObject.getTileIndexesByMouseCoords(mouseX, mouseY);
			var tiles = this._buildRangeArrayTiles(index, startRange, endRange);

			this.clearTilesFromClipRange();

			for(var i = 0; i < tiles.length; i++) {
				tiles[i].draw('#fff');
				this.cacheTiles.push(tiles[i]);
			}
		},

		clearTilesFromClipRange: function() {
			for(var i = 0; i < this.cacheTiles.length; i++) {
				// cl(this.cacheTiles[i])
				// this.cacheTiles[i].redraw('#fff');
				this.cacheTiles[i].draw();
				// this.cacheTiles[i].redraw('');
				// this.cacheTiles[i].redraw('#fff');
				// this.cacheTiles.splice(1, this.cacheTiles[i].indexOf())
			}
			this.cacheTiles = [];
			// var tiles = currentClippedTiles, len = tiles.length;
			// for(var i = 0; i < len; i++) {
			// 	cl(tiles[i])
			// 	// tiles[i].redraw();
			// }
			// cl(this.cacheTiles)
		},

		_buildRangeArrayTiles: function(startIndex, startRange, endRange) {
			var xrange = [];
			var yrange = [];
			var tilesArr = [];
			// var rangeArr = [];

			var startX = startIndex.x + startRange.x;
			var endX = startIndex.x + endRange.x;

			for(var i = startX; i <= endX; i++) {
				var startY = startIndex.y + startRange.y;
				var endY = startIndex.y + endRange.y;

				for(var j = startY; j <= endY; j++) {
					var tile = this.gridObject.getTileByVectorCoords(i, j);
					tilesArr.push(tile);
				}
			}

			return tilesArr;
		},


		/*
			Setters / Public interface
		*/


		setBoxWidth: function(val) {
			this.width = val || 120;
		},

		setBoxHeight: function(val) {
			this.height = val || 120;
		},

		setBoxOffsets: function(position) {
			this.setLeftOffset(position.left);
			this.setTopOffset(position.top);
		},

		setLeftOffset: function(val) {
			var val = val > 0 ? val : 0;
			this.left = val - this.border;
		},

		setTopOffset: function(val) {
			var val = val > 0 ? val : 0;
			this.top = val - this.border;
		}
	});

	return ClipArea;
});