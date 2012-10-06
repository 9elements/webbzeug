(function() {

  window.after = function(t, f) {
    return setTimeout(f, t);
  };

  window.every = function(t, f) {
    return setInterval(f, t);
  };

  $(function() {
    $('#canvas').attr({
      width: $('#canvas').width(),
      height: $('#canvas').height()
    });
    return window.app = new Webbzeug.App($('#canvas').get(0));
  });

}).call(this);
