window.Webbzeug ?= {}
window.Webbzeug.JSONImporter = class JSONImporter
  debug: true
  constructor: (@app) -> return
  loadData: (@data) ->
    @maxIndex = 0

    @app.incrementalIndex = @maxIndex + 1


