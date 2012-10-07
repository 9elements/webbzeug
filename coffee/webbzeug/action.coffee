window.Webbzeug ?= {}
window.Webbzeug.Action = class Action
  width: 3
  constructor: (@app, @x, @y, @width, @index) ->
    @children = []

    @parameters = {}
    for parameter, info of @availableParameters()
      @parameters[parameter] = info.default

  availableParameters: -> {}

  render: (contexts) ->
    console.log "rendering...", @index, ":", @constructor.name, "x", @x, "y", @y

    @canvas = $('<canvas>').get(0)

    @canvas.width = @app.getWidth()
    @canvas.height = @app.getHeight()

    @context = @canvas.getContext '2d'

  # Children
  deleteChildren:   -> @children = []
  addChild: (child) -> @children.push child

  getParameter: (parameter) -> @parameters[parameter]
  setParameter: (parameter, value) -> @parameters[parameter] = value