window.after = (t,f) -> setTimeout f, t
window.every = (t,f) -> setInterval f, t

$ ->
  #$('#canvas').attr
  #  width: $('#canvas').width()
  #  height: $('#canvas').height()

  window.app = new Webbzeug.App ($('.container'))