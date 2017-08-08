;
(function($) {


var pad = 5;
var pad_b = 4;
var pad_t = 5;
var pad_h = 10;

// var dx = canvas.width() - pad*2 - pad_b*2;
// var dy = canvas.height() - pad*2 - pad_b*2
// var dx2 = dx/3;
// var x = pad + pad_b;
// var y = pad + pad_b;


function getDeloId() {
	var url = window.location.href;
	var re = /delo\/show\/(\d+)/;
	var match = url.match(re);
	return match ? match[1] : '';
}


function boardGrid(canvas) {
	var x = pad;
	var y = pad;
	var dx = canvas.width() - pad - pad;
	var dy = canvas.height() - pad -pad;

	canvas.drawRect({
		layer: true,
		strokeStyle: 'black',
		strokeWidth: 1,
		fillStyle: "white",
		x: x,
		y: y,
		width: dx,
		height: dy,
		fromCenter: false
	});

	x += pad_b;
	y += pad_b;
	dx -= pad_b*2;
	dy -= pad_b*2;
	var dx2 = dx / 3;

	canvas.drawRect({
		layer: true,
		strokeStyle: 'black',
		strokeWidth: 1,
		fillStyle: "white",
		x: x,
		y: y,
		width: dx2,
		height: dy,
		fromCenter: false
	});

	canvas.drawRect({
		layer: true,
		strokeStyle: 'black',
		strokeWidth: 1,
		fillStyle: "white",
		x: x + dx2,
		y: y,
		width: dx2,
		height: dy,
		fromCenter: false
	});

	canvas.drawRect({
		layer: true,
		strokeStyle: 'black',
		strokeWidth: 1,
		fillStyle: "white",
		x: x + dx2 + dx2,
		y: y,
		width: dx2,
		height: dy,
		fromCenter: false
	});
}


function boardTitles(canvas) {
	var dx = canvas.width() - pad - pad;
	var dx2 = dx / 3;
	var x = pad + pad_b + pad_t;
	var y = pad + pad_b + pad_t;

	canvas.drawText({
		layer: true,
		fillStyle: "black",
		fontSize: 18,
		fontFamily: "Arial",
		x: x,
		y: y,
		fromCenter: false,
		text: "Новые"
	});

	x+= dx2;

	canvas.drawText({
		layer: true,
		fillStyle: "black",
		fontSize: 18,
		fontFamily: "Arial",
		x: x,
		y: y,
		fromCenter: false,
		text: "В процессе"
	});

	x+= dx2;

	canvas.drawText({
		layer: true,
		fillStyle: "black",
		fontSize: 18,
		fontFamily: "Arial",
		x: x,
		y: y,
		fromCenter: false,
		text: "Законченные"
	});
}


function boardTask(canvas, task, coord, dim) {
	canvas.drawRect({
		layer: true,
		fillStyle: "green",
		x: coord.x,
		y: coord.y,
		width: dim.w,
		height: dim.h,
		fromCenter: false,
		cornerRadius: 5,
		click: function(layer) {
			Drupal.deloEditTaskDialog(task);
		}
	});
	canvas.drawText({
		layer: true,
		fillStyle: "white",
		fontSize: 10,
		fontFamily: "Arial",
		x: coord.x + 6,
		y: coord.y + 5,
		fromCenter: false,
		text: task.title
	});
}


function processTasks(data) {
	var processed = {};

	processed.new = [];
	processed.inprogress = [];
	processed.done = [];

	$.each(data, function(index, item) {
		if (item.status === 'Новое дело') {
			processed.new.push(item);
		} else if (item.status === 'Выполяется') {
			processed.inprogress.push(item);
		} else {
			processed.done.push(item);
		}
	});

	return processed;
}


function boardNewTasks(canvas, arr) {
	var dx = canvas.width() - pad*2 - pad_b*2;
	var dy = canvas.height() - pad*2 - pad_b*2
	var dx2 = dx/3;
	var width = dx2/2;
	var height = 20;
	var x = pad + pad_b + pad_t;
	var y = pad + pad_b + pad_t + pad_h + height;

	$.each(arr, function(index, item) {
		boardTask(canvas, item, {x: x, y: y}, {w: width, h: height});
		y += height + pad_h;
	});
}


function boardInProgressTasks(canvas, arr) {
	$.each(arr, function() {
		
	});
}


function boardDoneTasks(canvas, arr) {
	$.each(arr, function() {
		
	});
}


Drupal.behaviors.board = {
	attach: function(context, settings) {

/*		var canvas = $("#tasks-canvas");

		if (canvas) {
			canvas.attr('width', parseInt(canvas.css('width')));
			canvas.attr('height', parseInt(canvas.css('height')));
			canvas.clearCanvas();

			boardGrid(canvas);
			boardTitles(canvas);

			$.getJSON('/delo-get-tasks/' + getDeloId(), function(data) {
				//console.log(data);
				var processed = processTasks(data);
				//console.log(processed);

				boardNewTasks(canvas, processed.new);
				boardInProgressTasks(canvas, processed.inprogress);
				boardDoneTasks(canvas, processed.done);
			});
		}
*/	},

	detach: function(context, settings) {
	}
};


})(jQuery);
