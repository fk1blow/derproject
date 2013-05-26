var gridCanvas;
var drawer;
var ctx;
var grid;
var clip;

var XK = {};

/**
 * Mouse handler
 */
XK.Mouse = {
	x: 0,

	y: 0,

	isPressed: false,

	getCurrentX: function() {
		return this.x;
	},

	getCurrentY: function() {
		return this.y;
	},

	setCurrentX: function(val) {
		this.x = val;
	},

	setCurrentY: function(val) {
		this.y = val;
	}
};


/**
 * Drawer class
 */
XK.Drawer = {
	drawRectangle: function(canvas, startX, startY, width, height) {
		var x = startX, y = startY;
		var ctx = canvas[0].getContext('2d');
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + width, y);
		ctx.lineTo(x + width, y + height);
		ctx.lineTo(x, y + height);
		ctx.fill();
	}
};


/**
 * Grid Cell
 */
XK.GridCell = SK.Object.extend({
	width: 0,

	height: 0,

	x: 0,

	y: 0,

	canvas: null,

	color: null,

	alreadyDrawn: false,

	initialize: function(x, y, width, height, options) {
		var opt = options || {};
		this.x = x;
		this.y = y;
		this.setWidth(width || 40);
		this.setHeight(height || 40);
		this.setColor(opt.color || 'red');
	},

	/* Setters */

	setAttachedCanvas: function(val) {
		this.canvas = val;
		return this;
	},

	setColor: function(val) {
		this.color = val;
		return this;
	},

	setHeight: function(val) {
		this.height = val;
		return this;
	},

	setWidth: function(val) {
		this.width = val;
		return this;
	},

	/* public commands */

	draw: function(canvas, fillColor) {
		this.setAttachedCanvas(canvas);
		this.setColor(fillColor);
		this.alreadyDrawn = true;
		this._drawRectangle.apply(this, arguments);
	},

	/*redraw: function(canvas) {
		if(this.alreadyDrawn) {
			this._drawRectangle(this.canvas, this.color);
			return true;
		}
		return false;
	},*/

	redraw: function(canvas) {
		var ctx = this.canvas[0].getContext('2d');
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + this.width, this.y);
		ctx.lineTo(this.x + this.width, this.y + this.height);
		ctx.lineTo(this.x, this.y + this.height);
		// ctx.fillStyle = '#ffa500';
		// ctx.fill()
		ctx.strokeStyle = 'red';
		ctx.strokeRect(this.x, this.y, this.width, this.height);
	},

	/* private */

	_drawRectangle: function(canvas, fillColor) {
		var ctx = canvas[0].getContext('2d');
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + this.width, this.y);
		ctx.lineTo(this.x + this.width, this.y + this.height);
		ctx.lineTo(this.x, this.y + this.height);
		// ctx.fillStyle = '#ffa500';
		// ctx.fill()
		ctx.strokeStyle = this.color
		ctx.strokeRect(this.x, this.y, this.width, this.height);
	}
});


/**
 * Grid generator
 */
XK.Grid = SK.Object.extend({
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
				var cell = XK.GridCell.create(lastX, lastY, this.cellWidth, this.cellHeight);
				cell.draw(this.canvas);
				this.pushToMap(i - 1, j - 1, cell);
				this._drawCellIdText(lastX + 2, lastY + 12, (i - 1) + ',' + (j - 1));
				lastY += this.cellHeight;
			}

			lastX += this.cellWidth;
		}
	},

	_drawCellIdText: function(x, y, textTag) {
		var ctx = this.canvas[0].getContext('2d');
		// ctx.fillStyle = 'white';
		ctx.fillText(textTag, x, y);
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

		- getCellByMouse and getCellByVector
		should cache the indexes of the previous found cells
		and return the pointer to those cell instead
	*/

	/**
	 * Gets cell by vector coordinates
	 * 
	 * @param  {Integer} x vector [x]
	 * @param  {Integer} y vector [x][y]
	 * @return {Object}  Cell object
	 */
	getCellByVectorCoords: function(x, y) {
		var xc = this.map[x];
		if(!xc) return null;
		return this.map[x][y];
	},

	/**
	 * Gets a cell by mouse x, y coordinates
	 * 
	 * @param {Integer} mouseX mouse x cooordinate - XK.Mouse.getCurrentX()
	 * @param {Integer} mouseY mouse Y cooordinate - XK.Mouse.getCurrentY()
	 * @return {Object} Cell object
	 */
	getCellByMouseCoords: function(mouseX, mouseY) {
		var offsetLeft = this.startX;
		var offsetTop = this.startY;
		var cell = {
			x: Math.floor((mouseX - offsetLeft) / this.cellWidth),
			y: Math.floor((mouseY - offsetTop) / this.cellHeight)
		};
		// return this.map[cell.x][cell.y];
		// return this.getCellByVectorCoords(cell.x, cell.y);
		return {
			cell: this.getCellByVectorCoords(cell.x, cell.y),
			index: new Array(cell.x, cell.y)
		};
	}
});


