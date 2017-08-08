(function() {
  (function($) {
    return Drupal.behaviors.notes = {
      attach: function(context, settings) {
        var Note, Notepad;
        if (context !== document) {
          return;
        }
        Note = (function() {
          function Note(title, text) {
            this.title = title != null ? title : '(без названия)';
            this.text = text != null ? text : '';
          }

          Note.prototype.setText = function(text) {
            this.text = text;
          };

          Note.prototype.getText = function() {
            return this.text;
          };

          Note.prototype.setTitle = function(title) {
            this.title = title;
          };

          Note.prototype.getTitle = function() {
            return this.title;
          };

          return Note;

        })();
        Notepad = (function() {
          function Notepad() {
            this.notes = [];
          }

          Notepad.prototype.add = function(item) {
            console.log('add item');
            this.notes.push(item);
            return this.save();
          };

          Notepad.prototype.remove = function(item) {
            var i;
            i = this.notes.indexOf(item);
            if (i !== -1) {
              this.notes.splice(i, 1);
            }
            return this;
          };

          Notepad.prototype.save = function() {
            var i, j, len1, notes, ref;
            localStorage.setItem("deloNotepadNo", this.notes.length);
            ref = this.notes;
            for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
              notes = ref[i];
              localStorage.setItem("deloNotepadItem" + i, this.notes[i]);
            }
            return this;
          };

          Notepad.prototype.load = function() {
            var i, j, len, ref;
            this.notes = [];
            len = localStorage.getItem("deloNotepadNo");
            for (i = j = 0, ref = len - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
              this.notes.push(localStorage.getItem("deloNotepadItem" + i));
            }
            return this.notes.length;
          };

          Notepad.prototype.count = function() {
            return this.notes.length;
          };

          Notepad.prototype.draw = function() {
            this.field = $("<div></div>");
            this.field.attr('id', 'notepad');
            $('body').append(this.field);
            console.log($('body'));
            this.field.show();
            return this;
          };

          return Notepad;

        })();
        return (function() {
          var notepad;
          notepad = new Notepad;
          if (notepad.load() === 0) {
            notepad.add(new Note);
            notepad.add(new Note);
            notepad.add(new Note);
          }
          return notepad.draw();
        })();
      }
    };
  })(jQuery);

}).call(this);
