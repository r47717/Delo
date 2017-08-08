;
(function($) {

Drupal.behaviors.new_task_popup = {
    weight: 0,
	attach: function(context, settings) {
		$("#new-dialog").dialog({ 
			autoOpen: false,
			width: "auto",
			height: "auto",
			appendTo: "#main-delo-open",
			//position: { my: "left top", at: "left top", of: "#content" },
			closeOnEscape: true,
			modal: true,
			resizable: false,
			draggable: true
		});
		
		function validateFields() {
			var submit = $("#new-task-submit");
			if (submit) {
				var title = $('#new-task-title');
				var description = $('#new-task-description');
				if (title && description) {
					if ($.trim(title.val()) === "" || $.trim(description.val()) === "") {
						submit.attr('disabled', 'disabled');
					} else {
						submit.removeAttr('disabled');
					}
				}
			}
		}

		$("#new-task-opener").click(function() {
			validateFields();
			$("#new-dialog").dialog("open");
		});

		$('#new-task-title').keyup(function() {
			validateFields();
		});

		$('#new-task-description').keyup(function() {
			validateFields();
		});

		$("#new-task-cancel").click(function(e) {
			e.preventDefault();
			$("#new-dialog").dialog("close");
		});

	},

};


Drupal.behaviors.edit_task_popup = {
    weight: 10,
	attach: function(context, settings) {

		Drupal.deloEditTaskDialog = function (task) {
			var task_title = task.get('title');
			var task_description = task.get('description');
			var task_id = task.get('id');

			$("#edit-dialog").remove();
			
			//var editDialog = $("<div id='edit-dialog' title='" + task_title + "'></div>");

			var editDialogTmpl = _.template($("#edit-task-popup-template").html());
			var editDialog = editDialogTmpl({
			  title: task_title,
			  description: task_description,
			  statuses: document.App.taskList.statusMap
			});

			$("#tasks-canvas").append(editDialog);

			// var titleEditor = $("<input type='textfield' id='task-edit-title' value ='" + task_title + "'>");
			// var descrEditor = $("<input type='textarea' rows='5' id='task-edit-descr' value ='" + task_description + "'>");
			// var saveButton = $("<p><button name='task-edit-save' value='Сохранить'>Сохранить</button></p>");

			var saveButton = $("#edit-dialog input[name='task-edit-save']");
			saveButton.click(function() {
				var data = {
					id: task_id,
					title: $("#task-edit-title").val(),
					description: $("#task-edit-descr").val()
				};

				task.set({
				  'title': $("#task-edit-title").val(),
				  'description': $("#task-edit-descr").val()
				});

				task.save();
				$("#edit-dialog").dialog("close");

/*				$.ajax({   // TODO: develop client REST API
					url: "/rest/delo/item/" + task.id,
					data: data,
					dataType: "json",
					contentType: 'application/json; charset=UTF-8',
					type: "PUT",
					success: function(data) {
						console.log(data);
						$("#edit-dialog").dialog("close");
					},
					error: function(data) {
						console.log(data);
					}
				});
*/			});
			
			//var cancelButton = $("<p><button name='task-edit-cancel' value='Отменить'>Отменить</button></p>");
			var cancelButton = $("#edit-dialog input[name='task-edit-cancel']");
			cancelButton.click(function() {
				$("#edit-dialog").dialog("close");
			});

			var deleteButton = $("#edit-dialog input[name='task-edit-delete']");
			deleteButton.click(function() {
			  if (confirm('Вы уверены?')) {
				task.destroy();
				$("#edit-dialog").dialog("close");
			  }
			});

			$("#edit-dialog").dialog({ 
				autoOpen: true,
				width: "auto",
				height: "auto",
				closeOnEscape: true,
				modal: true,
				resizable: false,
				draggable: true
			});

			
/*			$.getJSON("/rest/delo/status/list", function(data) {
				var status = $("<select></select>");
				$.each(data, function(index, item) {
					var opt = $("<option>" + item + "</option>");
					status.append(opt);
				});

				editDialog.append($("<p>Id: " + task.id + "</p>"));
				editDialog.append($("<p>Название:</p>"));
				editDialog.append(titleEditor);
				editDialog.append($("<p>Описание:</p>"));
				editDialog.append(descrEditor);
				editDialog.append(status);
				editDialog.append(saveButton);
				editDialog.append(cancelButton);

				$("#edit-dialog").dialog({ 
					autoOpen: true,
					width: "auto",
					height: "auto",
					closeOnEscape: true,
					modal: true,
					resizable: false,
					draggable: true
				});
			});
*/

		}
	},
};



})(jQuery);
