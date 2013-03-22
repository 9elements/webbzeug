window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Normal = class NormalAction extends Webbzeug.Action
  type: 'normal'
  name: 'Normal'
  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length > 1
      warnings.push 'Normal will only use the first input.'
    if contexts.length < 1
      errors.push 'Normal needs exactly 1 input.'

    return { errors: errors, warnings: warnings }

  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @normalMaterial = new THREE.ShaderMaterial (THREE.NormalShader)
      @screenAlignedQuadMesh.material = @normalMaterial
    @normalMaterial.uniforms['input1'].value = inputs[0]

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
