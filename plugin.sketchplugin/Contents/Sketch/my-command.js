var that = this;
function run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(console, global) {/* globals log */
if (!console._skpmEnabled) {
  var sketchDebugger = __webpack_require__(3)
  var actions = __webpack_require__(5)

  function getStack() {
    return sketchDebugger.prepareStackTrace(new Error().stack)
  }

  function logEverywhere(type, args) {
    var values = Array.prototype.slice.call(args)

    // log to the System logs
    values.forEach(function(v) {
      try {
        log(indentString() + v)
      } catch (e) {
        log(v)
      }
    })

    if (!sketchDebugger.isDebuggerPresent()) {
      return
    }

    var payload = {
      ts: Date.now(),
      type: type,
      plugin: String(context.scriptPath),
      values: values.map(sketchDebugger.prepareValue),
      stack: getStack(),
    }

    sketchDebugger.sendToDebugger(actions.ADD_LOG, payload)
  }

  var indentLevel = 0
  function indentString() {
    var indent = ''
    for (var i = 0; i < indentLevel; i++) {
      indent += '  '
    }
    if (indentLevel > 0) {
      indent += '| '
    }
    return indent
  }

  var oldGroup = console.group

  console.group = function() {
    // log to the JS context
    oldGroup && oldGroup.apply(this, arguments)
    indentLevel += 1
    sketchDebugger.sendToDebugger(actions.GROUP, {
      plugin: String(context.scriptPath),
      collapsed: false,
    })
  }

  var oldGroupCollapsed = console.groupCollapsed

  console.groupCollapsed = function() {
    // log to the JS context
    oldGroupCollapsed && oldGroupCollapsed.apply(this, arguments)
    indentLevel += 1
    sketchDebugger.sendToDebugger(actions.GROUP, {
      plugin: String(context.scriptPath),
    })
  }

  var oldGroupEnd = console.groupEnd

  console.groupEnd = function() {
    // log to the JS context
    oldGroupEnd && oldGroupEnd.apply(this, arguments)
    indentLevel -= 1
    if (indentLevel < 0) {
      indentLevel = 0
    }
    sketchDebugger.sendToDebugger(actions.GROUP_END, {
      plugin: context.scriptPath,
    })
  }

  var counts = {}
  var oldCount = console.count

  console.count = function(label) {
    label = typeof label !== 'undefined' ? label : 'Global'
    counts[label] = (counts[label] || 0) + 1

    // log to the JS context
    oldCount && oldCount.apply(this, arguments)
    return logEverywhere('log', [label + ': ' + counts[label]])
  }

  var timers = {}
  var oldTime = console.time

  console.time = function(label) {
    // log to the JS context
    oldTime && oldTime.apply(this, arguments)

    label = typeof label !== 'undefined' ? label : 'default'
    if (timers[label]) {
      return logEverywhere('warn', ['Timer "' + label + '" already exists'])
    }

    timers[label] = Date.now()
    return
  }

  var oldTimeEnd = console.timeEnd

  console.timeEnd = function(label) {
    // log to the JS context
    oldTimeEnd && oldTimeEnd.apply(this, arguments)

    label = typeof label !== 'undefined' ? label : 'default'
    if (!timers[label]) {
      return logEverywhere('warn', ['Timer "' + label + '" does not exist'])
    }

    var duration = Date.now() - timers[label]
    delete timers[label]
    return logEverywhere('log', [label + ': ' + (duration / 1000) + 'ms'])
  }

  var oldLog = console.log

  console.log = function() {
    // log to the JS context
    oldLog && oldLog.apply(this, arguments)
    return logEverywhere('log', arguments)
  }

  var oldWarn = console.warn

  console.warn = function() {
    // log to the JS context
    oldWarn && oldWarn.apply(this, arguments)
    return logEverywhere('warn', arguments)
  }

  var oldError = console.error

  console.error = function() {
    // log to the JS context
    oldError && oldError.apply(this, arguments)
    return logEverywhere('error', arguments)
  }

  var oldAssert = console.assert

  console.assert = function(condition, text) {
    // log to the JS context
    oldAssert && oldAssert.apply(this, arguments)
    if (!condition) {
      return logEverywhere('assert', [text])
    }
    return undefined
  }

  var oldInfo = console.info

  console.info = function() {
    // log to the JS context
    oldInfo && oldInfo.apply(this, arguments)
    return logEverywhere('info', arguments)
  }

  var oldClear = console.clear

  console.clear = function() {
    oldClear && oldClear()
    return sketchDebugger.sendToDebugger(actions.CLEAR_LOGS)
  }

  console._skpmEnabled = true

  // polyfill the global object
  var commonjsGlobal = typeof global !== 'undefined' ? global : this

  commonjsGlobal.console = console
}

module.exports = console

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(2)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(console) {Object.defineProperty(exports, "__esModule", {
  value: true
});

exports['default'] = function (context) {
  var webUI = new _sketchModuleWebView2['default'](context, __webpack_require__(6), {
    identifier: 'unique.id', // to reuse the UI
    x: 0,
    y: 0,
    width: 314,
    height: 438,
    background: NSColor.whiteColor(),
    blurredBackground: true,
    onlyShowCloseButton: true,
    hideTitleBar: false,
    title: 'Infinite Button',
    shouldKeepAround: true,
    frameLoadDelegate: {
      // https://developer.apple.com/reference/webkit/webframeloaddelegate?language=objc
      'webView:didFinishLoadForFrame:': function () {
        function webViewDidFinishLoadForFrame(webView, webFrame) {
          context.document.showMessage('UI loaded!');
        }

        return webViewDidFinishLoadForFrame;
      }()
    },
    handlers: {
      nativeLog: function () {
        function nativeLog(config) {

          console.log('received payload is' + config);
          console.log('i reached here');

          var select = context.selection.firstObject();
          // Begin validation of selection
          // Ensure there's only one layer selected
          if (!select) {
            context.document.showMessage('Select a group or symbol first.');
            return;
          }

          if (select instanceof MSLayerGroup) {
            var layers = select.layers();
            if (layers.length < 2) {
              context.document.showMessage('Group contain only single element.');
              return;
            }

            // Loop through child layers to identify the text layer
            var textLayer = nil;
            for (var i = 0; i < layers.length; i++) {
              var layer = layers[i];
              if (layer instanceof MSTextLayer) {
                textLayer = layer;
                break;
              }
            }

            var btnRect = nil;
            for (var i = 0; i < layers.length; i++) {
              var layer = layers[i];
              if (layer instanceof MSShapeGroup) {
                btnRect = layer;
                break;
              }
            }

            // Ensure at least one text layer exists
            if (!textLayer) {
              context.document.showMessage('No Text layer found');
              return;
            }

            // show value input from user
            // context.document.showMessage(config.btnText);

            //Set text layer to auto Width
            if (textLayer.textBehaviour() == 1) {
              textLayer.setTextBehaviour(0);
            }

            //Set text alignment to left
            if (textLayer.textAlignment() != 0) {
              textLayer.setTextAlignment(0);
            }

            // Set font Size
            textLayer.setFontSize(config.fontSize);

            // Get existing Text of button
            var existingButtonText = textLayer.stringValue();

            //Set text input by user
            textLayer.setStringValue(config.btnText);
            setButtonDm(textLayer, btnRect, config);
            select.resizeToFitChildrenWithOption(0); // resize the group field
          }

          // else if (select instanceof MSSymbolInstance) {
          //   var symbolMaster = select.symbolMaster();
          //   var children = symbolMaster.children();
          //   var layerIDs = {};
          //   var masterButtonDimensions;
          //
          //   for(var j = 0; j< children.length; j++) {
          //     var layer = children[j];
          //     if(layer instanceof MSTextLayer)
          //     {
          //       // set overrides, or add an override if doesn't exist
          //       ObjectID = layer.objectID().toString();
          //       console.log('I reached 2')
          //
          //       var existingOverrides = select.overrides()
          //       console.log('existingOverrides'+ existingOverrides);
          // 	  	if (existingOverrides == null) {
          // 	  		// no overrides exist, add one
          // 			select.setOverrides ({ObjectId : "overrideText"});
          //   		existingOverrides = select.overrides();
          // 	  	}
          //
          //       // get the existing overrides and create a mutable copy
          // 	  	var mutableOverrides = NSMutableDictionary.dictionaryWithDictionary(existingOverrides)
          // 	  	mutableOverrides.setObject_forKey(NSMutableDictionary.dictionaryWithDictionary(existingOverrides.objectForKey(0)),0)
          //
          //       console.log('I reached 4')
          //
          //       // Prompt user for input of new button text
          // 			var priorText
          //       if (existingOverrides.objectForKey('ObjectId')) {
          // 				priorText = existingOverrides.objectForKey('ObjectId');
          //         console.log('priorText'+ priorText)
          // 			} else {
          // 				// if no overrides originally, prior text is the string value of the master
          // 				priorText = layer.stringValue();
          //         console.log('priorText 2'+ priorText)
          //
          // 			}
          //       var newText = config.btnText;
          //       console.log(newText)
          //
          //       // Only forge on if user didn't press Cancel
          //
          // 			if (newText) {
          //         // store the text field's master text and width
          //         var textFrame = layer.frame();
          //         var masterText = layer.stringValue();
          //         var masterTextWidth = textFrame.width();
          //
          //         // set the text of the master to the prior text just to measure its width
          //   			var priorTextWidth
          //   			if (priorText == "") {
          //   				// if set text to blank then all styling is lost
          //   				priorTextWidth = 0
          //   			} else {
          //   				layer.setStringValue(priorText);
          //   				priorTextWidth = textFrame.width();
          //   			}
          //
          //         // get the width of the new text
          //         layer.setStringValue(newText);
          //         var newTextWidth = textFrame.width();
          //
          //         console.log(newTextWidth + masterText + newText)
          //
          //         // restore the text field's master text
          //         layer.setStringValue(masterText);
          //
          //         // resize the instance
          // 		    var deltaWidth = newTextWidth - priorTextWidth;
          // 		    var selFrame = select.frame()
          //         selFrame.setWidth(selFrame.width() + deltaWidth);
          //
          //         // update the mutable dictionary
          // 				mutableOverrides.setObject_forKey(newText, ObjectId)
          //
          //         // apply the overrides to the symbol instance
          // 				select.overrides = mutableOverrides;
          //
          //         // deselect and reselect so the override text gets updated in the inspector
          // 				select.setIsSelected(false);
          // 				select.setIsSelected(true);
          //       }
          //     }
          //   }
          // }
          //

          function setButtonDm(textLayer, btnRect, config) {
            var textFrame = textLayer.frame();
            var newWidth = config.paddingLeft + textFrame.width() + config.paddingRight;
            var layerFrame = btnRect.frame();
            var deltaWidth = newWidth - layerFrame.width();

            // var deltaHeight = config.height() - layerFrame.height();
            // console.log('deltaHeight is'+deltaHeight)

            //Set button radius
            btnRect.layers().firstObject().setCornerRadiusFloat(config.btnRadius);

            // Set text color
            textLayer.setTextColor(MSColor.colorWithRed_green_blue_alpha(config.textColor.r / 255, config.textColor.g / 255, config.textColor.b / 255, config.textColor.a));

            //Set background color
            var fill = btnRect.style().fills().firstObject();
            fill.color = MSColor.colorWithRed_green_blue_alpha(config.bgColor.r / 255, config.bgColor.g / 255, config.bgColor.b / 255, config.bgColor.a);

            // set width of button
            if (layerFrame.x() <= textFrame.x() && layerFrame.x() + layerFrame.width() >= textFrame.x()) {
              if (newWidth < config.minWidth) {
                layerFrame.setWidth(config.minWidth);
                textFrame.setMidX(config.minWidth / 2);
              } else {
                layerFrame.setWidth(layerFrame.width() + deltaWidth);
                textFrame.setX(config.paddingLeft);
              }
            } else if (layerFrame.x() > textFrame.x()) {
              // if the layer is entirely to the righ of the text layer, just reposition it
              layerFrame.setX(layerFrame.x() + deltaWidth);
            }

            // set height of button
            if (layerFrame.y() <= textFrame.y() && layerFrame.y() + layerFrame.height() >= textFrame.y()) {
              layerFrame.setHeight(config.height);
              // console.log('height to set is'+config.height);
              // console.log('padding to set is'+config.paddingTop);
              textFrame.setY(config.paddingTop);
            }

            // else if (layerFrame.y()  > textFrame.y()) {
            //       // if the layer is entirely to the bottom of the text layer, just reposition it
            //       layerFrame.setY(layerFrame.y() + deltaHeight);
            // }

            //loop through the layers and resize or reposition all (except textLayer)
            // for (var i = 0; i < layers.length; i++) {
            //   var layer = layers[i];
            //
            //   if (layer != textLayer) {
            //     var layerFrame = layer.frame()
            //
            //     if (layerFrame.x() <= textFrame.x() && layerFrame.x() + layerFrame.width() >= textFrame.x()) {
            //       // if the layer spans the x coordinate of the text layer, assume it's a background layer
            //       // and resize its width accordingly
            //       if(newWidth < config.minWidth){
            //         layerFrame.setWidth(config.minWidth);
            //         textFrame.setMidX(config.minWidth / 2);
            //       }
            //       else{
            //         layerFrame.setWidth(layerFrame.width() + deltaWidth);
            //         textFrame.setX(config.paddingLeft);
            //       }
            //     }
            //     else if (layerFrame.x()  > textFrame.x()) {
            //       // if the layer is entirely to the right of the text layer, just reposition it
            //       layerFrame.setX(layerFrame.x() + deltaWidth);
            //     }
            //   }
            // }
          }

          // else {
          //   context.document.showMessage('Select a group or symbol')
          // }

          // var textFrame = textLayer.frame();
        }

        return nativeLog;
      }()
    }
  });
  //
};

var _sketchModuleWebView = __webpack_require__(7);

var _sketchModuleWebView2 = _interopRequireDefault(_sketchModuleWebView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign, no-var, vars-on-top, prefer-template, prefer-arrow-callback, func-names, prefer-destructuring, object-shorthand */
var remoteWebview = __webpack_require__(4)

module.exports.identifier = 'skpm.debugger'

function toArray(object) {
  if (Array.isArray(object)) {
    return object
  }
  const arr = []
  for (let j = 0; j < object.count(); j += 1) {
    arr.push(object.objectAtIndex(j))
  }
  return arr
}

module.exports.prepareStackTrace = function(stackTrace) {
  var stack = stackTrace.split('\n')
  stack = stack.map(s => s.replace(/\sg/, ''))

  // pop the last 2 frames as it's ours here
  stack.splice(0, 2)

  stack = stack.map(function(entry) {
    var line = null
    var column = null
    var file = null
    var split = entry.split('@')
    var fn = split[0]
    var filePath = split[1]

    if (filePath) {
      split = filePath.split(':')
      filePath = split[0]
      line = split[1]
      column = split[2]
      file = filePath.split('/')
      file = file[file.length - 1]
    }
    return {
      fn: fn,
      file: file,
      filePath: filePath,
      line: line,
      column: column,
    }
  })

  return stack
}

function prepareArray(array, skipMocha) {
  return array.map(function(i) {
    return module.exports.prepareValue(i, skipMocha)
  })
}

module.exports.prepareObject = function(object, skipMocha) {
  const deep = {}
  Object.keys(object).forEach(key => {
    deep[key] = module.exports.prepareValue(object[key], skipMocha)
  })
  return deep
}

function getName(x) {
  return {
    type: 'String',
    primitive: 'String',
    value: String(x.name()),
  }
}

function getSelector(x) {
  return {
    type: 'String',
    primitive: 'String',
    value: String(x.selector()),
  }
}

function introspectMochaObject(value) {
  var mocha = value.class().mocha()
  var introspection = {
    properties: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(mocha.propertiesWithAncestors()).map(getName),
    },
    classMethods: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(mocha.classMethodsWithAncestors()).map(getSelector),
    },
    instanceMethods: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(mocha.instanceMethodsWithAncestors()).map(getSelector),
    },
    protocols: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(mocha.protocolsWithAncestors()).map(getName),
    },
  }
  // if (mocha.treeAsDictionary) {
  //   introspection.treeAsDictionary = mocha.treeAsDictionary()
  // }
  return introspection
}

