window.Webbzeug ?= {}
window.Webbzeug.Action = class Action
  width: 3
  constructor: (@app, @x, @y, @index) ->
    @children = []

    @parameters = {}
    for parameter, info of @availableParameters()
      @parameters[parameter] = info.default

  availableParameters: ->
    {
      x: { name: 'X', type: 'number', min: 0, max: 255, default: 0 },
      y:  { name: 'Y', type: 'number', min: 0, max: 255, default: 0 },
      width:  { name: 'Width', type: 'number', min: 0, max: 255, default: 10 },
      height:  { name: 'Height', type: 'number', min: 0, max: 255, default: 10 }
    }

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