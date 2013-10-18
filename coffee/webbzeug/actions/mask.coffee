window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Mask = class MaskAction extends Webbzeug.Action
  type: 'mask'
  name: 'Mask'
  availableParameters: -> {}

  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length > 3
      warnings.push 'Mask will only use the first 3 inputs.'
    if contexts.length < 3
      errors.push 'Mask needs exactly 3 inputs.'

    return { warnings: warnings }

  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @maskMaterial = new THREE.ShaderMaterial (THREE.MaskShader)
      @screenAlignedQuadMesh.material = @maskMaterial
    @maskMaterial.uniforms['input1'].value = inputs[0]
    @maskMaterial.uniforms['input2'].value = inputs[1]
    @maskMaterial.uniforms['blendMap'].value = inputs[2]

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
