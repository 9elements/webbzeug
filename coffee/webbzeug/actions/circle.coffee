window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Circle = class CircleAction extends Webbzeug.Action
  type: 'circle'
  name: 'Circle'
  availableParameters: ->
    {
      x: { name: 'X', type: 'integer', min: 0, max: 255, default: 128, scrollPrecision: 1 },
      y:  { name: 'Y', type: 'integer', min: 0, max: 255, default: 128, scrollPrecision: 1 },
      radiusX:  { name: 'Radius X', type: 'integer', min: 0, max: 256, default: 128, scrollPrecision: 1 },
      radiusY:  { name: 'Radius Y', type: 'integer', min: 0, max: 256, default: 128, scrollPrecision: 1 },
      glow:  { name: 'Glow', type: 'integer', min: 0, max: 255, default: 128, scrollPrecision: 1 },
      alpha:  { name: 'Alpha', type: 'integer', min: 0, max: 255, default: 255, scrollPrecision: 1 },
      color: { name: 'Color', type: 'color', default: 'rgba(255,255,255,1)' }
    }

  validations: (contexts) ->
    warnings = []
    if contexts.length > 1
      warnings.push 'Circle will only use the first input.'

    return { warnings: warnings }

  setUniforms: ->
    x = parseInt @getParameter('x') - 128.0
    @glowMaterial.uniforms['x'].value = x / 255.0
    y = parseInt @getParameter('y') - 128.0
    @glowMaterial.uniforms['y'].value = y / 255.0

    sx = parseInt @getParameter('radiusX')
    @glowMaterial.uniforms['sx'].value = sx / 255.0
    sy = parseInt @getParameter('radiusY')
    @glowMaterial.uniforms['sy'].value = sy / 255.0

    glow = parseInt @getParameter('glow')
    glow = (255.0 - glow) / 30.0
    glow *=glow
    @glowMaterial.uniforms['glow'].value = glow

    colorRGB = Webbzeug.Utilities.getRgb2 @getParameter('color')
    @glowMaterial.uniforms[ "r" ].value = colorRGB[0] / 255.0
    @glowMaterial.uniforms[ "g" ].value = colorRGB[1] / 255.0
    @glowMaterial.uniforms[ "b" ].value = colorRGB[2] / 255.0

  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @glowMaterial = new THREE.ShaderMaterial (THREE.GlowShader)
      @screenAlignedQuadMesh.material = @glowMaterial
    @setUniforms()

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
