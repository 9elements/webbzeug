window.Webbzeug ?= {}
window.Webbzeug.JSONImporter = class JSONImporter
  debug: true
  constructor: (@app) -> return
  loadData: (data) ->
    splitData      = data.split 'base64,'
    b64encodedData = splitData[1]
    data           = Base64.decode b64encodedData

    decodedData = JSON.parse(data)
    @extractData decodedData

  extractData: (data) ->
    @maxIndex = 0

    actions = data

    for i, action of actions
      @extractAction action

    @app.incrementalIndex = @maxIndex + 1

  extractAction: (action) ->
    console.log action

    el = @app.newActionElement action.x * @app.gridWidth, action.y * @app.gridHeight, Webbzeug.ClassMap[action.type].name, action.width, Webbzeug.ClassMap[action.type].type
    @app.applyActionToElement action.type, action.x, action.y, action.width, action.index, el

    @maxIndex = Math.max(action.index, @maxIndex)
