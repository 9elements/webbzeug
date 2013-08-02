window.Webbzeug ?= {}
window.Webbzeug.JSONImporter = class JSONImporter
  debug: true
  constructor: (@app) -> return
  loadData: (data) ->
    splitData      = data.split 'base64,'
    b64encodedData = splitData[1]
    data           = Base64.decode b64encodedData

    decodedData = JSON.parse(data)

    if @fileVersionNewer decodedData.version
      alert 'This file has been created with a newer version of webbzeug! (' + decodedData.version + ' > ' + Webbzeug.Version
      return

    @extractData decodedData.actions

  extractData: (data) ->
    @maxIndex = 0
    actions = data

    for i, action of actions
      console.log action.type
      @extractAction action

    @app.incrementalIndex = @maxIndex + 1

  extractAction: (action) ->
    el = @app.newActionElement action.x * @app.gridWidth, action.y * @app.gridHeight, Webbzeug.ClassMap[action.type].name, action.width, Webbzeug.ClassMap[action.type].type
    appAction = @app.applyActionToElement action.type, action.x, action.y, action.width, action.index, el

    appAction.parameters = action.parameters

    @maxIndex = Math.max(action.index, @maxIndex)

  fileVersionNewer: (fileVersion) ->
    nRes = 0
    parts1 = Webbzeug.Version.split(".")
    parts2 = fileVersion.split(".")
    nLen = Math.max(parts1.length, parts2.length)
    i = 0

    while i < nLen
      nP1 = (if (i < parts1.length) then parseInt(parts1[i], 10) else 0)
      nP2 = (if (i < parts2.length) then parseInt(parts2[i], 10) else 0)
      nP1 = 0  if isNaN(nP1)
      nP2 = 0  if isNaN(nP2)
      unless nP1 is nP2
        nRes = (if (nP1 > nP2) then 1 else -1)
        break
      i++
    if nRes is -1
      return true
    else
      return false