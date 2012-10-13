window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Flat = class FlatAction extends Webbzeug.Action
  type: 'flat'
  availableParameters: ->
    {
      color: { name: 'Color', type: 'color', default: 'rgba(255,0,0,1)' }
    }

  validations: (contexts) ->
    warnings = []
    if contexts.length > 1
      warnings.push 'Flat will only use the first input.'
    
    return { warnings: warnings }

  render: (contexts) ->
    super()

    @context.fillStyle = @getParameter('color')
    @context.fillRect 0, 0, @app.getWidth(), @app.getHeight()

    return @context