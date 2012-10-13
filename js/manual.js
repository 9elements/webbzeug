(function() {

  window.after = function(t, f) {
    return setTimeout(f, t);
  };

  window.every = function(t, f) {
    return setInterval(f, t);
  };

  $(function() {
    var base;
    base = 'https://github.com/saschagehlich/webbzeug/blob/master/';
    return $('.source').each(function(index, el) {
      var $el;
      $el = $(el);
      return $el.attr({
        href: base + $el.attr('data-file')
      });
    });
  });

}).call(this);
