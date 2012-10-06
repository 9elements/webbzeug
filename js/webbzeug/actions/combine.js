(function() {
  var CombineAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Combine = CombineAction = (function(_super) {

    __extends(CombineAction, _super);

    function CombineAction() {
      return CombineAction.__super__.constructor.apply(this, arguments);
    }

    return CombineAction;

  })(Webbzeug.Action);

}).call(this);
