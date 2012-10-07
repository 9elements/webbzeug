window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Load = class LoadAction extends Webbzeug.Action
  type: 'load'
  availableParameters: ->
    {
      id: { name: 'ID', type: 'number', min: 0, max: 255, default: 0 }
    }

  render: (contexts) ->
    super()

    return @app.memory[@getParameter('id')]