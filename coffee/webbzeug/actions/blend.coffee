window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Blend = class NormalAction extends Webbzeug.Action
  type: 'blend'
  name: 'Blend'

  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length > 3
      warnings.push 'Blend will only use the first three inputs.'
    if contexts.length < 3
      errors.push 'Blend needs exactly 3 inputs.'

    return { errors: errors, warnings: warnings }

  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @blendMaterial = new THREE.ShaderMaterial (THREE.BlendShader)
      @screenAlignedQuadMesh.material = @blendMaterial

    @blendMaterial.uniforms['input1'].value = inputs[0]
    @blendMaterial.uniforms['input2'].value = inputs[1]
    @blendMaterial.uniforms['blendMap'].value = inputs[2]

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true

    return @renderTarget
