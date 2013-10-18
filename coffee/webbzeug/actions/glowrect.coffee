window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Glowrect = class GlowrectAction extends Webbzeug.Action
  type: 'glowrect'
  name: 'GlowRect'
  availableParameters: ->
    {
      x: { name: 'X', type: 'integer', min: 0, max: 255, default: 128, scrollPrecision: 1 },
      y: { name: 'Y', type: 'integer', min: 0, max: 255, default: 128, scrollPrecision: 1 },
      width:  { name: 'Width', type: 'integer', min: 1, max: 255, default: 0, scrollPrecision: 1 },
      height:  { name: 'Height', type: 'integer', min: 1, max: 255, default: 0, scrollPrecision: 1 }
      radiusX: { name: 'Radius X', type: 'integer', min: 0, max: 255, default: 30, scrollPrecision: 1 },
      radiusY: { name: 'Radius Y', type: 'integer', min: 0, max: 255, default: 30, scrollPrecision: 1 },
      glow: { name: 'Glow', type: 'integer', min: 1, max: 100, default: 1, scrollPrecision: 1 },
      # radiusX: { name: 'Radius X', type: 'integer', min: 0, max: 255, default: 10, scrollPrecision: 1 },
      # radiusY: { name: 'Radius Y', type: 'integer', min: 0, max: 255, default: 10, scrollPrecision: 1 },

      # power: { name: 'Power', type: 'float', min: 0, max: 1, default: 0.5, scrollPrecision: 0.001 },

      color: { name: 'Color', type: 'color', default: 'rgba(255,255,255,1)' }
    }

  validations: (contexts) ->
    warnings = []
    if contexts.length > 1
      warnings.push 'GlowRect will only use the first input.'

    return { warnings: warnings }

  setUniforms: ->
    x = parseInt @getParameter('x') - 128.0
    @glowMaterial.uniforms['x'].value = x / 255.0
    y = parseInt @getParameter('y') - 128.0
    @glowMaterial.uniforms['y'].value = y / 255.0

    sx = parseInt @getParameter('width')
    @glowMaterial.uniforms['sizeX'].value = sx / 255.0
    sy = parseInt @getParameter('height')
    @glowMaterial.uniforms['sizeY'].value = sy / 255.0

    rx = parseInt @getParameter('radiusX')
    @glowMaterial.uniforms['radiusX'].value = rx / 255.0
    ry = parseInt @getParameter('radiusY')
    @glowMaterial.uniforms['radiusY'].value = ry / 255.0

    glow = parseInt @getParameter('glow')
    glow = (255.0 - glow) / 30.0
    glow *=glow
    @glowMaterial.uniforms['frameSharpness'].value = glow


  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @glowMaterial = new THREE.ShaderMaterial (THREE.RoundRectShader)
      @screenAlignedQuadMesh.material = @glowMaterial
    @setUniforms()

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
