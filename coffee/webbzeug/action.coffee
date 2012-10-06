window.Webbzeug ?= {}
window.Webbzeug.Action = class Action
  width: 3
  constructor: (@x, @y, @index) -> return
  availableOptions: -> {}
  render: ->
    console.log @index, ":", @constructor.name, "x", @x, "y", @y