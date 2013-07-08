window.Webbzeug ?= {}
window.Webbzeug.JSONExporter = class JSONExporter

  exportJSON: (filename, appActions) ->
    actions = []

    for i, appAction of appActions
      action = {
        x: appAction.x
        y: appAction.y
        width: appAction.width
        index: appAction.index
        type: appAction.type
        parameters: appAction.parameters
      }
      actions.push action

    jsonString = JSON.stringify(actions)
    url = "data:application/octet-stream;base64," + Base64.encode(jsonString)
    if url?
      downloadDataURI
        filename: filename
        data: url
