window.Webbzeug ?= {}
window.Webbzeug.JSONImporter = class JSONImporter
  debug: true
  constructor: (@app) -> return
  loadData: (data) ->
    splitData      = data.split 'base64,'
    b64encodedData = splitData[1]
    data          = Base64.decode b64encodedData

    actions = JSON.parse(data)
    console.log actions