module.exports.prepareValue = function prepareValue(value, skipMocha) {
  let type = 'String'
  let primitive = 'String'
  const typeOf = typeof value
  if (value instanceof Error) {
    type = 'Error'
    primitive = 'Error'
    value = {
      message: value.message,
      name: value.name,
      stack: module.exports.prepareStackTrace(value.stack),
    }
  } else if (Array.isArray(value)) {
    type = 'Array'
    primitive = 'Array'
    value = prepareArray(value, skipMocha)
  } else if (value === null || value === undefined || Number.isNaN(value)) {
    type = 'Empty'
    primitive = 'Empty'
    value = String(value)
  } else if (typeOf === 'object') {
    if (value.isKindOfClass && typeof value.class === 'function') {
      type = String(value.class())
      // TODO: Here could come some meta data saved as value
      if (
        type === 'NSDictionary' ||
        type === '__NSDictionaryM' ||
        type === '__NSSingleEntryDictionaryI' ||
        type === '__NSDictionaryI' ||
        type === '__NSCFDictionary'
      ) {
        primitive = 'Object'
        value = module.exports.prepareObject(Object(value), skipMocha)
      } else if (
        type === 'NSArray' ||
        type === 'NSMutableArray' ||
        type === '__NSArrayM'
      ) {
        primitive = 'Array'
        value = prepareArray(toArray(value), skipMocha)
      } else if (
        type === 'NSString' ||
        type === '__NSCFString' ||
        type === 'NSTaggedPointerString' ||
        type === '__NSCFConstantString'
      ) {
        primitive = 'String'
        value = String(value)
      } else if (type === '__NSCFNumber' || type === 'NSNumber') {
        primitive = 'Number'
        value = 0 + value
      } else if (type === 'MOStruct') {
        type = String(value.name())
        primitive = 'Object'
        value = value.memberNames().reduce(function(prev, k) {
          prev[k] = module.exports.prepareValue(value[k], skipMocha)
          return prev
        }, {})
      } else if (value.class().mocha && !skipMocha) {
        primitive = 'Mocha'
        value = introspectMochaObject(value)
      } else {
        primitive = 'Unknown'
        value = type
      }
    } else {
      type = 'Object'
      primitive = 'Object'
      value = module.exports.prepareObject(value, skipMocha)
    }
  } else if (typeOf === 'function') {
    type = 'Function'
    primitive = 'Function'
    value = String(value)
  } else if (value === true || value === false) {
    type = 'Boolean'
    primitive = 'Boolean'
  } else if (typeOf === 'number') {
    primitive = 'Number'
    type = 'Number'
  }

  return { value, type, primitive }
}

