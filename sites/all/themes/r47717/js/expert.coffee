
do ($ = jQuery) ->
  Drupal.behaviors.expert =
    attach: (context, settings) ->
      
      # DB

      class ExpertBase
        constructor: ->
        build: ->
          # задачи более 1 недели следует разбить на подзадачи
          # каждую задачу должен выполнять наиболее подходящий сотрудник
          # задача должна быть изменена, если затраты выше ожидаемого результата
          # выполнение задачи следует начинать с её точной постановки
          # при трудностях с выполнением задачи следует обратиться к эксперту в этой области
          # трудности с выполнением задачи могут быть связаны с недостатком информации о предметной области
          # прежде чем решать задачу, подумай, что делать с её результатом
          # 

      class Question
        constructor: (@id, @question) ->
        getQuestion: -> @question

      class Answer
        constructor: (@id, @answer) ->
        getAnswer: -> @answer

      class Advice
        constructor: (@id, @advice) ->
        getAdvice: -> @advice


      # Algorithm

      class Expert
        constructor: (@base) -> 
          @answers = []
          @currentQuestion = null
        nextQuestion: ->
          return null

      # UI


