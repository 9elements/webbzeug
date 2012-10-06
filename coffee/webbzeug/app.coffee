window.Webbzeug ?= {}
window.Webbzeug.App = class App
  gridHeight: 27
  gridWidth:  112 / 3
  classMap: 
    rectangle: Webbzeug.Actions.Rectangle
  constructor: (@canvas) ->
    @context = @canvas.getContext 'experimental-webgl'

    @incrementalIndex = 0
    @actions = []

    @width = @context.canvas.width
    @height = @context.canvas.height

    @handleNavigation()
    @handleWorkspaceClick()

    # every 1000 / 60, =>
    #   @render()

  handleNavigation: ->
    self = this
    $('.navigation li').click (e) ->
      e.preventDefault()

      $(this).parent().find('li').removeClass('active')
      $(this).addClass('active')

      self.selectedActionId = $(this).attr('data-id')
      self.selectedActionName = $(this).text()
      self.selectedActionType = $(this).attr('data-type')

  # When workspace is clicked, create new element
  handleWorkspaceClick: ->
    $('.workspace').mouseenter (e) =>
      if not @selectedElement and @selectedActionId
        el = $('<div>').addClass('action')

        x = e.pageX
        y = e.pageY

        el.text(@selectedActionName).addClass(@selectedActionType).css
          left: x
          top: y

        $('.workspace').append el

        @selectedElement = el

    $('.workspace').mousemove (e) =>
      if @selectedElement and @selectedActionId
        offsetX = $('.workspace').offset().left
        offsetY = $('.workspace').offset().top

        @selectedElement.css
          left: Math.floor((e.pageX - offsetX) / @gridWidth) * @gridWidth
          top:  Math.floor((e.pageY - offsetY) / @gridHeight) * @gridHeight

    $('.workspace').mousedown (e) =>
      if @selectedElement and @selectedActionId

        x = @selectedElement.position().left / @gridWidth
        y = @selectedElement.position().top  / @gridHeight
        
        console.log @selectedActionId
        action = new @classMap[@selectedActionId] x, y, @incrementalIndex
        @incrementalIndex++

        @actions.push action

        @render()

        @selectedElement = null
        @selectedActionId = @selectedActionType = @selectedActionName = null


  render: ->

    console.log "Existing actions:"
    for action in @actions
      action.render()