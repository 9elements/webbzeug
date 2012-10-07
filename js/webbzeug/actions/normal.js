(function() {
  var NormalAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Normal = NormalAction = (function(_super) {

    __extends(NormalAction, _super);

    function NormalAction() {
      return NormalAction.__super__.constructor.apply(this, arguments);
    }

    NormalAction.prototype.type = 'circle';

    NormalAction.prototype.availableParameters = function() {
      return {};
    };

    NormalAction.prototype.render = function(contexts) {
      NormalAction.__super__.render.call(this);
      return this.context;
    };

    return NormalAction;

  })(Webbzeug.Action);

}).call(this);
