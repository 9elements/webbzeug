window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Range = class RangeAction extends Webbzeug.Action
  type: 'color'
  name: 'Color'
  availableParameters: ->
    {
      minColor: { name: 'MinColor', type: 'color', default: 'rgba(0,0,0,1)' }
      maxColor: { name: 'MaxColor', type: 'color', default: 'rgba(255,255,255,1)' }
    }

  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length > 1
      warnings.push 'Range will only use one input.'
    if contexts.length < 1
      errors.push 'Range needs exactly one input.'

    return { errors: errors, warnings: warnings }

  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @rangeMaterial = new THREE.ShaderMaterial (THREE.RangeShader)
      @screenAlignedQuadMesh.material = @rangeMaterial

    colorRGB = Webbzeug.Utilities.getRgb2 @getParameter('minColor')
    @rangeMaterial.uniforms[ "lowerR" ].value = colorRGB[0] / 255.0
    @rangeMaterial.uniforms[ "lowerG" ].value = colorRGB[1] / 255.0
    @rangeMaterial.uniforms[ "lowerB" ].value = colorRGB[2] / 255.0

    colorRGB = Webbzeug.Utilities.getRgb2 @getParameter('maxColor')
    @rangeMaterial.uniforms[ "upperR" ].value = colorRGB[0] / 255.0
    @rangeMaterial.uniforms[ "upperG" ].value = colorRGB[1] / 255.0
    @rangeMaterial.uniforms[ "upperB" ].value = colorRGB[2] / 255.0

    @rangeMaterial.uniforms['input1'].value = inputs[0]

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
