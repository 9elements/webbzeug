window.Webbzeug ?= {}
window.Webbzeug.Version = '0.0.1'
window.Webbzeug.App = class App
  gridHeight: 28
  gridWidth:  112 / 3
  shiftPressed: false
  constructor: (@canvas) ->
    @workspace = $('.workspace')
    @setupCanvas()
    @buildGrid()
    @reset()

    @loadSaveHandler = new Webbzeug.LoadSaveHandler this, $('.save-link'), $('input#file')

    @handleNavigation()
    @handleMultipleSelection()  
    @handleKeyboardInput()

  ###
    Setup
  ###

  setupCanvas: ->
    @context = @canvas.getContext '2d'
    @width = @context.canvas.width
    @height = @context.canvas.height

  buildGrid: ->
    rows = 30
    cols = 50

    grid = @workspace.parent().find '.grid'

    grid.css
      width: (cols + 1) * @gridWidth
      height: (rows + 1) * @gridHeight

    for r in [0...rows]
      rowDiv = $('<div>').addClass('grid-row').css(height: @gridHeight - 1).appendTo grid

    for c in [0...cols]
      colDiv = $('<div>').addClass('grid-col').css(width: @gridWidth, height: grid.height(), left: @gridWidth * c).appendTo grid

  reset: ->
    @memory = []
    @actions = {}
    @actionsArr = []
    @incrementalIndex = 0
    @watchedAction = null
    @watchedActionIndex = null
    @selectedElement = null
    @selectedActionIndex = @selectedActionId = @selectedActionName = @selectedActionType = null

    # Remove all action divs
    @workspace.find('.action').remove()

  ###
    Keyboard input
  ###
  handleKeyboardInput: ->
    $(document).keyup (e) =>
      if e.keyCode is 16
        @shiftPressed = false

    $(document).keydown (e) =>
      if e.keyCode is 16
        @shiftPressed = true
      if e.keyCode is 32
        e.preventDefault()
        if @selectedActionIndex
          $('.workspace .action').removeClass('watched')
          $('.workspace .action[data-index=' + @selectedActionIndex + ']').addClass('watched')

          @watchedActionIndex = @selectedActionIndex

          @renderAll()

  ###
    Navigation
  ###
  handleNavigation: ->
    # Setup
    types = {}
    for name, action of Webbzeug.ClassMap
      types[action.type] ?= []

      action.id = name
      types[action.type].push action

    navigationWrapper = $('.navigation')

    for type, actions of types
      typeLi = $('<li>').addClass('type ' + type).text(_.str.classify(type)).appendTo navigationWrapper

      actionsUl = $('<ul>').addClass('types ' + type).appendTo typeLi
      for action in actions
        actionLi = $('<li>').attr('data-id': action.id, 'data-type': type).text(action.name).appendTo actionsUl

    # Handle clicks
    self = this
    $('.navigation li ul li').click (e) ->
      e.preventDefault()

      self.handleWorkspaceClick()

      self.selectedActionId = $(this).attr('data-id')
      self.selectedActionName = $(this).text()
      self.selectedActionType = $(this).attr('data-type')

  ###
    Action creation / handling / dragging / resizing
  ###
  newActionElement: (x, y, actionName, width, actionType) ->
    el = $('<div>').addClass('action')

    el.addClass(actionType + ' ' + actionType).css
      left: x
      top: y
      width: width * @gridWidth

    wrapper     = $('<div>').addClass('wrapper').text(actionName).appendTo el
    watchedIcon = $('<div>').addClass('watched-icon').appendTo wrapper
    draggerIcon = $('<div>').addClass('dragger').appendTo wrapper

    @workspace.append el

    return el

  applyActionToElement: (actionId, x, y, width, index, element) ->
    action = new Webbzeug.ClassMap[actionId].class this, x, y, width, index

    element.attr 'data-index': index

    action.element = element

    @actions[index] = action
    @actionsArr.push action

    @handleElementClick null, element
    element.click (e) =>
      @handleElementClick e, element

    @handleElementDrag element

    element.on 'mouseenter', =>
      if action.renderTime
        $('.debug').text action.constructor.name + ': rendered in ' + action.renderTime + 'ms'
    element.on 'mouseleave', =>
      if @renderTime
        $('.debug').text 'rendered in ' + @renderTime + 'ms'

    return action

  handleWorkspaceClick: ->
    $('.workspace-wrapper').mouseenter (e) =>
      if not @selectedElement and @selectedActionId
        el = @newActionElement e.pageX, e.pageY, @selectedActionName, 3, @selectedActionType

        @selectedElement = el

    $('.workspace-wrapper').mousemove (e) =>
      if @selectedElement
        offsetX = $('.workspace').offset().left
        offsetY = $('.workspace').offset().top

        @selectedElement.css
          left: Math.floor((e.pageX - offsetX) / @gridWidth) * @gridWidth
          top:  Math.floor((e.pageY - offsetY) / @gridHeight) * @gridHeight

    $('.workspace-wrapper').mousedown (e) =>
      $('.workspace-wrapper').off('mouseenter mousemove mousedown')
      if @selectedElement
        x = Math.round(@selectedElement.position().left / @gridWidth)
        y = Math.round(@selectedElement.position().top  / @gridHeight)

        if @selectedActionId
          @applyActionToElement @selectedActionId, x, y, 3, @incrementalIndex, @selectedElement

          @incrementalIndex++

        @selectedElement = null
        @selectedActionId = @selectedActionType = @selectedActionName = null

  handleMultipleSelection: (element) ->
    selectionRectEl = $('.selection')
    @workspace.mousedown (e) =>
      e.preventDefault()

      selectionRect = {}

      selectionRect.x = e.pageX
      selectionRect.y = e.pageY

      selectionRectEl.stop().show().css
        opacity: 1
        width: 0
        height: 0
        left: selectionRect.x
        top: selectionRect.y

      $(document).mousemove (e) =>
        selectionRect.width = e.pageX - selectionRect.x
        selectionRect.height = e.pageY - selectionRect.y

        selectionRectEl.css
          left: if selectionRect.width > 0 then selectionRect.x else selectionRect.x + selectionRect.width
          top: if selectionRect.height > 0 then selectionRect.y else selectionRect.y + selectionRect.height
          width: Math.abs(selectionRect.width)
          height: Math.abs(selectionRect.height)

      $(document).mouseup (e) =>
        $(document).off 'mousemove'
        selectionRectEl.fadeOut 'fast'

        ###
          Selection done
        ###
        intersectingActions = []

        offsetX = @workspace.offset().left
        offsetY = @workspace.offset().top

        r2 = 
          left:   selectionRect.x
          top:    selectionRect.y
          width:  Math.abs(selectionRect.width)
          height: Math.abs(selectionRect.height)

        if selectionRect.width < 0
          r2.left = r2.left + selectionRect.width
        if selectionRect.height < 0
          r2.top = r2.top + selectionRect.height

        @workspace.find('.action').removeClass('selected')

        unless r2.width > 0 or r2.height > 0
          return false

        for action in @actionsArr
          # rectangular intersection test
          r1 =
            left:   action.x * @gridWidth + offsetX
            top:    action.y * @gridHeight + offsetY
            width:  action.width * @gridWidth
            height: @gridHeight

          unless r2.left > r1.left + r1.width or
            r2.left + r2.width < r1.left or
            r2.top > r1.top + r1.height or
            r2.top + r2.height < r1.top
              action.element.addClass('selected')
              console.log action.constructor.name, action



  handleElementDrag: (element) ->
    # Resize drag
    $(element).mousedown (e) =>
      e.stopPropagation()

    $(element).find('.dragger').mousedown (e) =>
      e.stopPropagation()
      e.preventDefault()

      editingElement = element
      $(document).mousemove (e) =>
        e.preventDefault()

        offsetX = $('.workspace').offset().left

        editingElement.css
          width: Math.max(3, Math.floor((e.pageX - offsetX - editingElement.position().left) / @gridWidth)) * @gridWidth

      $(document).mouseup (e) =>
        $(document).off 'mousemove'

        action = @actions[editingElement.attr('data-index')]
        action.width = Math.round(editingElement.width() / @gridWidth)

    # Move drag
    $(element).mousedown (e) =>
      e.preventDefault()

      editingElement = element

      $(document).mousemove (e) =>
        e.preventDefault()

        offsetX = $('.workspace').offset().left
        offsetY = $('.workspace').offset().top

        editingElement.css
          left: Math.floor((e.pageX - offsetX) / @gridWidth) * @gridWidth
          top:  Math.floor((e.pageY - offsetY) / @gridHeight) * @gridHeight

      $(document).mouseup (e) =>
        $(document).off('mousemove')

        action = @actions[editingElement.attr('data-index')]
        action.x = Math.round(editingElement.position().left / @gridWidth)
        action.y = Math.round(editingElement.position().top  / @gridHeight)

  handleElementClick: (e, element) ->
    @selectedActionIndex = element.attr('data-index')

    $('.workspace .action').removeClass('selected')
    $(element).addClass('selected')
    
    if @shiftPressed
      @showParameters e, @actions[@selectedActionIndex]

  ###
    Parameters
  ###
  showParameters: (e, action) ->
    self = this

    settingsWindow = $('.workspace-wrapper .parameters')

    settingsWindow.show().css
      left: (action.x + action.width) * @gridWidth + 10 #+ $('.workspace-wrapper').offset().left
      top: action.y * @gridHeight #+ $('.workspace-wrapper').offset().top

    settingsWindow.click (e) => e.stopPropagation()

    e.stopPropagation()
    $(document).click (e) ->
      settingsWindow.hide()
      $(document).off 'click'

    settingsUl = settingsWindow.find('ul')
    settingsUl.empty()

    # Build settings
    availableParameters = action.availableParameters()

    for key, info of availableParameters
      switch info.type
        when 'enum'
          li = $('<li>').appendTo settingsUl
          label = $('<div>').addClass('label').text((info.name || key) + ':').appendTo li

          select = $('<select>').appendTo li
          for optKey, val of info.values
            option = $('<option>').attr(value: optKey).text(val).appendTo select
            if action.getParameter(key) is optKey
              option.attr 'selected', 'selected'

          (->
            _key = key
            select.change ->
              action.setParameter _key, select.val()

              self.renderAll()
          )()

        when 'number'
          li = $('<li>').appendTo settingsUl
          label = $('<div>').addClass('label').text((info.name || key) + ':').appendTo li

          attributes = 
            type: 'range'
            min: info.min or 0
            max: info.max or 9999
            value: action.getParameter(key) or info.default
            step: info.step or 1

          input = $('<input>').attr(attributes).appendTo li

          value = $('<div>').addClass('value').text(attributes.value).appendTo li

          (=>
            _input = input
            _key   = key
            _value = value
            _input.change ->
              newVal = _input.val()

              if !!(newVal % 1)
                newVal = parseFloat(newVal)
              else
                newVal = parseInt(newVal)

              action.setParameter _key, newVal
              _value.text newVal

              self.renderAll()
          )()

        when 'color'
          li = $('<li>').appendTo settingsUl
          label = $('<div>').addClass('label').text((info.name || key) + ':').appendTo li

          color = action.getParameter(key) or info.default

          input = $('<div>').addClass('colorpicker-control').css(backgroundColor: color).appendTo li

          (=>
            _key   = key
            _input = input
            _input.ColorPicker 
              color: color
              onChange: (hsb, hex, rgb) ->
                color = "rgb(#{rgb.r}, #{rgb.g}, #{rgb.b})"

                _input.css
                  backgroundColor: color

                action.setParameter _key, color

                self.renderAll()
          )()

  deleteTree: ->
    for index, action of @actions
      action.deleteChildren()
  
  ###
    Helper functions for actions
  ###
  getWidth: -> @canvas.width
  getHeight: -> @canvas.height

  ###
    Tree building / handling
  ###
  buildTree: ->
    unless @watchedActionIndex
      return

    @deleteTree()

    @actionsArr.sort @actionsSorter

    watchedAction = @actions[@watchedActionIndex]
    @findChildrenRecursively watchedAction

  actionsSorter: (a, b) ->
    if a.x > b.x
      return 1
    else if a.x < b.x
      return -1
    else
      return 0


  findChildrenRecursively: (action) ->
    children = []
    for possibleChildAction in @actionsArr
      if possibleChildAction is action
        continue

      # console.log possibleChildAction.x, action.x + action.width, "///", action.x + action.width, possibleChildAction.x
      if possibleChildAction.y is action.y - 1
        if !(possibleChildAction.x >= action.x + action.width or possibleChildAction.x + possibleChildAction.width <= action.x)
          children.push possibleChildAction

          @findChildrenRecursively possibleChildAction

    action.children = children

  ###
    Rendering
  ###
  renderAll: ->
    @buildTree()

    watchedAction = @actions[@watchedActionIndex]

    unless watchedAction?
      return false

    startTime = +new Date()
    if context = @render watchedAction
      imageData = context.getImageData 0, 0, @getWidth(), @getHeight()
      @context.putImageData imageData, 0, 0
    @renderTime = (+new Date() - startTime)

    $('.debug').text 'rendered in ' + @renderTime + 'ms'

  render: (action) ->
    unless action?
      return false

    children = action.children

    contexts = []
    for child in children
      context = @render child
      contexts.push context

    startTime = +new Date()
    context = action.render(contexts)
    action.renderTime = (+new Date()) - startTime
    return context