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
    return new Kata.Controller($('#canvas').get(0), 100);
  });

}).call(this);
