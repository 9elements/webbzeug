window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Distort = class NormalAction extends Webbzeug.Action
  type: 'distort'
  name: 'Distort'

  availableParameters: ->
    {
      amount: { name: 'Amount', type: 'integer', min: 0, max: 255, default: 0, scrollPrecision: 1 }
    }

  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length > 2
      warnings.push 'Distort will only use the first two inputs.'
    if contexts.length < 2
      errors.push 'Distort needs exactly 2 inputs.'

    return { errors: errors, warnings: warnings }

  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @distortMaterial = new THREE.ShaderMaterial (THREE.DistortShader)
      @screenAlignedQuadMesh.material = @distortMaterial

    @distortMaterial.uniforms['baseMap'].value = inputs[0]
    @distortMaterial.uniforms['distMap'].value = inputs[1]
    x = parseInt @getParameter('amount')
    x /= 1024.0
    @distortMaterial.uniforms['amount'].value = x

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true

    return @renderTarget
