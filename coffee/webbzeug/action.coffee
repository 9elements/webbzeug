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

  copyRendered: (contexts) ->
    if contexts.length is 0
      @context.fillStyle = 'black'
      @context.fillRect 0, 0, @app.getWidth(), @app.getHeight()
    else
      imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
      @context.putImageData imageData, 0, 0

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

    @context = @canvas.getContext("webgl") || @canvas.getContext("experimental-webgl")

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

  ###
   * Loads a shader.
   * @param {!WebGLContext} gl The WebGLContext to use.
   * @param {string} shaderSource The shader source.
   * @param {number} shaderType The type of shader.
   * @param {function(string): void) opt_errorCallback callback for errors.
   * @return {!WebGLShader} The created shader.
  ###
  loadShader: (gl, shaderSource, shaderType, opt_errorCallback) ->
    
    # Create the shader object
    shader = gl.createShader(shaderType)

    # Load the shader source
    gl.shaderSource(shader, shaderSource)

    # Compile the shader
    gl.compileShader(shader);

    # Check the compile status
    compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!compiled)  
      # |Something went wrong during compilation; get the error
      lastError = gl.getShaderInfoLog(shader);
      console.log "*** Error compiling shader '" + shader + "':" + lastError
      gl.deleteShader(shader) 
      return null
    

    return shader


  caption: -> return @name