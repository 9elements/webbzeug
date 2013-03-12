window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Circle = class CircleAction extends Webbzeug.Action
  type: 'circle'
  name: 'Circle'
  availableParameters: ->
    {
      x: { name: 'X', type: 'integer', min: 0, max: 255, default: 128, scrollPrecision: 1 },
      y:  { name: 'Y', type: 'integer', min: 0, max: 255, default: 128, scrollPrecision: 1 },
      radiusX:  { name: 'Radius X', type: 'integer', min: 0, max: 256, default: 50, scrollPrecision: 1 },
      radiusY:  { name: 'Radius Y', type: 'integer', min: 0, max: 256, default: 50, scrollPrecision: 1 },
      glow:  { name: 'Glow', type: 'integer', min: 0, max: 255, default: 128, scrollPrecision: 1 },
      alpha:  { name: 'Alpha', type: 'integer', min: 0, max: 255, default: 255, scrollPrecision: 1 },
      color: { name: 'Color', type: 'color', default: 'rgba(255,0,0,1)' }
    }

  validations: (contexts) ->
    warnings = []
    if contexts.length > 1
      warnings.push 'Circle will only use the first input.'

    return { warnings: warnings }

  render: (inputs) ->
    super()

    @glowMaterial = new THREE.ShaderMaterial (THREE.GlowShader)
    @screenAlignedQuadMesh.material = @glowMaterial
    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
