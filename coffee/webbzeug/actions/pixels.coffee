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
      seed:   { name: 'Seed', type: 'integer', min: 0, max: 255, default: Math.round(Math.random() * 255), scrollPrecision: 1 },
      amount: { name: 'Amount', type: 'integer', min: 1, max: 20, default: 17, scrollPrecision: 1 }
    }

  validations: (contexts) ->
    warnings = []
    if contexts.length > 1
      warnings.push 'Pixels will only use the first input.'

    return { warnings: warnings }

  createPatternOnCanvas: ->
    randomNormalizer = Math.pow(2, 50)
    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    custRnd = CustomRandom(@getParameter('seed'))
    for i in [0...imageData.data.length / 4]
      putPixel = custRnd.next() / randomNormalizer * 20
      amount = @getParameter('amount')
      if i < 10
        console.log putPixel, amount
      if amount > putPixel
        rand = custRnd.next() / randomNormalizer
        rand = rand * 255
        index = (i << 2)
        imageData.data[index] = rand
        imageData.data[index + 1] = rand
        imageData.data[index + 2] = rand
      else
        imageData.data[index] = 0
        imageData.data[index + 1] = 0
        imageData.data[index + 2] = 0
      imageData.data[index + 3] = 255

    @context.putImageData imageData, 0, 0
    return @context

  render: (inputs) ->
    super()
    if not @canvas?
      @createCanvas()

    @createPatternOnCanvas()
    cellTexture = new THREE.Texture @canvas
    cellTexture.needsUpdate = true

    @cellMaterial = new THREE.MeshBasicMaterial map: cellTexture
    @screenAlignedQuadMesh.material = @cellMaterial
    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true

    return @renderTarget

