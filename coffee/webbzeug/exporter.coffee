window.Webbzeug ?= {}
window.Webbzeug.Exporter = class Exporter
  actionsToDataURL: (actions) ->
    @output = ''

    @startStream()

    @output += '\x02' # Data starts here

    for action in actions
      @output += '\x03' # This is an action
      @output += Webbzeug.Utilities.stringToByte(action.type)

      # Position information
      @output += '\x04' 

      @output += '\x05'
      @output += action.index

      @output += '\x05'
      @output += action.x
      @output += '\x05'
      @output += action.y
      @output += '\x05'
      @output += action.width

      # Parameters
      @output += '\x06'

      for param, value of action.parameters
        @output += '\x07'
        @output += Webbzeug.Utilities.stringToByte(param)
        @output += '\x08'
        @output += Webbzeug.Utilities.stringToByte(value)

      @output += '\x00'

    @debugPrint(@output)

    return "data:application/octet-stream;base64," + Base64.encode(@output)

  startStream: ->
    @output += 'WZ'
    @output += '\x01'
    @output += Webbzeug.Utilities.versionToInt Webbzeug.Version

  debugPrint: (str) ->
    r = ""
    e = str.length
    c = 0
    while c < e
      h = str.charCodeAt(c++).toString(16)
      while(h.length < 2)
        h = "0" + h
      r += " " + h

    console.log str.length, "<Object" + r + ">"