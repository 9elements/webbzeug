window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.RotoZoom = class RotoZoomAction extends Webbzeug.Action
  type: 'rotozoom'
  name: 'Rotozoom'
  availableParameters: ->
    {
      rotation: { name: 'Rotation', type: 'integer', min: 0, max: 360, default: 0, scrollPrecision: 1 },
      zoom: { name: 'Zoom', type: 'float', min: 1, max: 255, default: 10, scrollPrecision: 1 }
    }

  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length > 1
      warnings.push 'Rotozoom will only use one input.'
    if contexts.length < 1
      errors.push 'Rotozoom needs one input.'
    return { errors: errors, warnings: warnings }

  setUniforms: ->
    rotation = @getParameter('rotation')
    rotation = rotation / 180 *  Math.PI
    @rotozoomMaterial.uniforms['rotation'].value = rotation

    zoom = @getParameter('zoom')
    @rotozoomMaterial.uniforms['zoom'].value = zoom / 10.0

  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @rotozoomMaterial = new THREE.ShaderMaterial (THREE.RotoZoomShader)
      @screenAlignedQuadMesh.material = @rotozoomMaterial

    @rotozoomMaterial.uniforms['input1'].value = inputs[0]
    @setUniforms()

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
