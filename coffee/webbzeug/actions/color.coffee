window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Color = class ColorAction extends Webbzeug.Action
  type: 'color'
  name: 'Color'
  availableParameters: ->
    {
      color: { name: 'Color', type: 'color', default: 'rgba(255,0,0,1)' }
    }

  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length > 1
      warnings.push 'color will only use one input.'
    if contexts.length < 1
      errors.push 'color needs exactly one input.'

    return { errors: errors, warnings: warnings }

  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @colorMaterial = new THREE.ShaderMaterial (THREE.ColorShader)
      @screenAlignedQuadMesh.material = @colorMaterial

    colorRGB = Webbzeug.Utilities.getRgb2 @getParameter('color')
    @colorMaterial.uniforms[ "r" ].value = colorRGB[0] / 255.0
    @colorMaterial.uniforms[ "g" ].value = colorRGB[1] / 255.0
    @colorMaterial.uniforms[ "b" ].value = colorRGB[2] / 255.0
    @colorMaterial.uniforms['input1'].value = inputs[0]

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
