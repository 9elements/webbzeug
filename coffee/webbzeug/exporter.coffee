window.Webbzeug ?= {}
window.Webbzeug.Exporter = class Exporter
  actionsToDataURL: (actions) ->
    @output = ''

    @startStream()

    @output += '\x02' # Data starts here

    for index, action of actions
      @output += '\x03' # This is an action
      @output += Webbzeug.Utilities.stringToByte(action.type)

      # Position information
      @output += '\x04' 

      @writeData action.index
      @output += '\x05'
      @writeData action.x
      @output += '\x05'
      @writeData action.y
      @output += '\x05'
      @writeData action.width
      @output += '\x05'

      for param, value of action.parameters
        @output += '\x07'
        @output += Webbzeug.Utilities.stringToByte(param)
        @output += '\x08'
        
        @writeData value

      @output += '\xff'

    # @debugPrint(@output)

    return "data:application/octet-stream;base64," + Base64.encode(@output)

  writeData: (data) ->
    if typeof data is 'number' and parseInt(data) == data
      @output += '\xfa'
      @output += chr(data & 0xff)
    if typeof data is 'string'
      @output += '\xfb'
      @output += chr(data.length & 0xff)
      @output += data
    if typeof data is 'object'
      stringifiedObj = JSON.stringify(data)
      @output += '\xfc'
      @output += chr(stringifiedObj.length & 0xff)
      @output += stringifiedObj

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