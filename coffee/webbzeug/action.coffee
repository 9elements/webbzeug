window.Webbzeug ?= {}
window.Webbzeug.Action = class Action
  width: 3
  constructor: (@x, @y, @index) ->
    @children = []

  availableOptions: -> {}
  render: ->
    console.log @index, ":", @constructor.name, "x", @x, "y", @y

  # Children
  deleteChildren:   -> @children = []
  addChild: (child) -> @children.push child