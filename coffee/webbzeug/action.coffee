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
    @createRenderTarget()

  createRenderTarget: ->
    width = @app.textureSize || 1;
    height = @app.textureSize || 1;
    parameters = { wrapS:THREE.RepeatWrapping, wrapT:THREE.RepeatWrapping, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false }

    @renderTarget = new THREE.WebGLRenderTarget( width, height, parameters )

    @screenAlignedQuadMesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null)
    @renderToTextureScene = new THREE.Scene();
    @renderToTextureScene.add( @screenAlignedQuadMesh );

  createTempTarget: ->
    if @tempTarget? return

    width = @app.textureSize || 1;
    height = @app.textureSize || 1;
    parameters = { wrapS:THREE.RepeatWrapping, wrapT:THREE.RepeatWrapping, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false }

    @tempTarget = new THREE.WebGLRenderTarget( width, height, parameters )

  availableParameters: -> {}
  validations: -> return {}

  copyRendered: (contexts) ->
    console.log "someone called me"

  ###
  this is called from the tree renderer
  ###
  doRender: (textures) ->
    valid = @validations textures

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
      @render textures

    return @renderTarget

  render: (textures) ->
    @renderedAt = +new Date()
    #@canvas = $('<canvas>').get(0) # create a new canvas dom-object

    #@canvas.width = @app.getWidth()
    #@canvas.height = @app.getHeight()

    #@context = @canvas.getContext("2d")

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

    @setCaption @caption()

  setCaption: (caption) ->
    @element.find('.wrapper').contents().first().get(0).data = caption or @caption()

  caption: -> return @name
  ###
  loadShader: (gl, shaderSource, shaderType) ->

    # Create the shader object
    shader = gl.createShader(shaderType)

    # Load the shader source
    gl.shaderSource(shader, shaderSource)

    # Compile the shader
    gl.compileShader(shader)

    # Check the compile status
    compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!compiled)
      # Something went wrong during compilation; get the error
      lastError = gl.getShaderInfoLog(shader);
      console.log("*** Error compiling shader '" + shader + "':" + lastError);
      gl.deleteShader(shader);
      return null
    return shader
  ###