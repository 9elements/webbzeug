/*
  jquery-draggable-input
  https://github.com/saschagehlich/jquery-draggable-input

  Copyright (c) 2012 Sascha Gehlich <contact@filshmedia.net>
  MIT Licensed
*/

$(function() {

  $.fn.extend({

    draggableInput: function(_options) {
      // Default options
      var defaults = {
        type: 'integer',
        min: 0,
        max: -1,
        scrollPrecision: 1,
        precision: 2
      };
      // Merge defaults with input options
      var options = $.extend(defaults, _options);

      // Get started
      return this.each(function() {
        if(this.nodeName.toLowerCase() != 'input')
          throw new Error('jquery-draggable-input: The given node is not an <input> tag.');

        var $el = $(this);

        var parse;
        if(options.type === 'integer') parse = parseInt;
        if(options.type === 'float') parse = parseFloat;

        // Parse options correctly
        var value = parse($el.val());
        var scrollPrecision = parse(options.scrollPrecision);
        var precision = parseInt(options.precision);
        var max = parse(options.max);
        var min = parse(options.min);

        $(this).mousedown(function(e) {

          var initialPos = { x: e.pageX, y: e.pageY };

          var onMouseMove = function(e) {
            var diffPos = { x: e.pageX - initialPos.x, y: e.pageY - initialPos.y };
            var newValue = value - diffPos.y * scrollPrecision;

            // Boundaries
            newValue = parse( Math.min( max, Math.max( min, newValue ) ) );

            // Decimal precision
            if(options.type === 'float')
              newValue = newValue.toFixed(options.precision);

            $el.val(newValue).trigger('change');
          };

          $(document).mousemove(onMouseMove);
          $(document).one('mouseup', function(e) {
            $(document).off('mousemove', onMouseMove);
            value = parse($el.val());
          });

        });
      });
    }

  });

});