	var cellWidth = 30;
    var cellHeight = 30;
    var context;
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
    function getScreenCoords(Cell, offset) {


        var posX = Cell.x * cellWidth + offset.offsetX;
        var posZ = Cell.y * cellHeight - offset.offsetY;

        var xCart = (posX - posZ)
        var yCart = (posX + posZ) / 2;


        var rX = -xCart + 400;
        var rY = +yCart + 300;

        return { "x": Math.floor(rX), "y": Math.floor(rY) };


    }


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

$(function() {



	context = $("#gamescreen")[0].getContext('2d');

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

    var centerCellNumberX = cells_wide/2;
    var centerCellNumberY = cells_high/2;




    //to draw a square in the center of the canvas, we just draw the points.
    context.beginPath();
    context.strokeStyle = "blue";
    context.moveTo(xCenter-cellWidth/2,yCenter-cellHeight/2); //move to top left corner
    context.lineTo(xCenter+cellWidth/2, yCenter-cellHeight/2); //move to top right corner
    context.lineTo(xCenter+cellWidth/2, yCenter+cellHeight/2); //move to bottom right corner
    context.lineTo(xCenter-cellWidth/2, yCenter+cellHeight/2); //move to bottom left corner
    context.lineTo(xCenter-cellWidth/2,yCenter-cellHeight/2); //move back to top left corner
    context.stroke(); //draw and yay - we've got a little gray square in the center of our canvas
    context.closePath();

    //now, give this an isometric perspective is pretty easy, we essentially tilt the square.
    //a sort of simplified way to do this is as follows - 
    //It means that we essentially draw a diamond instead of a square, and then halve the height
    //and double the width.
    //the first point, (the top of the diamond) is 1/2 the width of the square from where the top left
    //corner of a normal square would be, to the right
    //to Draw: first clear our other rect
    //context.clearRect(0, 0, 800, 600);
    context.beginPath();
    context.strokeStyle = "gray";
    console.log("Hacked:");
    context.moveTo(xCenter, yCenter+cellHeight/2); //bottom of diamond
    console.log("Bottom: " + xCenter + "," + (yCenter+cellHeight/2)); //bottom of diamond

    context.lineTo(xCenter+cellWidth, yCenter); //right of diamond
    console.log("Right:" + (xCenter+cellWidth) + "," + yCenter); //right of diamond

    context.lineTo(xCenter,yCenter-cellHeight/2); //top of diamond
    console.log("Top:" + xCenter + "," + (yCenter-cellHeight/2)); //top of diamond

    context.lineTo(xCenter-cellWidth, yCenter); //left of diamond
    console.log("Left: " + (xCenter-cellWidth) + "," +yCenter); //left of diamond

    context.lineTo(xCenter, yCenter+cellHeight/2); //back to bottom of diamond
    context.stroke(); //boom, we have an isotile and isopositioning based on some 2s cell-grid coord 
    context.closePath();

    //now let's draw the same exact iso polygon but use our transform   
    // drawIsoCellBorders(0,0);

});
