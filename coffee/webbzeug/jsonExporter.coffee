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
        type: Webbzeug.Utilities.stringToByte(appAction.type)
        parameters: appAction.parameters
      }
      actions.push action

    jsonString = JSON.stringify(actions)
    console.log jsonString

    #JSON.stringify ()
