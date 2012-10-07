window.Webbzeug ?= {}
window.Webbzeug.Utilities =
  getDict: ->
    dict = []
    dict[0] = ''
    dict[1] = 'blur'
    dict[2] = 'cell'
    dict[3] = 'circle'
    dict[4] = 'combine'
    dict[5] = 'contbri'
    dict[6] = 'flat'
    dict[7] = 'fractal'
    dict[8] = 'invert'
    dict[9] = 'light'
    dict[10] = 'load'
    dict[11] = 'mirror'
    dict[12] = 'pixels'
    dict[13] = 'rectangle'
    dict[14] = 'rotozoom'
    dict[15] = 'save'

    dict[16] = 'roughness'
    dict[17] = 'seed'
    dict[18] = 'type'
    dict[19] = 'add'
    dict[20] = 'multiply'
    dict[21] = 'substract'
    dict[22] = 'contrast'
    dict[23] = 'brightness'
    dict[24] = 'strength'
    dict[25] = 'radius'
    dict[26] = 'color'
    dict[27] = 'id'
    dict[28] = 'width'
    dict[29] = 'height'
    dict[30] = 'x'
    dict[31] = 'y'
    dict[32] = 'radius'
    dict[33] = 'rotation'
    dict[34] = 'zoom'
    dict[35] = 'direction'
    dict[36] = 'horizontal'
    dict[37] = 'vertical'

    return dict

  stringToByte: (string) ->
    dict = @getDict()
    dictMap = {}
    for value, index in dict
      dictMap[value] = index

    if dictMap[string]
      return dictMap[string]

    return string

  bytesToString: (bytes) ->
    dict = @getDict()
    intBytes = parseInt bytes
    if dict[intBytes]
      return dict[intBytes]

    return bytes

  versionToInt: (version) ->
    versionSplit = version.split '.'
    versionInt = 0
    for i in [versionSplit.length-1...0]
      versionPart = versionSplit[i]
      versionInt += (versionSplit.length - i) * versionPart

    return versionInt