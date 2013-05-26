// var cellWidth = 60;
// var cellHeight = 60
var context, ctx;


var map = Array([1,0,0,0,1,1],[1,0,0,1,1,1],[0,0,1,1,1,0],[1,1,1,1,1,1],[1,0,0,0,1,1], [1,0,0,0,1,1],[1,0,0,1,1,1],[0,0,1,1,1,0],[1,1,1,1,1,1],[1,0,0,0,1,1]);
// var map = Array([0,0,0],[0,0,0],[0,0,0]);
var mapX = 0;
var mapY = 0;

var DiamondRow = SK.Object.extend({
	isEven: false,

	_currentX: 0,

	_currentY: 0,

	_width: 0,

	_height: 0,

	_maxCellCount: 20,

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


function drawMap(){
	var tileH = 25;
	var tileW = 50;

	var xLength = 20;
	var yLength = 10;

	for(i=0; i < xLength; i++) {
		for(j=0; j < yLength; j++){
			var xpos = ((i-j) * tileH) + mapX;
			var ypos = ((i+j) * tileH / 2) + mapY;
			drawTile(xpos, ypos);
		}
	}
}

function drawTile(x, y) {
	context.beginPath();
    context.moveTo(x, y);
	context.lineTo(x + 25, y + 25 / 2);
    context.lineTo(x, y + 25);
	context.lineTo(x - 25, y + 25 / 2);
	context.lineTo(x, y);
    context.stroke();
    context.closePath();
}


$(function() {
	context = ctx = $("#gamescreen")[0].getContext('2d');

	drawMap();

	$('#gamescreen').click(function(e) {
	    var x = e.pageX;
	    var y = e.pageY;
	    
	    var ymouse = ((2 * (y - mapY) - x) - (25 + mapX)) / 2;
	    var xmouse = x + ymouse - mapX;
	    
		ymouse = Math.round(ymouse / 25);
	    xmouse = Math.round(xmouse / 25);

	    console.log('tileX  ' + xmouse + '  tileY = ' +  ymouse);
	})

	return;

	// var dr = DiamondRow.create(1, 0);
	// var dr = DiamondRow.create(1, 30);
	// var dr = DiamondRow.create(1, 60);
	// var dr = DiamondRow.create(1, 90);
	// var dr = DiamondRow.create(1, 120);
	// var dr = DiamondRow.create(1, 150);
	// var dr = DiamondRow.create(1, 180);
	// var dr = DiamondRow.create(1, 210);
	// var dr = DiamondRow.create(1, 150);
	// var dr = DiamondRow.create(1, 180);
	// var dr = DiamondRow.create(1, 210);
	// var dr = DiamondRow.create(1, 240);
	return;

	var xCenter = 60//cells_wide/2 * cellWidth;
	var yCenter = 0//cells_high/2 * cellWidth;

	context.beginPath();

	context.moveTo(xCenter, yCenter);
	context.lineTo(xCenter + cellWidth, yCenter + cellHeight / 2);
    context.lineTo(xCenter, yCenter + cellHeight);
	context.lineTo(xCenter - cellWidth, yCenter + cellHeight / 2);    
	context.lineTo(xCenter, yCenter);

    context.stroke();
    context.closePath();

});
