window.ShaderScript = class
  constructor: (@url, @type) -> return
  load: (callback) ->
    request = new XMLHttpRequest
    request.open 'GET', @url, true
    request.onreadystatechange = =>
      if request.readyState is 4
        @script = request.responseText;
        callback @script
    request.send null
  compile: (gl) ->
    shader = gl.createShader @type
    gl.shaderSource shader, @script
    gl.compileShader shader
    return shader