window.Webbzeug ?= {}
window.Webbzeug.ClassMap =
  ###
    generative actions
  ###
  rectangle:
    name: 'Rect'
    type: 'generative'
    class: Webbzeug.Actions.Rectangle
  circle:
    name: 'Circle'
    type: 'generative'
    class: Webbzeug.Actions.Circle
  flat:
    name: 'Flat'
    type: 'generative'
    class: Webbzeug.Actions.Flat
  cell:
    name: 'Cell'
    type: 'generative'
    class: Webbzeug.Actions.Cell
  fractal:
    name: 'Fractal'
    type: 'generative'
    class: Webbzeug.Actions.Fractal
  perlin:
    name: 'Perlin'
    type: 'generative'
    class: Webbzeug.Actions.Perlin
  pixels:
    name: 'Pixels'
    type: 'generative'
    class: Webbzeug.Actions.Pixels

  ###
    Processive actions
  ###
  combine:
    name: 'Combine'
    type: 'processive'
    class: Webbzeug.Actions.Combine
  contrastBrightness:
    name: 'ContBri'
    type: 'processive'
    class: Webbzeug.Actions.ContrastBrightness
  blur:
    name: 'Blur'
    type: 'processive'
    class: Webbzeug.Actions.Blur
  directional:
    name: 'Directional'
    type: 'processive'
    class: Webbzeug.Actions.Directional
  distort:
    name: 'Distort'
    type: 'processive'
    class: Webbzeug.Actions.Distort
  invert:
    name: 'Invert'
    type: 'processive'
    class: Webbzeug.Actions.Invert
  light:
    name: 'Light'
    type: 'processive'
    class: Webbzeug.Actions.Light
  blend:
    name: 'Blend'
    type: 'processive'
    class: Webbzeug.Actions.Blend
  mirror:
    name: 'Mirror'
    type: 'processive'
    class: Webbzeug.Actions.Mirror
  move:
    name: 'Move'
    type: 'processive'
    class: Webbzeug.Actions.Move
  normal:
    name: 'Normal'
    type: 'processive'
    class: Webbzeug.Actions.Normal
  range:
    name: 'Range'
    type: 'processive'
    class: Webbzeug.Actions.Range
  rotozoom:
    name: 'RotoZoom'
    type: 'processive'
    class: Webbzeug.Actions.RotoZoom
  color:
    name: 'Color'
    type: 'processive'
    class: Webbzeug.Actions.Color
  fxaa:
    name: 'Fxaa'
    type: 'processive'
    class: Webbzeug.Actions.Fxaa

  ###
    Memory actions
  ###
  load:
    name: 'Load'
    type: 'memory'
    class: Webbzeug.Actions.Load
  save:
    name: 'Save'
    type: 'memory'
    class: Webbzeug.Actions.Save