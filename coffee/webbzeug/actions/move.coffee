window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Move = class MoveAction extends Webbzeug.Action
  type: 'move'
  name: 'Move'

  availableParameters: ->
    {
      scrollX: { name: 'Scroll X', type: 'integer', min: -255, max: 255, default: 0, step: 1, scrollPrecision: 1 },
      scrollY: { name: 'Scroll Y', type: 'integer', min: -255, max: 255, default: 0, step: 1, scrollPrecision: 1 }
    }

  validations: (contexts) ->
    warnings = []
    errors = []
    if contexts.length > 1
      warnings.push 'Move will only use the first input.'
    if contexts.length < 1
      errors.push 'Move needs exactly one input.'

    return { errors: errors, warnings: warnings }


  setUniforms: ->
    x = parseInt @getParameter('scrollX')
    x /= - 255.0
    @moveMaterial.uniforms['x'].value = x

    y = parseInt @getParameter('scrollY')
    y /= 255.0
    @moveMaterial.uniforms['y'].value = y

  render: (inputs) ->
    super()
    if not @moveMaterial?
      @moveMaterial = new THREE.ShaderMaterial (THREE.MoveShader)
    @screenAlignedQuadMesh.material = @moveMaterial

    @moveMaterial.uniforms['input1'].value = inputs[0]
    @setUniforms()

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
