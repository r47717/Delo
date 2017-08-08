
do ($ = jQuery) ->
  Drupal.behaviors.notes =
    attach: (context, settings) ->
      if context isnt document then return

      class Note
        constructor: (@title = '(без названия)', @text = '') ->
        setText: (@text) ->
        getText: -> @text
        setTitle: (@title) ->
        getTitle: -> @title

      class Notepad
        constructor: -> @notes = []
        add: (item) -> 
          if item instanceof Note
            @notes.push item
            @save()
          else throw Exception 'wrong Note is being added to Notepad'
        remove: (item) -> 
          i = @notes.indexOf item
          @notes.splice i, 1 if i != -1
        save: ->
          localStorage.setItem "deloNotepadNo", @notes.length
          localStorage.setItem "deloNotepadItem#{i}", JSON.stringify @notes[i] for notes, i in @notes
        load: ->
          @notes = []
          len = localStorage.getItem "deloNotepadNo"
          if len?
            @activeItem = 0
            for i in [0..len-1]
              item = JSON.parse localStorage.getItem "deloNotepadItem#{i}"
              @notes.push new Note item.title, item.text
          @notes.length
        count: -> @notes.length
        draw: -> 
          console.log 'drawing notes:'
          console.log @notes
          if not @field?
            @openNotes = ->
              @field.removeClass 'notepad-min'
              @field.unbind 'click'
              @closeBtn.show()
              @notes_container.show()
            @closeNotes = ->
              @field.addClass 'notepad-min'
              @field.bind 'click', => @openNotes()
              @closeBtn.hide()
              @notes_container.hide()
            @switchNotes = (val) ->
              @activeItem = val
              @textarea.val @notes[val].getText()
              @textarea.focus()
            @updateNote = (item) ->
              @notes[item].setText @textarea.val()
              localStorage.setItem "deloNotepadItem#{item}", JSON.stringify @notes[item]
            @field = $("<div></div>")
            @field.addClass 'notepad'
            $('body').append @field
            @closeBtn = $('<div></div>').addClass 'notepad-close-btn'
            @closeBtn.attr 'title', 'Закрыть'
            @closeBtn.bind 'click', (e) =>
              e.stopPropagation() 
              @closeNotes()
            @field.append @closeBtn 
            @notes_container = $("<div></div>").addClass 'notepad-notes'
            @field.append @notes_container
            @select = $("<select></select>")
            _.each @notes, (note, index) =>
              if note?
                @select.append '<option value=' + index + '>' + note.getTitle() + '</option>'
            @notes_container.append @select
            @select.bind 'change', =>
              item = @select.find('option:selected').val()
              @switchNotes(item)
            @textarea = $("<textarea></textarea>")
            @textarea.bind 'input', => @updateNote(@activeItem)
            @notes_container.append @textarea
            @activeItem = 0 if not @activeItem?
            @switchNotes @activeItem

      ###do ->
        #localStorage.clear()
        notepad = new Notepad
        if notepad.load() is 0
          notepad.add new Note 'title1', 'text1'
          notepad.add new Note 'title2', 'text2'
          notepad.add new Note 'title3', 'text3'
        notepad.draw()###
