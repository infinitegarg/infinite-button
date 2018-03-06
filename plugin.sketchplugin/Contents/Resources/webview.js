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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var _client = __webpack_require__(1);

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Disable the context menu to have a more native feel
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

var config = {
  btnText: "I'm awesome",
  btnSize: "regular",
  btnType: "primary",
  minWidth: 56,
  btnRadius: 3
};

var buttonType = {
  primary: {
    textColor: { r: 255, g: 255, b: 255, a: 1 },
    bgColor: { r: 0, g: 112, b: 221, a: 1 }
  },
  secondary: {
    textColor: { r: 45, g: 45, b: 45, a: 1 },
    bgColor: { r: 237, g: 237, b: 237, a: 1 }
  },
  alert: {
    textColor: { r: 255, g: 255, b: 255, a: 1 },
    bgColor: { r: 217, g: 55, b: 55, a: 1 }
  },
  success: {
    textColor: { r: 255, g: 255, b: 255, a: 1 },
    bgColor: { r: 45, g: 169, b: 83, a: 1 }
  },
  warning: {
    textColor: { r: 255, g: 255, b: 255, a: 1 },
    bgColor: { r: 247, g: 143, b: 30, a: 1 }
  },
  transparent: {
    textColor: { r: 45, g: 45, b: 45, a: 1 },
    bgColor: { r: 237, g: 237, b: 237, a: 0 }
  }
};

var buttonProps = {
  tiny: {
    paddingTop: 2,
    paddingLeft: 12,
    paddingRight: 12,
    height: 24,
    fontSize: 14
  },
  small: {
    paddingTop: 4,
    paddingLeft: 12,
    paddingRight: 12,
    height: 28,
    fontSize: 14
  },
  regular: {
    paddingTop: 6,
    paddingLeft: 12,
    paddingRight: 12,
    height: 32,
    fontSize: 14
  },
  large: {
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
    height: 40,
    fontSize: 16
  }
  //
  // document.getElementById('button').onkeydown = function(e){
  //    if(e.keyCode == 13){
  //      // submit
  //    }
  // };


};document.getElementById('button').addEventListener('click', function () {

  config.btnText = document.getElementById('btn-text').value;

  var radioBtnSize = document.getElementsByName('btn-size');
  for (var i = 0, length = radioBtnSize.length; i < length; i++) {
    if (radioBtnSize[i].checked) {
      config.btnSize = radioBtnSize[i].value;
      break;
    }
  }

  var radioBtnType = document.getElementsByName('btn-type');
  for (var i = 0, length = radioBtnType.length; i < length; i++) {
    if (radioBtnType[i].checked) {
      config.btnType = radioBtnType[i].value;
      break;
    }
  }

  var payload = Object.assign({}, config, buttonProps[config.btnSize], buttonType[config.btnType]);
  console.log('sent payload is ' + payload);

  (0, _client2["default"])('nativeLog', payload);
});

//
// // called from the plugin
// window.setRandomNumber = function (randomNumber) {
//   document.getElementById('answer').innerHTML = 'Random number from the plugin: ' + randomNumber
// }

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function (actionName) {
  if (!actionName) {
    throw new Error('missing action name')
  }
  var args = [].slice.call(arguments).slice(1)
  var previousHash = (window.location.hash.split('?')[1] ? window.location.hash.split('?')[0] : window.location.hash)
  window.location.hash = previousHash +
    '?pluginAction=' + encodeURIComponent(actionName) +
    '&actionId=' + Date.now() +
    '&pluginArgs=' + encodeURIComponent(JSON.stringify(args))
  return
}


/***/ })
/******/ ]);