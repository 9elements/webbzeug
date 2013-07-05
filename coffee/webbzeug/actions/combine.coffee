window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Combine = class CombineAction extends Webbzeug.Action
  type: 'combine'
  name: 'Combine'
  availableParameters: ->
    {
      type: { name: 'Type', type: 'enum', values: {
        darken: 'Darken',
        lighten: 'Lighten',
        multiply: 'Multiply',
        add: 'Add',
        substract: 'Substract',
        divide: 'Divide'
      }, default: 'add' }
    }

  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length < 2
      errors.push 'Combine needs at least 2 inputs.'

    return { warnings: warnings, errors: errors }


  createCombineMaterial: ->
    switch @getParameter('type')
      when 'darken'
        @combineMaterial = new THREE.ShaderMaterial (THREE.DarkenShader)
      when 'lighten'
        @combineMaterial = new THREE.ShaderMaterial (THREE.LightenShader)
      when 'multiply'
        @combineMaterial = new THREE.ShaderMaterial (THREE.MulShader)
      when 'add'
        @combineMaterial = new THREE.ShaderMaterial (THREE.AddShader)
      when 'substract'
        @combineMaterial = new THREE.ShaderMaterial (THREE.SubShader)
      when 'divide'
        @combineMaterial = new THREE.ShaderMaterial (THREE.DivShader)

  render: (inputs) ->
    super()

    if inputs.length < 2
      return false

    @createCombineMaterial()
    @screenAlignedQuadMesh.material = @combineMaterial

    if inputs.length > 2
      @createTempTarget()

    useRenderTargetAsBuffer = (inputs.length) % 2 is 0
    console.log useRenderTargetAsBuffer

    @combineMaterial.uniforms['input1'].value = inputs[0]

    for i in [1..inputs.length]
      @combineMaterial.uniforms['input2'].value = inputs[i]
      if useRenderTargetAsBuffer
        @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
        @combineMaterial.uniforms['input1'].value = @renderTarget
      else
        @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @tempTarget, true
        @combineMaterial.uniforms['input1'].value = @tempTarget

    return @renderTarget

