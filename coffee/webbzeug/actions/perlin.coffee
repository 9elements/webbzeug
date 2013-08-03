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
        },
        next01: function() {
          return this.next() / maximum;
        }
    }
}`

window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Perlin = class PerlinAction extends Webbzeug.Action
  type: 'perlin'
  name: 'Perlin'
  unitSize: 1
  availableParameters: ->
    {
      roughness: { name: 'Roughness', type: 'integer', min: 1, max: 100, default: 3, scrollPrecision: 1 },
      seed: { name: 'Seed', type: 'integer', min: 1, max: 255, default: Math.round(Math.random() * 255), scrollPrecision: 1 }
    }

  validations: (contexts) ->
    warnings = []
    if contexts.length > 1
      warnings.push 'Fractal will only use the first input.'

    return { warnings: warnings }

  render: (inputs) ->
    super()
    if not @canvas?
      @createCanvas()

    @createPatternOnCanvas()
    fractalTexture = new THREE.Texture @canvas
    fractalTexture.needsUpdate = true

    @fractalMaterial = new THREE.MeshBasicMaterial map: fractalTexture
    @screenAlignedQuadMesh.material = @fractalMaterial
    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true

    return @renderTarget


  createPatternOnCanvas:  ->
    @rnd = CustomRandom(@getParameter('seed'))

    roughness = @getParameter('roughness') / @app.getWidth()

    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    imagePixelData = imageData.data

    w = @app.getWidth()
    h = @app.getHeight()

    map = []
    for x in [0...w+1]
      map[x] = []
    @rnd.next01()
