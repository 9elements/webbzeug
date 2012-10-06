window.Webbzeug ?= {}
window.Webbzeug.App = class App
  gridHeight: 27
  gridWidth:  112 / 3
  constructor: (@canvas) ->
    @context = @canvas.getContext 'experimental-webgl'

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
      if @selectedElement
        @selectedElement.css
          left: Math.floor(e.pageX / @gridWidth) * @gridWidth
          top:  Math.floor(e.pageY / @gridHeight) * @gridHeight

    $('.workspace').mousedown (e) =>
      if @selectedElement
        @selectedElement.css
          left: Math.floor(e.pageX / @gridWidth) * @gridWidth
          top:  Math.floor(e.pageY / @gridHeight) * @gridHeight

        @selectedElement = null


  render: ->

    @context.fillStyle = 'rgba(255,255,255,1)'
    @context.fillRect(Math.random() * @width, Math.random() * @height, 10, 10)