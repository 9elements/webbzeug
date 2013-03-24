(function() {
  var _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.ClassMap = {
    /*
        generative actions
    */

    cell: {
      name: 'Cell',
      type: 'generative',
      "class": Webbzeug.Actions.Cell
    },
    circle: {
      name: 'Circle',
      type: 'generative',
      "class": Webbzeug.Actions.Circle
    },
    flat: {
      name: 'Flat',
      type: 'generative',
      "class": Webbzeug.Actions.Flat
    },
    fractal: {
      name: 'Fractal',
      type: 'generative',
      "class": Webbzeug.Actions.Fractal
    },
    glowrect: {
      name: 'GlowRect',
      type: 'generative',
      "class": Webbzeug.Actions.Glowrect
    },
    pixels: {
      name: 'Pixels',
      type: 'generative',
      "class": Webbzeug.Actions.Pixels
    },
    rectangle: {
      name: 'Rect',
      type: 'generative',
      "class": Webbzeug.Actions.Rectangle
    },
    /*
        Processive actions
    */

    contrastBrightnss: {
      name: 'Cont/Bri',
      type: 'processive',
      "class": Webbzeug.Actions.ContrastBrightness
    },
    blur: {
      name: 'Blur',
      type: 'processive',
      "class": Webbzeug.Actions.Blur
    },
    combine: {
      name: 'Combine',
      type: 'processive',
      "class": Webbzeug.Actions.Combine
    },
    csb: {
      name: 'CSB',
      type: 'processive',
      "class": Webbzeug.Actions.CSB
    },
    distort: {
      name: 'Distort',
      type: 'processive',
      "class": Webbzeug.Actions.Distort
    },
    invert: {
      name: 'Invert',
      type: 'processive',
      "class": Webbzeug.Actions.Invert
    },
    light: {
      name: 'Light',
      type: 'processive',
      "class": Webbzeug.Actions.Light
    },
    mask: {
      name: 'Mask',
      type: 'processive',
      "class": Webbzeug.Actions.Mask
    },
    mirror: {
      name: 'Mirror',
      type: 'processive',
      "class": Webbzeug.Actions.Mirror
    },
    move: {
      name: 'Move',
      type: 'processive',
      "class": Webbzeug.Actions.Move
    },
    normal: {
      name: 'Normal',
      type: 'processive',
      "class": Webbzeug.Actions.Normal
    },
    repeat: {
      name: 'Repeat',
      type: 'processive',
      "class": Webbzeug.Actions.Repeat
    },
    rotozoom: {
      name: 'RotoZoom',
      type: 'processive',
      "class": Webbzeug.Actions.RotoZoom
    },
    /*
        Memory actions
    */

    load: {
      name: 'Load',
      type: 'memory',
      "class": Webbzeug.Actions.Load
    },
    save: {
      name: 'Save',
      type: 'memory',
      "class": Webbzeug.Actions.Save
    }
  };

}).call(this);
