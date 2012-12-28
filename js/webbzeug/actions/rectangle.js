(function() {
  var RectangleAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Rectangle = RectangleAction = (function(_super) {

    __extends(RectangleAction, _super);

    function RectangleAction() {
      return RectangleAction.__super__.constructor.apply(this, arguments);
    }

    RectangleAction.prototype.type = 'rectangle';

    RectangleAction.prototype.name = 'Rect';

    RectangleAction.prototype.availableParameters = function() {
      return {
        x: {
          name: 'X',
          type: 'integer',
          min: 0,
          max: 256,
          "default": 64,
          scrollPrecision: 1
        },
        y: {
          name: 'Y',
          type: 'integer',
          min: 0,
          max: 256,
          "default": 64,
          scrollPrecision: 1
        },
        width: {
          name: 'Width',
          type: 'integer',
          min: 0,
          max: 256,
          "default": 128,
          scrollPrecision: 1
        },
        height: {
          name: 'Height',
          type: 'integer',
          min: 0,
          max: 256,
          "default": 128,
          scrollPrecision: 1
        },
        color: {
          name: 'Color',
          type: 'color',
          "default": 'rgba(255,255,255,1)'
        }
      };
    };

    RectangleAction.prototype.validations = function(contexts) {
      var warnings;
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('Rectangle will only use the first input.');
      }
      return {
        warnings: warnings
      };
    };

    RectangleAction.prototype.render = function(textures) {
      /*
          x = @getParameter('x')
          y = @getParameter('y')
          w = @getParameter('width')
          h = @getParameter('height')
      
          console.log "rendering", x, y, w, h
      
          @copyRendered contexts
      
          @context.fillStyle = @getParameter('color')
          @context.fillRect x, y, w, h
      */

      var buffer, fragmentShader, gl, positionLocation, program, resolutionLocation, vertexShader;
      gl = this.app.getWebGLContext();
      gl.bindTexture(gl.TEXTURE_2D, null);
      vertexShader = this.loadShader(gl, "attribute vec2 a_position; uniform vec2 u_resolution; void main() { vec2 zeroToOne = a_position / u_resolution; vec2 zeroToTwo = zeroToOne * 2.0; vec2 clipSpace = zeroToTwo - 1.0; gl_Position = vec4(clipSpace, 0, 1);   }", gl.VERTEX_SHADER);
      fragmentShader = this.loadShader(gl, "void main() { gl_FragColor = vec4(0,1,0,1); }", gl.FRAGMENT_SHADER);
      program = createProgram(gl, [vertexShader, fragmentShader]);
      gl.useProgram(program);
      positionLocation = gl.getAttribLocation(program, "a_position");
      resolutionLocation = gl.getUniformLocation(program, "u_resolution");
      gl.uniform2f(resolutionLocation, this.app.getWidth(), this.app.getHeight());
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      this.app.setFramebuffer(null, this.app.getWidth, this.app.getHeight);
      gl.clearColor(1.0, 1.0, 0.0, 1.0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      console.log("done");
      return this.texture;
    };

    return RectangleAction;

  })(Webbzeug.Action);

}).call(this);
