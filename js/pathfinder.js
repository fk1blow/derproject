/* 
	- Separate the Target from the Map object
	- should have anotjher object named Board/Scene
	- the Scene will have a Map and a Target
*/

(function(XK) {

function getElemenent(x, y) {
	return $('#cell_' + x + '_' + y);
}

//=============================
//			Map
//=============================

XK.Map = SK.Object.extend({
	_defaultY: 0,

	_mapArray: null,

	initialize: function(map) {
		this._mapArray = map;

	},

	getNodeAt: function(x, y) {
		var xpos, ypos;
		xpos = this._mapArray[x];
		if(xpos == undefined)
			return null;

		ypos = this._mapArray[x][y];
		if(ypos == undefined)
			return null;
		return { x: x, y: this._mapArray[x][y] };
	},
	
	getTotalNodes: function() {
		var xLen = this._mapArray.length;
		return xLen * this._mapArray[0].length;
	}
});

//=============================
//			Node
//=============================

XK.Node = SK.Object.extend({
	// x and y represent the correspondence between the coordinates
	// and the values that those coords represent on the map
	x: 0,

	y: 0,

	// the actual position(points) on the map and their values
	position: null,

	map: null,

	neighbours: null,

	initialize: function(map) {
		this.map = map;
	},

	/* Positioning */

	setCurrentPosition: function(x, y) {
		this.x = x; this.y = y;
		this.position = this.map.getNodeAt(x, y);
		return this;
	},

	getCurrentPosition: function() {
		return this.position;
	},

	/* Neighbours */

	getNeighbours: function() {
		var arr = [];
		arr.push(this.getTop());
		// arr.push(this.getTopRight());
		arr.push(this.getRight());
		// arr.push(this.getBottomRight());
		arr.push(this.getBottom());
		// arr.push(this.getBottomLeft());
		arr.push(this.getLeft());
		// arr.push(this.getTopLeft());
		return arr;
	},

	/* Straight line siblings */

	getTop: function() {
		return this.map.getNodeAt(this.x - 1, this.y);
	},

	getRight: function() {
		return this.map.getNodeAt(this.x, this.y + 1);
	},

	getBottom: function() {
		return this.map.getNodeAt(this.x + 1, this.y);
	},

	getLeft: function() {
		return this.map.getNodeAt(this.x, this.y - 1);
	},

	/* Diagonal siblings */

	getTopLeft: function() {
		return this.map.getNodeAt(this.x - 1, this.y - 1);
	},

	getTopRight: function() {
		return this.map.getNodeAt(this.x + 1, this.y - 1);
	},

	getBottomLeft: function() {
		return this.map.getNodeAt(this.x - 1, this.y + 1);
	},

	getBottomRight: function() {
		return this.map.getNodeAt(this.x + 1, this.y + 1);
	}
});

//=============================
//			Pathfinder
//=============================

XK.Pathfinder = SK.Object.extend({
	targetNode: null,

	_startNode: null,

	_endNode: null,

	passedNodes: null,

	initialize: function(target) {
		this.targetNode = target;
	},


	calculateSiblings: function(end) {
		var siblings = this.targetNode.getNeighbours();
		var start = this.targetNode.getCurrentPosition();
		var passedNode = [];
		var current;
		var f, g, h;

		// cl(start)

		for(var i = 0; i < siblings.length; i++) {
			current = siblings[i];
			if(current == null)
				continue;
			h = this.getEstimatedCost(current, end) + 10;
			cl('h cost : ', h, ' for cell : ', current)
		}
	},

	search: function(graphSet, start, end) {
		
		this.calculateSiblings(end);
		// cl(getElemenent(pos.x, pos.y))

		// cl(this.getEstimatedCost())
		// this.setStartNode(start);
		// this.setEndNode(end);

		// var h = this.getEstimatedCost({x: currentX, y: currentY},
		// 	{ x: endX, y: endY });
		// var g = this.getNeighbourCost();
		// var cost = g + h;
		// return cost;
	},

	// H = heuristic cost function
	getEstimatedCost: function(start, end) {
		var absx = Math.abs(start.x - end.x);
		var absy = Math.abs(start.y - end.y);
		return 10 * (absx + absy);
	},

	/* Nodes */

	setStartNode: function(node) {
		this._startNode = { x: node.x, y: node.y };
	},

	setEndNode: function(node) {
		this._endNode = { x: node.x, y: node.y };
	},
});


}(window.XK || {}));