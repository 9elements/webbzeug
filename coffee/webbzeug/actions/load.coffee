window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Load = class LoadAction extends Webbzeug.Action
  type: 'load'
  availableParameters: ->
    {
      id: { name: 'ID', type: 'number', min: 0, max: 50, default: 0 }
    }

  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length < 1
      errors.push 'Load needs exactly 1 input.'
    if contexts.length > 1
      warnings.push 'Load will only use the first input.'

    return { errors: errors, warnings: warnings }

  render: (contexts) ->
    super()

    @context = @app.memory[@getParameter('id')]

    return @context

  doRender: (contexts) ->
    context = @render contexts
    return context