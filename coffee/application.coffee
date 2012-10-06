window.after = (t,f) -> setTimeout f, t
window.every = (t,f) -> setInterval f, t

$ ->
  $('#canvas').attr
    width: $('#canvas').width()
    height: $('#canvas').height()

  new Webbzeug.App $('#canvas').get(0)