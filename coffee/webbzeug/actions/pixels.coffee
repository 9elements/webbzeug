`var CustomRandom = function(nseed) {

    var seed,
        constant = Math.pow(2, 13)+1,
        prime = 37,
        maximum = Math.pow(2, 50);

    if (nseed) {
        seed = nseed;
    }

    if (seed == null) {
        seed = (new Date()).getTime();
    }

    return {
        next : function() {
            seed *= constant;
            seed += prime;
            seed %= maximum;

            return seed;
        }
    }
}`

window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Pixels = class PixelsAction extends Webbzeug.Action
  type: 'pixels'
  name: 'Pixels'
  canvas: null
  availableParameters: ->
    {
      seed: { name: 'Seed', type: 'integer', min: 0, max: 255, default: Math.round(Math.random() * 255), scrollPrecision: 1 },
    }

  validations: (contexts) ->
    warnings = []
    if contexts.length > 1
      warnings.push 'Pixels will only use the first input.'

    return { warnings: warnings }

  createPatternOnCanvas: ->

    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    custRnd = CustomRandom(@getParameter('seed'))
    for i in [0...imageData.data.length / 4]
      rand = custRnd.next() / Math.pow(2, 50)
      rand = rand * 255
      index = (i << 2)
      imageData.data[index] = rand
      imageData.data[index + 1] = rand
      imageData.data[index + 2] = rand
      imageData.data[index + 3] = 255
    @context.putImageData imageData, 0, 0
    return @context

  render: (inputs) ->
    super()
    if @canvas is null
      @createCanvas()

    @createPatternOnCanvas()
    cellTexture = new THREE.Texture @canvas
    cellTexture.needsUpdate = true

    @cellMaterial = new THREE.MeshBasicMaterial map: cellTexture
    @screenAlignedQuadMesh.material = @cellMaterial
    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true

    return @renderTarget

  createCanvas: ->
    @canvas = $('<canvas>').get(0) # create a new canvas dom-object

    @canvas.width = @app.textureSize
    @canvas.height = @app.textureSize

    @context = @canvas.getContext("2d")
