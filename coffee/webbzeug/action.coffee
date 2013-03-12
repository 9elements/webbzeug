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
    parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false }

    @renderTarget = new THREE.WebGLRenderTarget( width, height, parameters )

    @screenAlignedQuadMesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null)
    @renderToTextureScene = new THREE.Scene();
    @renderToTextureScene.add( @screenAlignedQuadMesh );


  ###
  createTextureAndFramebufferObject: ->
    @texture = @gl.createTexture()
    @gl.bindTexture( @gl.TEXTURE_2D, @texture)

    # Set up texture so we can render any size image and so we are
    # working with pixels.
    @gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_WRAP_S, @gl.CLAMP_TO_EDGE)
    @gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_WRAP_T, @gl.CLAMP_TO_EDGE)
    @gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_MIN_FILTER, @gl.NEAREST)
    @gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_MAG_FILTER, @gl.NEAREST)
    #// make the texture the same size as the image
    @gl.texImage2D(
        @gl.TEXTURE_2D, 0, @gl.RGBA, @app.getWidth(), @app.getHeight(), 0,
        @gl.RGBA, @gl.UNSIGNED_BYTE, null)

    #// Create a framebuffer
    @fbo = @gl.createFramebuffer()
    @gl.bindFramebuffer(@gl.FRAMEBUFFER, @fbo)

    #// Attach a texture to it.
    @gl.framebufferTexture2D( @gl.FRAMEBUFFER, @gl.COLOR_ATTACHMENT0, @gl.TEXTURE_2D, @texture, 0)
  ###

  availableParameters: -> {}
  validations: -> return {}

  copyRendered: (contexts) ->
    console.log "someone called me"
    ###
    if contexts.length is 0
      @context.fillStyle = 'black'
      @context.fillRect 0, 0, @app.getWidth(), @app.getHeight()
    else
      imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
      @context.putImageData imageData, 0, 0
    ###

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