window.Webbzeug ?= {}
window.Webbzeug.Action = class Action
  width: 3
  constructor: (@app, @x, @y, @width, @index) ->
    @children = []
    @parent   = null

    @updatedAt  = +new Date()
    @renderedAt = 0

    @parameters = {}
    for parameter, info of @availableParameters()
      @parameters[parameter] = info.default

  availableParameters: -> {}
  validations: -> return {}

  doRender: (contexts) ->
    valid = @validations contexts

    if valid.warnings?.length > 0
      @app.displayWarnings this, valid.warnings
    else
      @app.removeWarnings this

    if valid.errors?.length > 0
      @app.displayErrors this, valid.errors
      return false
    else
      @app.removeErrors this

    if @willRender()
      @render contexts

    return @context

  render: (contexts) ->
    @renderedAt = +new Date()
    @canvas = $('<canvas>').get(0)

    @canvas.width = @app.getWidth()
    @canvas.height = @app.getHeight()

    @context = @canvas.getContext '2d'

  willRender: -> @updatedAt > @renderedAt

  # Children
  deleteChildren:   -> @children = []
  addChild: (child) -> @children.push child

  getParameter: (parameter) -> @parameters[parameter]
  setParameter: (parameter, value) -> 
    @parameters[parameter] = value
    @updatedAt = +new Date()

    # Recursively build tree to find parents that should be rendered as well
    @app.buildTree()
    @app.updateParentsRecursively this