/**
 * Clip area rectangle
 */
XK.ClipArea = SK.Object.extend({
	el: null,

	left: 0,

	top: 0,

	width: 0,

	height:0,

	cellWidth: 40,

	cellHeight: 40,

	gridObject: null,

	border: 2,

	initialize: function(clipEl, grid, options) {
		var opt = options || {};
		this.el = clipEl;
		this.gridObject = grid;
		this.setBoxWidth(opt.width);
		this.setBoxHeight(opt.height);
		this._activate();
	},

	_activate: function() {
		var self = this;
		this.el.draggable({
			drag: function(evt, ui) {
				self.setBoxOffset(ui.position);
				self.test(evt, ui);
			}
		});
	},

	test: function() {
		// var clippedArea = this.getTotalClippedCells();
		this.getClippedCells();
	},

	getClippedCells: function() {
		var startCell = this.gridObject.getCellByMouseCoords(this.left, this.top);
		startCell.cell.redraw()

		var startCellb = this.gridObject.getCellByMouseCoords(this.left + 40, this.top);
		startCellb.cell.redraw()
		// var row = this.getClippedRow(startCell.index[0], startCell.index[1]);

		// for(var cell in row) {
		// 	cell(cell)
		// }
		// var column = this.getClippedColumn(startCell.index[1]);
	},

	getClippedRow: function(startX, startY) {
		var rowWidth = 1;
		var cells = [];

		for(var i = 0; i < rowWidth; i++) {
			var cell = this.gridObject.getCellByVectorCoords(startX + i, startY);
			// cells.push(cell);
			cell.redraw()
		}
		// cl(cells)
		// return cells;
	},

	getClippedColumn: function(cellY) {
		//
	},







	/* width, height setters */

	setBoxWidth: function(val) {
		this.width = val || 120;
	},

	setBoxHeight: function(val) {
		this.height = val || 120;
	},

	/* Offset setters */

	setBoxOffset: function(position) {
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


var fitCanvasToViewport = function(canvasEl) {
	var $window = $(window);
	var viewport = { w: $window.width(), h: $window.height() };
	// convert to an even number
	canvasEl.attr('width', (viewport.w % 2 > 0) ? viewport.w -= 1 : viewport.w);
	canvasEl.attr('height', (viewport.h % 2 > 0) ? viewport.h -= 1 : viewport.h);
}


$(function() {
	return;

	var $gridCanvasEl = $('#gamescreen');

	// resize canvas to fit viewport
	fitCanvasToViewport( $gridCanvasEl );

	// initialize grid
	grid = XK.Grid.create($gridCanvasEl, {
		cols: 26,
		rows: 14,
		cellWidth: 40,
		cellHeight: 40,
		startX: 1,
		startY: 1
	});
	grid.generate();

	// initialize clip area
	clip = XK.ClipArea.create($("#clip"), grid, {
		width: 120,
		height: 120,
		cellWidth: 40,
		cellHeight: 40
	});
	// width.getClippedArea(function(area) {
	// 	cl(area)
	// });


	// Mouse handlers
	$(document).mousemove(function(evt) {
		XK.Mouse.setCurrentX(evt.clientX);
		XK.Mouse.setCurrentY(evt.clientY);
		// cl(Math.floor(evt.clientX / 40), Math.floor(evt.clientY / 40))
	});
});