module.exports.isDebuggerPresent = remoteWebview.isWebviewPresent.bind(
  this,
  module.exports.identifier
)

module.exports.sendToDebugger = function sendToDebugger(name, payload) {
  return remoteWebview.sendToWebview(
    module.exports.identifier,
    'sketchBridge(' + JSON.stringify({ name, payload }) + ');'
  )
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/* globals NSThread */

var threadDictionary = NSThread.mainThread().threadDictionary()

module.exports.isWebviewPresent = function isWebviewPresent (identifier) {
  return !!threadDictionary[identifier]
}

module.exports.sendToWebview = function sendToWebview (identifier, evalString) {
  if (!module.exports.isWebviewPresent(identifier)) {
    throw new Error('Webview ' + identifier + ' not found')
  }

  var webview = threadDictionary[identifier]
    .contentView()
    .subviews()
  webview = webview[webview.length - 1]

  return webview.stringByEvaluatingJavaScriptFromString(evalString)
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports.SET_TREE = 'elements/SET_TREE'
module.exports.SET_PAGE_METADATA = 'elements/SET_PAGE_METADATA'
module.exports.SET_LAYER_METADATA = 'elements/SET_LAYER_METADATA'
module.exports.ADD_LOG = 'logs/ADD_LOG'
module.exports.CLEAR_LOGS = 'logs/CLEAR_LOGS'
module.exports.GROUP = 'logs/GROUP'
module.exports.GROUP_END = 'logs/GROUP_END'
module.exports.TIMER_START = 'logs/TIMER_START'
module.exports.TIMER_END = 'logs/TIMER_END'
module.exports.ADD_REQUEST = 'network/ADD_REQUEST'
module.exports.SET_RESPONSE = 'network/SET_RESPONSE'
module.exports.ADD_ACTION = 'actions/ADD_ACTION'


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "file://" + context.plugin.urlForResourceNamed("_webpack_resources/74b889316022767adddb22e1374c7704.html").path();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* globals NSUUID NSThread NSPanel NSMakeRect NSTexturedBackgroundWindowMask NSTitledWindowMask NSWindowTitleHidden NSClosableWindowMask NSColor NSWindowMiniaturizeButton NSWindowZoomButton NSFloatingWindowLevel WebView COScript NSWindowCloseButton NSFullSizeContentViewWindowMask NSVisualEffectView NSAppearance NSAppearanceNameVibrantLight NSVisualEffectBlendingModeBehindWindow NSLayoutConstraint NSLayoutRelationEqual NSLayoutAttributeLeft NSLayoutAttributeTop NSLayoutAttributeRight NSLayoutAttributeBottom NSResizableWindowMask */
var MochaJSDelegate = __webpack_require__(8)
var parseQuery = __webpack_require__(9)

var coScript = COScript.currentCOScript()

var LOCATION_CHANGED = 'webView:didChangeLocationWithinPageForFrame:'

function addEdgeConstraint (edge, subview, view, constant) {
  view.addConstraint(NSLayoutConstraint.constraintWithItem_attribute_relatedBy_toItem_attribute_multiplier_constant(
    subview,
    edge,
    NSLayoutRelationEqual,
    view,
    edge,
    1,
    constant
  ))
}
function fitSubviewToView (subview, view, constants) {
  subview.setTranslatesAutoresizingMaskIntoConstraints(false)

  addEdgeConstraint(NSLayoutAttributeLeft, subview, view, constants[0])
  addEdgeConstraint(NSLayoutAttributeTop, subview, view, constants[1])
  addEdgeConstraint(NSLayoutAttributeRight, subview, view, constants[2])
  addEdgeConstraint(NSLayoutAttributeBottom, subview, view, constants[3])
}

function WebUI (context, frameLocation, options) {
  options = options || {}
  var identifier = options.identifier || NSUUID.UUID().UUIDString()
  var threadDictionary = NSThread.mainThread().threadDictionary()

  var panel
  var webView

  // if we already have a panel opened, reuse it
  if (threadDictionary[identifier]) {
    panel = threadDictionary[identifier]
    panel.makeKeyAndOrderFront(null)

    var subviews = panel.contentView().subviews()
    for (var i = 0; i < subviews.length; i++) {
      if (subviews[i].isKindOfClass(WebView.class())) {
        webView = subviews[i]
      }
    }

    if (!webView) {
      throw new Error('Tried to reuse panel but couldn\'t find the webview inside')
    }

    return {
      panel: panel,
      eval: webView.stringByEvaluatingJavaScriptFromString,
      webView: webView
    }
  }

  panel = NSPanel.alloc().init()

  // Window size
  var panelWidth = options.width || 240
  var panelHeight = options.height || 180
  panel.setFrame_display(NSMakeRect(
    options.x || 0,
    options.y || 0,
    panelWidth,
    panelHeight
  ), true)

  // Titlebar
  panel.setTitle(options.title || context.plugin.name())
  if (options.hideTitleBar) {
    panel.setTitlebarAppearsTransparent(true)
    panel.setTitleVisibility(NSWindowTitleHidden)
  }

  // Hide minize and zoom buttons
  if (options.onlyShowCloseButton) {
    panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true)
    panel.standardWindowButton(NSWindowZoomButton).setHidden(true)
  }

  // Close window callback
  var closeButton = panel.standardWindowButton(NSWindowCloseButton)
  function closeHandler () {
    if (options.onPanelClose) {
      var result = options.onPanelClose()
      if (result === false) {
        return
      }
    }
    panel.close()
    threadDictionary.removeObjectForKey(options.identifier)
    coScript.setShouldKeepAround(false)
  }

  closeButton.setCOSJSTargetFunction(closeHandler)
  closeButton.setAction('callAction:')

  panel.setStyleMask(options.styleMask || (
    options.resizable
    ? (NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSResizableWindowMask | NSClosableWindowMask | NSFullSizeContentViewWindowMask)
    : (NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSClosableWindowMask | NSFullSizeContentViewWindowMask)
  ))
  panel.becomeKeyWindow()
  panel.setLevel(NSFloatingWindowLevel)

  // Appearance
  var backgroundColor = options.background || NSColor.whiteColor()
  panel.setBackgroundColor(backgroundColor)
  if (options.blurredBackground) {
    var vibrancy = NSVisualEffectView.alloc().initWithFrame(NSMakeRect(0, 0, panelWidth, panelHeight))
    vibrancy.setAppearance(NSAppearance.appearanceNamed(NSAppearanceNameVibrantLight))
    vibrancy.setBlendingMode(NSVisualEffectBlendingModeBehindWindow)

    // Add it to the panel
    panel.contentView().addSubview(vibrancy)
    fitSubviewToView(vibrancy, panel.contentView(), [0, 0, 0, 0])
  }

  threadDictionary[identifier] = panel

  if (options.shouldKeepAround !== false) { // Long-running script
    coScript.setShouldKeepAround(true)
  }

  // Add Web View to window
  webView = WebView.alloc().initWithFrame(NSMakeRect(
    0,
    options.hideTitleBar ? -24 : 0,
    options.width || 240,
    (options.height || 180) - (options.hideTitleBar ? 0 : 24)
  ))

  if (options.frameLoadDelegate || options.handlers) {
    var handlers = options.frameLoadDelegate || {}
    if (options.handlers) {
      var lastQueryId
      handlers[LOCATION_CHANGED] = function (webview, frame) {
        var query = webview.windowScriptObject().evaluateWebScript('window.location.hash')
        query = parseQuery(query)
        if (query.pluginAction && query.actionId && query.actionId !== lastQueryId && query.pluginAction in options.handlers) {
          lastQueryId = query.actionId
          try {
            query.pluginArgs = JSON.parse(query.pluginArgs)
          } catch (err) {}
          options.handlers[query.pluginAction].apply(context, query.pluginArgs)
        }
      }
    }
    var frameLoadDelegate = new MochaJSDelegate(handlers)
    webView.setFrameLoadDelegate_(frameLoadDelegate.getClassInstance())
  }
  if (options.uiDelegate) {
    var uiDelegate = new MochaJSDelegate(options.uiDelegate)
    webView.setUIDelegate_(uiDelegate.getClassInstance())
  }

  if (!options.blurredBackground) {
    webView.setOpaque(true)
    webView.setBackgroundColor(backgroundColor)
  } else {
    // Prevent it from drawing a white background
    webView.setDrawsBackground(false)
  }

  // When frameLocation is a file, prefix it with the Sketch Resources path
  if ((/^(?!http|localhost|www|file).*\.html?$/).test(frameLocation)) {
    frameLocation = context.plugin.urlForResourceNamed(frameLocation).path()
  }
  webView.setMainFrameURL_(frameLocation)

  panel.contentView().addSubview(webView)
  fitSubviewToView(webView, panel.contentView(), [
    0, options.hideTitleBar ? 0 : 24, 0, 0
  ])

  panel.center()
  panel.makeKeyAndOrderFront(null)

  return {
    panel: panel,
    eval: webView.stringByEvaluatingJavaScriptFromString,
    webView: webView,
    close: closeHandler
  }
}

WebUI.clean = function () {
  coScript.setShouldKeepAround(false)
}

module.exports = WebUI


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/* globals NSUUID MOClassDescription NSObject NSSelectorFromString NSClassFromString */

module.exports = function (selectorHandlerDict, superclass) {
  var uniqueClassName = 'MochaJSDelegate_DynamicClass_' + NSUUID.UUID().UUIDString()

  var delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(uniqueClassName, superclass || NSObject)

  delegateClassDesc.registerClass()

  // Storage Handlers
  var handlers = {}

  // Define interface
  this.setHandlerForSelector = function (selectorString, func) {
    var handlerHasBeenSet = (selectorString in handlers)
    var selector = NSSelectorFromString(selectorString)

    handlers[selectorString] = func

    /*
      For some reason, Mocha acts weird about arguments: https://github.com/logancollins/Mocha/issues/28
      We have to basically create a dynamic handler with a likewise dynamic number of predefined arguments.
    */
    if (!handlerHasBeenSet) {
      var args = []
      var regex = /:/g
      while (regex.exec(selectorString)) {
        args.push('arg' + args.length)
      }

      var dynamicFunction = eval('(function (' + args.join(', ') + ') { return handlers[selectorString].apply(this, arguments); })')

      delegateClassDesc.addInstanceMethodWithSelector_function_(selector, dynamicFunction)
    }
  }

  this.removeHandlerForSelector = function (selectorString) {
    delete handlers[selectorString]
  }

  this.getHandlerForSelector = function (selectorString) {
    return handlers[selectorString]
  }

  this.getAllHandlers = function () {
    return handlers
  }

  this.getClass = function () {
    return NSClassFromString(uniqueClassName)
  }

  this.getClassInstance = function () {
    return NSClassFromString(uniqueClassName).new()
  }

  // Convenience
  if (typeof selectorHandlerDict === 'object') {
    for (var selectorString in selectorHandlerDict) {
      this.setHandlerForSelector(selectorString, selectorHandlerDict[selectorString])
    }
  }
}


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = function (query) {
  query = query.split('?')[1]
  if (!query) { return }
  query = query.split('&').reduce(function (prev, s) {
    var res = s.split('=')
    if (res.length === 2) {
      prev[decodeURIComponent(res[0])] = decodeURIComponent(res[1])
    }
    return prev
  }, {})
  return query
}


/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = run.bind(this, 'default')
