import pluginCall from 'sketch-module-web-view/client'
import contextValidate from 'sketch-module-web-view/client'

// Disable the context menu to have a more native feel
document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
});

var config = {
              btnText:"I'm awesome",
              btnSize:"regular",
              btnType:"primary",
              minWidth: 56,
              btnRadius: 3
            }

const buttonType = {
  primary : {
    textColor: {r:255, g:255, b:255, a: 1},
    bgColor: {r:0, g:112, b:221, a:1}
  },
  secondary : {
    textColor: {r:45, g:45, b:45, a:1},
    bgColor: {r: 237, g:237, b:237, a:1}
  },
  alert: {
    textColor: {r:255, g:255, b:255, a: 1},
    bgColor: {r: 217, g:55, b:55, a:1}
  },
  success: {
    textColor: {r:255, g:255, b:255, a: 1},
    bgColor: {r: 45, g:169, b:83, a:1}
  },
  warning: {
    textColor: {r:255, g:255, b:255, a: 1},
    bgColor: {r: 247, g:143, b:30, a:1}
  },
  transparent: {
    textColor: {r:45, g:45, b:45, a:1},
    bgColor: {r: 237, g:237, b:237, a:0}
  }
}

const buttonProps = {
  tiny: {
    paddingTop: 2,
    paddingLeft:12,
    paddingRight:12,
    height:24,
    fontSize: 14,
  },
  small: {
    paddingTop: 4,
    paddingLeft:12,
    paddingRight:12,
    height:28,
    fontSize: 14,
  },
  regular: {
    paddingTop: 6,
    paddingLeft:12,
    paddingRight:12,
    height:32,
    fontSize: 14,
  },
  large: {
    paddingTop: 8,
    paddingLeft:16,
    paddingRight:16,
    height:40,
    fontSize: 16,
  }
}
//
// document.getElementById('button').onkeydown = function(e){
//    if(e.keyCode == 13){
//      // submit
//    }
// };



window.onload = contextValidate('contextValidate');

// called from the plugin
window.setExistingText = function (text) {
  console.log('random number is ' + text);
  document.getElementById('btn-text').value = text;
  // document.getElementById('answer').innerHTML = 'Random number from the plugin: ' + text
}

document.getElementById('button').addEventListener('click', function () {

  config.btnText = document.getElementById('btn-text').value;

  var radioBtnSize = document.getElementsByName('btn-size');
  for (var i = 0, length = radioBtnSize.length; i < length; i++)
  {
   if (radioBtnSize[i].checked)
   {
    config.btnSize = radioBtnSize[i].value;
    break;
   }
  }


  var radioBtnType = document.getElementsByName('btn-type');
  for (var i = 0, length = radioBtnType.length; i < length; i++)
  {
   if (radioBtnType[i].checked)
   {
    config.btnType = radioBtnType[i].value;
    break;
   }
  }


  var payload = Object.assign({}, config, buttonProps[config.btnSize], buttonType[config.btnType]);
  console.log('sent payload is '+payload);

  pluginCall('nativeLog', payload)
})




//
// // called from the plugin
// window.setRandomNumber = function (randomNumber) {
//   document.getElementById('answer').innerHTML = 'Random number from the plugin: ' + randomNumber
// }
