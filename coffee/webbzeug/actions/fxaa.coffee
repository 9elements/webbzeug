window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Fxaa = class FxaaAction extends Webbzeug.Action
  type: 'fxaa'
  name: 'Fxaa'
  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length > 1
      warnings.push 'Fxaa will only use the first input.'
    if contexts.length < 1
      errors.push 'Fxaa needs exactly 1 input.'

    return { errors: errors, warnings: warnings }

  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @normalMaterial = new THREE.ShaderMaterial (THREE.FxaaShader)
      @screenAlignedQuadMesh.material = @normalMaterial
    @normalMaterial.uniforms['input1'].value = inputs[0]

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
