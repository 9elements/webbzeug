window.Webbzeug ?= {}
window.Webbzeug.ClassMap =
  ###
    generative actions
  ###
  rectangle: 
    name: 'Rectangle'
    type: 'generative'
    class: Webbzeug.Actions.Rectangle
  circle: 
    name: 'Circle'
    type: 'generative'
    class: Webbzeug.Actions.Circle
  fractal: 
    name: 'Fractal'
    type: 'generative'
    class: Webbzeug.Actions.Fractal
  pixels: 
    name: 'Pixels'
    type: 'generative'
    class: Webbzeug.Actions.Pixels
  flat: 
    name: 'Flat'
    type: 'generative'
    class: Webbzeug.Actions.Flat
  cell: 
    name: 'Cell'
    type: 'generative'
    class: Webbzeug.Actions.Cell

  ###
    Processive actions
  ###
  combine: 
    name: 'Combine'
    type: 'processive'
    class: Webbzeug.Actions.Combine
  invert: 
    name: 'Invert'
    type: 'processive'
    class: Webbzeug.Actions.Invert
  hscb: 
    name: 'HSCB'
    type: 'processive'
    class: Webbzeug.Actions.HSCB
  blur: 
    name: 'Blur'
    type: 'processive'
    class: Webbzeug.Actions.Blur
  rotozoom: 
    name: 'RotoZoom'
    type: 'processive'
    class: Webbzeug.Actions.RotoZoom
  light: 
    name: 'Light'
    type: 'processive'
    class: Webbzeug.Actions.Light
  mirror: 
    name: 'Mirror'
    type: 'processive'
    class: Webbzeug.Actions.Mirror
  normal:
    name: 'Normal'
    type: 'processive'
    class: Webbzeug.Actions.Normal
  mask:
    name: 'Mask'
    type: 'processive'
    class: Webbzeug.Actions.Mask
  repeat:
    name: 'Repeat'
    type: 'processive'
    class: Webbzeug.Actions.Repeat

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