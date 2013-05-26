var canvas = document.getElementById('test_canvas');
var c = canvas.getContext('2d');

var texture = new Image();
texture.src = 'http://localhost:82/xkx/isometric_map/img/squareTexture.png';

drawDiamond();

function drawDiamond() {
	// Save the current context
	c.save();

	// Scale the results to a isometric/dimetric 2:1 ratio
	c.scale(1, 0.5);

	// Rotate the context 45 degrees
	c.rotate(45 * Math.PI / 180);

	// If we rotate the image on 0, 0 half of it will be displayed outside the canvas, so compensate
	c.drawImage(texture, 0, 0, texture.width, texture.height, texture.width / 2, (texture.height / 2) * -1, texture.width, texture.height);

	// Restore the context
	c.restore();
}
