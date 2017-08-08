;
(function($) {

Drupal.behaviors.bb = {
  
  weight: 100,
  attach: function(context, settings) {

  	if ($("#tasks-canvas").length == 0) {
  		return;
  	}

  	var App = document.App = {
  		taskList: null,
  		boardView: null,
  	
  		init: function() {
		  	_.extend(App, Backbone.Events);
		  	this.parent_id = this.getDeloId();
  		},
  	
  		start: function() {
  			this.taskList = new App.DeloTaskList();
  			this.boardView = new App.DeloTaskBoard({model: this.taskList});
  			this.taskList.load();
  		},

  		getDeloId: function () {
			var url = window.location.href;
			var re = /delo\/show\/(\d+)/;
			var match = url.match(re);
			return match ? match[1] : '';
		}
  	};


	App.DeloTask = Backbone.Model.extend({
	  idAttribute: 'delo_id',
	  urlRoot: '/rest/delo',

	  moveToNew: function() {
	  	var field = this.get('field_delo_status');
	  	field['und']['0']['tid'] = '4';
	  	this.set('field_delo_status', field);
	  	this.save();
	  	//App.trigger('tasklist:change');
	  },
	  moveToOngoing: function() {
	  	var field = this.get('field_delo_status');
	  	field['und']['0']['tid'] = '5';
	  	this.set('field_delo_status', field);
	  	this.save();
	  },
	  moveToDone: function() {
	  	var field = this.get('field_delo_status');
	  	field['und']['0']['tid'] = '7';
	  	this.set('field_delo_status', field);
	  	this.save();
	  }
	});


	App.DeloTaskView = Backbone.View.extend({
		canvas: null,
		coords: null,
		dim: null,

		initialize: function(options, params) {
			this.canvas = params.canvas;
			this.coords = params.coords;
			this.dim = params.dim;
			this.listenTo(this.model, 'change', this.render);
		},

		render: function() {
			if (!this.canvas) { return; }

			if (this.canvas.getLayerGroup('task' + this.model.id)) {
				return;
			}
			var self = this;

			this.canvas.drawRect({
				layer: true,
				draggable: true,
				groups: ['task' + self.model.id],
  				dragGroups: ['task' + self.model.id],
				fillStyle: "green",
				x: this.coords.x,
				y: this.coords.y,
				width: this.dim.w,
				height: this.dim.h,
				fromCenter: false,
				cornerRadius: 5,
				dblclick: function(layer) {
				  Drupal.deloEditTaskDialog(self.model);
				},
				dragstart: function(layer) {
					self.start_x = layer.x;
					self.start_y = layer.y;
					self.start_section = App.boardView.hitSection(layer.x, layer.y);
				},
				drag: function(layer) {
					var section = App.boardView.hitSection(layer.x, layer.y);
					App.boardView.highlightSection(section);
				},
				dragstop: function(layer) {
					var section = App.boardView.hitSection(layer.x, layer.y);

					if (section == self.start_section) {
						var dx = "-=" + (layer.x - self.start_x);
						var dy = "-=" + (layer.y - self.start_y);
						$(this).animateLayerGroup('task' + self.model.id, {
	      					x: dx,
	      					y: dy
	    				}, 500);
					} else {
						self.coords.x = layer.x;
						self.coords.y = layer.y;
						self.moveToSection(section);
					}
    				App.boardView.highlightSection(0);
				},
				dragcancel: function(layer) {
					var dx = "-=" + (layer.x - self.start_x);
					var dy = "-=" + (layer.y - self.start_y);
					$(this).animateLayerGroup('task' + self.model.id, {
      					x: dx,
      					y: dy
    				}, 500);
    				App.boardView.highlightSection(0);
				}
			});
			this.canvas.drawText({
				layer: true,
				draggable: true,
				groups: ['task' + self.model.id],
  				dragGroups: ['task' + self.model.id],
				fillStyle: "white",
				fontSize: 10,
				fontFamily: "Arial",
				x: this.coords.x + 6,
				y: this.coords.y + 5,
				fromCenter: false,
				text: this.model.get("title")
			});

			return this;
		},

		moveToSection: function(section) {
			switch (section) {
				case 1:
					this.model.moveToNew();
					break;
				case 2:
					this.model.moveToOngoing();
					break;
				case 3:
					this.model.moveToDone();
					break;
			}
		},

		ellipsis: function(text, width) {
			// TODO: measureText()
		}
	});


	App.DeloTaskList = Backbone.Collection.extend({
		model: App.DeloTask,
		url: '/rest/delo',
		statusMap: {
			'7': 'Выполнено',
			'5': 'Выполняется',
			'4': 'Новое дело',
			'8': 'Отменено',
			'6': 'Приостановлено'
		},

		initialize: function() {
			this.on('destroy', function(model) {
				console.log('collection got destroy for model');
				this.remove(model);
				App.trigger('task:destroy');
			});
		},

		load: function() {
			this.fetch({
				success: function() { App.trigger('tasklist:change'); }
			});
		},

		getSubtasks: function() {
			var subtasks = [];
			this.each(function(task) {
				if (task.get('parent_id') == App.parent_id) {
					subtasks.push(task);
				}
			});
			return subtasks;
		},
		
		getNew: function() {
			return this.filter(function(model) {
				var status = model.get('field_delo_status')['und']['0']['tid'];
				return status == '4';
			});
		},
		
		getInProgress: function() {
			return this.filter(function(model) {
				var status = model.get('field_delo_status')['und']['0']['tid'];
				return status == '5';
			});
		},
		
		getDone: function() {
			return this.filter(function(model) {
				var status = model.get('field_delo_status')['und']['0']['tid'];
				return status == '7';
			});
		}
	});

	
	App.DeloTaskBoard = Backbone.View.extend({
		views: [],
		pad: 5,
		pad_b: 4,
		pad_t: 5,
		pad_h: 10,
		canvas: null,

		initialize: function() {
			this.canvas = $("#tasks-canvas");
			this.listenTo(App, 'tasklist:change', this.render);
			this.listenTo(App, 'task:destroy', function() {
				console.log('board view got task:destroy');
				this.render();
			});
		},

		render: function() {
			if (!this.canvas) { return; }
			this.canvas.attr('width', parseInt(this.canvas.css('width')));
			this.canvas.attr('height', parseInt(this.canvas.css('height')));
			this.canvas.clearCanvas();

			this.drawGrid();
			this.drawTitles();

			var dx = this.canvas.width() - this.pad*2 - this.pad_b*2;
			var dy = this.canvas.height() - this.pad*2 - this.pad_b*2;
			var dx2 = dx/3;
			var width = dx2/2;
			var height = 20;

			var self = this;
			var i = [0, 0, 0];  // vertical offset in canvas
			_.each(this.model.getSubtasks(), function(task) {
				var status = task.get('field_delo_status')['und']['0']['tid'];
				var map = {
				  '4': 0,  // new tasks
				  '5': 1,  // in progress
				  '7': 2   // done
				};
				var k = map[status];
				if (k === undefined) { return; }  // skip tasks with other statuses
				var x = self.pad + self.pad_b + self.pad_t + k*dx2;
				var y = self.pad + self.pad_b + self.pad_t + self.pad_h + height + i[k]*(height + self.pad_h);
				i[k]++;
				var view = self.views[task.id] = self.views[task.id] || (new App.DeloTaskView(
					{ model: task },
					{ 
					  canvas: self.canvas,
					  coords: {x: x, y: y},
					  dim: {w: width, h: height}
					}
				));
				view.render();
			});

			return this;
		},

		getDeloId: function() {
			var url = window.location.href;
			var re = /delo\/show\/(\d+)/;
			var match = url.match(re);
			return match ? match[1] : '';
		},

		drawGrid: function() {
			var x = this.pad;
			var y = this.pad;
			var dx = this.canvas.width() - this.pad - this.pad;
			var dy = this.canvas.height() - this.pad -this.pad;

			this.canvas.drawRect({
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

			x += this.pad_b;
			y += this.pad_b;
			dx -= this.pad_b*2;
			dy -= this.pad_b*2;
			var dx2 = dx / 3;

			//this.drawBackground(x+1, y+1, x+dx-2, y+dy-2);

			this.canvas.drawRect({
				layer: true,
				name: 'section1',
				strokeStyle: 'black',
				strokeWidth: 1,
				x: x,
				y: y,
				width: dx2,
				height: dy,
				fromCenter: false
			});

			this.canvas.drawRect({
				layer: true,
				name: 'section2',
				strokeStyle: 'black',
				strokeWidth: 1,
				x: x + dx2,
				y: y,
				width: dx2,
				height: dy,
				fromCenter: false
			});

			this.canvas.drawRect({
				layer: true,
				name: 'section3',
				strokeStyle: 'black',
				strokeWidth: 1,
				x: x + dx2 + dx2,
				y: y,
				width: dx2,
				height: dy,
				fromCenter: false
			});
		},

		drawTitles: function() {
			var dx = this.canvas.width() - this.pad - this.pad;
			var dx2 = dx / 3;
			var x = this.pad + this.pad_b + this.pad_t;
			var y = this.pad + this.pad_b + this.pad_t;

			this.canvas.drawText({
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

			this.canvas.drawText({
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

			this.canvas.drawText({
				layer: true,
				fillStyle: "black",
				fontSize: 18,
				fontFamily: "Arial",
				x: x,
				y: y,
				fromCenter: false,
				text: "Законченые"
			});
		},

		drawBackground: function(x1, y1, x2, y2) {
			var size = 60;
			var minSize = 30;
			var maxSize = 100;
			var speedX = 1;
			var speedY = 1;
			var speedSize = 1;
			var sizeGap = 10;

			var self = this;
			this.canvas.drawEllipse({
				layer: true,
				name: 'bg',
				fillStyle: function(layer) {
					return self.canvas.createGradient({
					  x1: (layer.x + layer.width/2), y1: (layer.y + layer.height/2),
					  x2: (layer.x + layer.width/2), y2: (layer.y + layer.height/2),
					  r1: 0, r2: layer.width,
					  c1: '#eeeeee',
					  c2: '#aaaaaa'
					});
				},
				strokeStyle: '#dddddd',
				x: x1, y: y1,
				width: size, height: size,
				fromCenter: false,
			});

			var layer = self.canvas.getLayer('bg');
			var move1px = function() {

				if (sizeGap == 0) {
					if (speedSize == 1) {
						if (size >= maxSize) speedSize = -1;
						else size++;
					} else {
						if (size <= minSize) speedSize = 1;
						else size--;
					}
					sizeGap = 10;
				} else sizeGap--;

				var newX, newY;
				if (speedX > 0) {
					if (layer.x + size + 1 >= x2) {
						speedX = -1;
						newX = layer.x - 1;
					} else {
						newX = layer.x + 1;
					}
				} else {
					if (layer.x - 1 <= x1) {
						newX = layer.x + 1;
						speedX = 1;
					} else {
						newX = layer.x - 1;
					}
				}
				if (speedY > 0) {
					if (layer.y + size + 1 >= y2) {
						speedY = -1;
						newY = layer.y - 1;
					} else {
						newY = layer.y + 1;
					}
				} else {
					if (layer.y - 1 <= y1) {
						newY = layer.y + 1;
						speedY = 1;
					} else {
						newY = layer.y - 1;
					}
				}

				self.canvas.setLayer('bg', {
					x: newX, y: newY, width: size, height: size
				});

				self.canvas.drawLayers();
			};

			var step = function(timestamp) {
				move1px();
				requestAnimationFrame(step);
			}

			requestAnimationFrame(step);
		},

		hitSection: function(x, y) {
			var s1 = this.canvas.getLayer('section1');
			var s2 = this.canvas.getLayer('section2');
			var s3 = this.canvas.getLayer('section3');

			if (x > s1.x && x < s2.x && y > s1.y && y < (s1.y + s1.height)) {
				return 1;
			}

			if (x > s2.x && x < s3.x && y > s1.y && y < (s1.y + s1.height)) {
				return 2;
			}

			if (x > s3.x && x < (s3.x + s3.width) && y > s1.y && y < (s1.y + s1.height)) {
				return 3;
			}

			return 0;
		},

		highlightSection: function(section) {
			if (this.highlightedSection && this.highlightedSection != section || section == 0) {
				this.canvas.setLayer('section' + this.highlightedSection, {
					strokeStyle: 'black'
				});
			}
			if (section != 0) {
				this.highlightedSection = section;
				this.canvas.setLayer('section' + section, {
					strokeStyle: 'blue'
				});
				this.canvas.moveLayer('section' + section, 3);
			}
		}
	
	});

	
	App.init();
	App.start();

  }
};


})(jQuery);
