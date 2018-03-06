import WebUI from 'sketch-module-web-view'

export default function(context) {
  const webUI = new WebUI(context, require('../resources/webview.html'), {
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
    frameLoadDelegate: { // https://developer.apple.com/reference/webkit/webframeloaddelegate?language=objc
      'webView:didFinishLoadForFrame:'(webView, webFrame) {
        context.document.showMessage('UI loaded!')
      }
    },
    handlers: {
      nativeLog(config) {

        console.log('received payload is' + config);
        console.log('i reached here');

        var select= context.selection.firstObject();
        // Begin validation of selection
        // Ensure there's only one layer selected
        if(!select) {
          context.document.showMessage('Select a group or symbol first.');
          return;
        }

        if(select instanceof MSLayerGroup) {
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
          if(textLayer.textBehaviour() == 1) {
            textLayer.setTextBehaviour(0)
          }

          //Set text alignment to left
          if(textLayer.textAlignment() != 0) {
            textLayer.setTextAlignment(0)
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
          textLayer.setTextColor(MSColor.colorWithRed_green_blue_alpha(config.textColor.r / 255, config.textColor.g / 255, config.textColor.b / 255, config.textColor.a))

          //Set background color
          var fill = btnRect.style().fills().firstObject();
          fill.color = MSColor.colorWithRed_green_blue_alpha(config.bgColor.r / 255, config.bgColor.g / 255, config.bgColor.b / 255,config.bgColor.a);


          // set width of button
          if (layerFrame.x() <= textFrame.x() && layerFrame.x() + layerFrame.width() >= textFrame.x()) {
            if(newWidth < config.minWidth){
              layerFrame.setWidth(config.minWidth);
              textFrame.setMidX(config.minWidth / 2);
            }
            else{
              layerFrame.setWidth(layerFrame.width() + deltaWidth);
              textFrame.setX(config.paddingLeft);
            }
          }

          else if (layerFrame.x()  > textFrame.x()) {
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
    }
  })
  //
}
