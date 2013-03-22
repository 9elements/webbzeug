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
      errors.push 'Combine needs exactly 2 inputs.'
    if contexts.length > 2
      warnings.push 'Combine will only use the first 2 inputs.'

    return { warnings: warnings, errors: errors }


  render: (inputs) ->
    super()

    if inputs.length < 2
      console.log 'A combine needs at least 2 inputs!'
      return false

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

    @screenAlignedQuadMesh.material = @combineMaterial

    @combineMaterial.uniforms['input1'].value = inputs[0]
    @combineMaterial.uniforms['input2'].value = inputs[1]

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true

    ###
    # Take first image, draw it to the action context
    imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
    @context.putImageData imageData, 0, 0

    # Go though all other contexts and apply blend mode
    for i in [1...contexts.length]
      applyingContext = contexts[i]

      switch @getParameter('type')
        when 'darken'
          @darken applyingContext
        when 'lighten'
          @lighten applyingContext
        when 'multiply'
          @multiply applyingContext
        when 'add'
          @add applyingContext
        when 'substract'
          @substract applyingContext
        when 'divide'
          @divide applyingContext
    ###
    return @renderTarget

