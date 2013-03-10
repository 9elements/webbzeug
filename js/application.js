(function() {

  window.after = function(t, f) {
    return setTimeout(f, t);
  };

  window.every = function(t, f) {
    return setInterval(f, t);
  };

  $(function() {
    return window.app = new Webbzeug.App($('.container'));
  });

}).call(this);
