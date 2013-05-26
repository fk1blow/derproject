
//===========================
//			Tile
//===========================

define(function() {
	var Tile = SK.Object.extend({
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
			this.setColor(opt.color || '#000000');
		},

		/* Setters */

		setAttachedCanvas: function(val) {
			this.canvas = val;
			return this;
		},

		setColor: function(val) {
			this.color = val;
			// cl(this.color)
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

		draw: function(fillColor) {
			this.alreadyDrawn = true;
			this._drawRectangle(fillColor);
		},

		redraw: function(fillColor) {
			if(this.alreadyDrawn) {
				this._drawAndFillRectangle(fillColor);
				return true;
			}
			return false;
		},

		/* private */

		_drawCellIdText: function(x, y, textTag) {
			var ctx = this.canvas[0].getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillText(textTag, x, y);
		},

		_drawAndFillRectangle: function(fillColor) {
			var ctx = this.canvas[0].getContext('2d');
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.width, this.y);
			ctx.lineTo(this.x + this.width, this.y + this.height);
			ctx.lineTo(this.x, this.y + this.height);
			ctx.fillStyle = fillColor || this.color;
			ctx.fill();
			// this._drawCellIdText(this.x, this.y, this.x + ', ' + this.y);
		},

		_drawRectangle: function(fillColor) {
			var ctx = this.canvas[0].getContext('2d');
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.width, this.y);
			ctx.lineTo(this.x + this.width, this.y + this.height);
			ctx.lineTo(this.x, this.y + this.height);
			ctx.strokeStyle = fillColor || this.color;
			ctx.strokeRect(this.x, this.y, this.width, this.height);
			// this._drawCellIdText(this.x, this.y, 'asd');
		}
	});

	return Tile;
});