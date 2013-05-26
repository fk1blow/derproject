/**
 * Mouse handler
 */
define(function() {
	var Mouse = {
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

	return Mouse;
});