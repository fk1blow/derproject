var cellWidth = 60;
var cellHeight = 60;
var context, ctx;

var DiamondRow = SK.Object.extend({
	isEven: false,

	_currentX: 0,

	_currentY: 0,

	_width: 0,

	_height: 0,

	_maxCellCount: 50,

	initialize: function(x, y, options) {
		var opt = options || {};
		this._currentX = x;
		this._currentY = y;
		this._width = opt.width || 30;
		this._height = opt.height || 30;
		this.buildRow();
	},

	updateX: function(val) {
		this._currentX = val;
	},

	updateY: function(val) {
		this._currentY = val;
	},

	buildRow: function() {
		var initialY = this._currentY;
		for(var i = 1; i <= this._maxCellCount; i++) {
			if(i % 2 == 0)
				this.updateY(this._currentY + (this._width / 2));
			else
				this.updateY(initialY);
			this.updateX(this._currentX + this._width);
			this._drawShape();
		}
	},

	_drawShape: function() {
		var x = this._currentX;
		var y = this._currentY;
		context.beginPath();
	    context.moveTo(x, y);
		context.lineTo(x + this._width, y + this._height / 2);
	    context.lineTo(x, y + this._height);
		context.lineTo(x - this._width, y + this._height / 2);    
		context.lineTo(x, y);
	    context.stroke();
	    context.closePath();
	}
});


$(function() {
	context = ctx = $("#gamescreen")[0].getContext('2d');

	// var dr = DiamondRow.create(1, 0);
	// var dr = DiamondRow.create(1, 30);
	// var dr = DiamondRow.create(1, 60);
	// var dr = DiamondRow.create(1, 90);
	// var dr = DiamondRow.create(1, 120);
	// var dr = DiamondRow.create(1, 150);
	// var dr = DiamondRow.create(1, 180);
	// var dr = DiamondRow.create(1, 210);
	// var dr = DiamondRow.create(1, 240);
	

	var xCenter = 100//cells_wide/2 * cellWidth;
	var yCenter = 100//cells_high/2 * cellWidth;

	context.beginPath();
    context.moveTo(xCenter, yCenter);
    
    context.lineTo(xCenter + cellWidth, yCenter + cellHeight / 2);
    context.lineTo(xCenter, yCenter + cellHeight);
	context.lineTo(xCenter - cellWidth, yCenter + cellHeight / 2);    
	context.lineTo(xCenter, yCenter);

    context.stroke();
    context.closePath();

});