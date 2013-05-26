var cellWidth = 30;
var cellHeight = 30;
var context, ctx;

/* not used */
function getCellBoundaries(theCellX, theCellY) {

    //right
    var aOffset = { "offsetX": (cellWidth * -1) / 2, "offsetY": (cellHeight * -1) / 2 };
    var aCell = { "x": theCellX, "y": theCellY };
    var p1 = getScreenCoords(aCell, aOffset);

    //bottom
    aOffset = { "offsetX": (cellWidth) / 2, "offsetY": (cellHeight * -1) / 2 };
    var p2 = getScreenCoords(aCell, aOffset);

    //left
    aOffset = { "offsetX": (cellWidth) / 2, "offsetY": (cellHeight) / 2 };
    var p3 = getScreenCoords(aCell, aOffset);

    //top
    aOffset = { "offsetX": (cellWidth * -1) / 2, "offsetY": (cellHeight) / 2 };
    var p4 = getScreenCoords(aCell, aOffset);

    return { "point1": p1, "point2": p2, "point3": p3, "point4": p4 };
}

/* not used */
function getScreenCoords(Cell, offset) {


    var posX = Cell.x * cellWidth + offset.offsetX;
    var posZ = Cell.y * cellHeight - offset.offsetY;

    var xCart = (posX - posZ)
    var yCart = (posX + posZ) / 2;


    var rX = -xCart + 400;
    var rY = +yCart + 300;

    return { "x": Math.floor(rX), "y": Math.floor(rY) };


}

/* not used */
function drawIsoCellBorders (cellX, cellY) {

    var cellPoints = getCellBoundaries(cellX, cellY);
    context.beginPath();
    context.strokeStyle = "red";
    context.moveTo(cellPoints.point1.x, cellPoints.point1.y);   
    context.lineTo(cellPoints.point2.x, cellPoints.point2.y);   
    context.lineTo(cellPoints.point3.x, cellPoints.point3.y);   
    context.lineTo(cellPoints.point4.x, cellPoints.point4.y);
    context.lineTo(cellPoints.point1.x, cellPoints.point1.y);

    console.log("Translated:");
    console.log("Bottom: " + cellPoints.point2.x+","+ cellPoints.point2.y);         
    console.log("Right:" + cellPoints.point1.x +","+ cellPoints.point1.y);  
    console.log("Top:" + cellPoints.point4.x+","+ cellPoints.point4.y);
    console.log("Left: " + cellPoints.point3.x+","+ cellPoints.point3.y);   


    context.stroke();
    context.closePath();

}

function drawSquare(startX, startY, width) {
	// border width
	var startX = startX + 1;
	var startY = startY + 1;

	context.moveTo(startX, startY); //move to top left corner
	// cl('moveTo :: ', startX)

	context.lineTo(startX + width, startY); //move to top right corner
	// cl('lineTo :: ', startX + width, startY)
	
	context.lineTo(startX + width, startY + width); //move to bottom right corner
	// cl('lineTo :: ', startX + width, startY + width)

	context.lineTo(startX, startY + width); //move to bottom left corner
	// cl('lineTo :: ', startX, startY + width)

	context.lineTo(startX, startY); //move back to top left corner
	// cl('lineTo :: ', startX, startY)


	context.stroke(); //draw and yay - we've got a little gray square in the center of our canvas
	// context.fill()
	context.closePath();
}


var maxLen = { x: 60, y: 50 };
var end = 20;

function drawGrid(startX, startY, width) {
	var startX = startX || 0;
	var startY = startY || 0;
	var width = width || 20;

	// if(maxLen.x)


	for(var i = 0; i < maxLen.x; i++) {
		drawSquare(i * width, startY, width);
		for(var j = 0; j < maxLen.y; j++) {
			drawSquare(i * width, (startY + width) * j, width);
		}
	}
}


$(function() {
	context = ctx = $("#gamescreen")[0].getContext('2d');

	// drawSquare(0, 0, 20)
	// drawSquare(20, 0, 20)
	// drawSquare(40, 0, 20)
	// drawSquare(60, 0, 20)
	// drawSquare(80, 0, 20)
	// drawSquare(100, 0, 20)

	// drawSquare(0, 20, 20)
	// drawSquare(0, 40, 20)
	// drawSquare(0, 60, 20)
	// drawSquare(0, 80, 20)
	// drawSquare(0, 100, 20)

	drawGrid();
	


	return;

	/*let's saw we want to draw an isometric square in the center of the page. 
	Before we do that though, let;s draw a normal square in the center of the page 
	so you know where some of these wild assumptions come from. To do that, we need to know 
	where the square should go. We know our canvas is 800 wide and our cells are 30 wide so
	we can assume that our canvas can fit around 800/30 cells.*/
	var cells_wide = 800/cellWidth;
	var cells_high = 600/cellHeight;

	//half are our centers positions for 2d
	var xCenter = cells_wide/2 * cellWidth;
	var yCenter = cells_high/2 * cellWidth;

	//to draw a square in the center of the canvas, we just draw the points.
	context.beginPath();
	// context.strokeStyle = "blue";
	context.moveTo(xCenter-cellWidth,yCenter-cellHeight); //move to top left corner
	context.lineTo(xCenter+cellWidth, yCenter-cellHeight); //move to top right corner
	context.lineTo(xCenter+cellWidth, yCenter+cellHeight); //move to bottom right corner
	context.lineTo(xCenter-cellWidth, yCenter+cellHeight); //move to bottom left corner
	context.lineTo(xCenter-cellWidth,yCenter-cellHeight); //move back to top left corner
	context.stroke(); //draw and yay - we've got a little gray square in the center of our canvas
	context.closePath();
});