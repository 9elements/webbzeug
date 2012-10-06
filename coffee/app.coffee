window.Webbzeug ?= {}
window.Webbzeug.App = class App

  constructor: (@canvas, particleCount) ->
    @context = @canvas.getContext '2d'

    @render()

  render: ->
    return