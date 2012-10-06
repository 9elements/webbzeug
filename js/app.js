(function() {
  var App, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.App = App = (function() {

    function App(canvas, particleCount) {
      this.canvas = canvas;
      this.context = this.canvas.getContext('2d');
      this.render();
    }

    App.prototype.render = function() {};

    return App;

  })();

}).call(this);
