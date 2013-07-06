window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Flat = class FlatAction extends Webbzeug.Action
  type: 'flat'
  name: 'Flat'
  availableParameters: ->
    {
      color: { name: 'Color', type: 'color', default: 'rgba(255,0,0,1)' }
    }

  validations: (contexts) ->
    warnings = []
    if contexts.length > 0
      warnings.push 'Flat uses not input at all'

    return { warnings: warnings }

  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @flatMaterial = new THREE.ShaderMaterial (THREE.FlatShader)
      @screenAlignedQuadMesh.material = @flatMaterial

    colorRGB = Webbzeug.Utilities.getRgb2 @getParameter('color')
    @flatMaterial.uniforms[ "r" ].value = colorRGB[0] / 255.0
    @flatMaterial.uniforms[ "g" ].value = colorRGB[1] / 255.0
    @flatMaterial.uniforms[ "b" ].value = colorRGB[2] / 255.0

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
