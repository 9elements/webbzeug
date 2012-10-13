window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Load = class LoadAction extends Webbzeug.Action
  type: 'load'
  availableParameters: ->
    {
      id: { name: 'ID', type: 'number', min: 0, max: 50, default: 0 }
    }

  render: (contexts) ->
    super()

    @context = @app.memory[@getParameter('id')]

    return @context

  doRender: (contexts) ->
    context = @render contexts
    return context