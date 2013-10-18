window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Invert = class InvertAction extends Webbzeug.Action
  type: 'invert'
  name: 'Invert'

  validations: (contexts) ->
    warnings = []
    errors = []
    if contexts.length > 1
      warnings.push 'Invert will only use the first input.'
    if contexts.length < 1
      errors.push 'Invert needs exactly one input.'

    return { errors: errors, warnings: warnings }


  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @ninvertMaterial = new THREE.ShaderMaterial (THREE.InvertShader)
      @screenAlignedQuadMesh.material = @ninvertMaterial
    @ninvertMaterial.uniforms['input1'].value = inputs[0]

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
