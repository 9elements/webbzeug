window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Mirror = class MirrorAction extends Webbzeug.Action
  type: 'mirror'
  name: 'Mirror'
  availableParameters: ->
    {
      direction: { name: "Direction", type: 'enum', values: { vertical: 'Vertical', horizontal: 'Horizontal'}, default: 'horizontal' }
    }

  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length > 1
      warnings.push 'Mirror will only use the first input.'
    if contexts.length < 1
      errors.push 'Mirror needs exactly 1 input.'

    return { errors: errors, warnings: warnings }




  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @mirrorMaterial = new THREE.ShaderMaterial (THREE.MirrorShader)
      console.log 'HERE SEE MY MATERIAL ', @mirrorMaterial
      @screenAlignedQuadMesh.material = @mirrorMaterial

    if @getParameter('direction') is 'horizontal'
      @mirrorMaterial.uniforms['mode'].value = 0.0
    else
      @mirrorMaterial.uniforms['mode'].value = 1.0

    @mirrorMaterial.uniforms['input1'].value = inputs[0]

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
