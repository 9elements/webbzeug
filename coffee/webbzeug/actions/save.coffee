window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Save = class SaveAction extends Webbzeug.Action
  type: 'save'
  name: 'Save'
  availableParameters: ->
    {
      id: { name: 'ID', type: 'integer', min: 0, max: 50, default: 0, scrollPrecision: 1 }
    }

  render: (contexts) ->
    super()

    if contexts.length == 0
      console.log "A save action needs one input"
      return false

    @app.memory[@getParameter('id')] = contexts[0]

    @context = contexts[0]
    return @context

  doRender: (contexts) ->
    context = @render contexts
    return context

  caption: -> 'Save (' + @getParameter('id') + ')'