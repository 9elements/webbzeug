window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Rectangle = class RectangleAction extends Webbzeug.Action
  type: 'rectangle'
  name: 'Rect'
  availableParameters: ->
    {
      x: { name: 'X', type: 'integer', min: 0, max: 255, default: 64, scrollPrecision: 1 },
      y:  { name: 'Y', type: 'integer', min: 0, max: 255, default: 64, scrollPrecision: 1 },
      width:  { name: 'Width', type: 'integer', min: 1, max: 255, default: 128, scrollPrecision: 1 },
      height:  { name: 'Height', type: 'integer', min: 1, max: 255, default: 128, scrollPrecision: 1 }
      color: { name: 'Color', type: 'color', default: 'rgba(255,255,255,1)' }
    }

  validations: (contexts) ->
    warnings = []
    if contexts.length > 1
      warnings.push 'Rectangle will only use the first input.'

    return { warnings: warnings }

  setUniforms: ->
    x = parseInt @getParameter('x')
    @rectMaterial.uniforms['x'].value = x / 255.0
    y = parseInt @getParameter('y')
    @rectMaterial.uniforms['y'].value = y / 255.0

    sx = parseInt @getParameter('width')
    @rectMaterial.uniforms['width'].value = sx / 255.0
    sy = parseInt @getParameter('height')
    @rectMaterial.uniforms['height'].value = sy / 255.0

    colorRGB = Webbzeug.Utilities.getRgb2 @getParameter('color')
    @rectMaterial.uniforms[ "r" ].value = colorRGB[0] / 255.0
    @rectMaterial.uniforms[ "g" ].value = colorRGB[1] / 255.0
    @rectMaterial.uniforms[ "b" ].value = colorRGB[2] / 255.0

  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @rectMaterial = new THREE.ShaderMaterial (THREE.RectangleShader)
      @screenAlignedQuadMesh.material = @rectMaterial
    @setUniforms()

    if inputs.length > 0
      @rectMaterial.uniforms['input1'].value = inputs[0]
    else
      @rectMaterial.uniforms['input1'].value = nil

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
