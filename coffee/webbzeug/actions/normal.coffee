window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Normal = class NormalAction extends Webbzeug.Action
  type: 'circle'
  availableParameters: ->
    {}

  render: (contexts) ->
    super()
    
    return @context