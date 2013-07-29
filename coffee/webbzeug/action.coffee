window.Webbzeug ?= {}
window.Webbzeug.Action = class Action
  width: 3
  constructor: (@app, @x, @y, @width, @index) ->
    @children = []
    @parent   = null

    @needsUpdate = true

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
    if @tempTarget?
      return

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
    @needsUpdate = false

  willRender: -> @needsUpdate

  # Children
  deleteChildren:   -> @children = []
  addChild: (child) -> @children.push child

  getParameter: (parameter) -> @parameters[parameter]
  setParameter: (parameter, value) ->
    @parameters[parameter] = value
    @needsUpdate = true

    # Recursively build tree to find parents that should be rendered as well
    @app.buildTree()
    @app.updateParentsRecursively this

    @setCaption @caption()

  setCaption: (caption) ->
    @element.find('.wrapper').contents().first().get(0).data = caption or @caption()

  caption: -> return @name

  clearTempTarget: ->
    oldMaterial = @screenAlignedQuadMesh.material
    flatMaterial = new THREE.ShaderMaterial (THREE.FlatShader)
    @screenAlignedQuadMesh.material = flatMaterial

    flatMaterial.uniforms[ "r" ].value = 0
    flatMaterial.uniforms[ "g" ].value = 0
    flatMaterial.uniforms[ "b" ].value = 0

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @tempTarget, true
    @screenAlignedQuadMesh.material = oldMaterial

  createCanvas: ->
    @canvas = $('<canvas>').get(0) # create a new canvas dom-object

    @canvas.width = @app.textureSize
    @canvas.height = @app.textureSize

    @context = @canvas.getContext("2d")

