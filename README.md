# Custom image cropper control

A PCF control that wraps the [Avatar editor](https://www.npmjs.com/package/react-avatar-editor) react component. The control allows for cropping images and has the following features:
 - Zooming functionality
 - Rotating the image
 - Dynamically changing the cropping area, including the border radius
 - Mobile friendly

## Properties
The component accepts the following input properties:
| Property | Description                |
| :-------- | :------------------------- |
| Image | The image to crop. This can either be a URL to a (public) image, or a base64 encoded version of the image. For more information on base64 encoding in a canvas app, see below. |
| ExtractImage | A boolean to indicate whether the image should be extracted, when true, the onChange will be triggered and a base64 version of the extracted image will be available. For the best practise on how to deal with this, see below. |
| Rotation | A number between 0 and 360 that indicates how much the image should be rotated.   |
| Zoom | A number that indicates how much the image is zoomed in or out, defaults to 1.  |
| Border | A number that influences the width of the border around the cropped area, the higher the number, the bigger the border will be, defaults to 40.  |
| BorderRadius | A number to influence the radius of the border of the cropped area.  |
| OnChange | This default input property accepts certain logic to run onChange of the control, setting up this logic is crucial for the component to work properly, please see below for more information.  |

The component has the following output properties:
| Property | Description                |
| :-------- | :------------------------- |
| CroppedImage | A base64 encoded version of the cropped image. |

### Base64 in canvas apps

As mentioned in the properties, the control mostly works with Base64 as PCF components cannot otherwise get or return an image. This means that you would need to convert your images to base64 before passing it to the component, the code below can help you easily achieve this.

To encode your image, you can use the following code. Replace {YOUR_CONTROL} with the name of your control, this can be an image control, image column, camera control etc. You can use the output of this function (base64Image) to pass as the Image property of the ImageCropper.

```
Set(base64Image, Mid(JSON({YOUR_CONTROL}.{IMAGE},JSONFormat.IncludeBinaryData),2, Len(JSON({YOUR_CONTROL}.{IMAGE},JSONFormat.IncludeBinaryData))-2))
```

The component also outputs a base64 version of the cropped image, you can use this as is in the canvas app, but to save it to a back-end database, you probably need to map it properly, below you can find an example of storing it in Dataverse:

```
Patch('Cropped Images', Defaults('Cropped Images'), {
    Cropped: {Full: croppedImage, Value: croppedImage}
});
```

### Controlling the state of the component

As seen in the input properties, the state of the component is controlled by input variables. The most important properties for this are the ExtractImage and OnChange. The recommmendation would be to set those up as follows:

#### Create a "ExtractImage" local variable
When showing the page that contains the image cropper, initialize a local boolean variable called "ExtractImage" that is set to false:
```
Navigate(
    'Image Cropper',
    ScreenTransition.None,
    {
        ExtractImage: false,
    }
);
```

#### Set the ExtractImage property of the ImageCropper to this variable
To make sure you can control the state of the component, set the input property "ExtractImage" of the ImageCropper component to the local variable you just created.

#### Add a button to crop the image
Now, you can add a button that crops the image onSelect of the button. The only thing the button needs to do, is set the ExtractImage to true:

```
UpdateContext({ExtractImage: true});
```

Setting this to true will trigger the onChange event of the ImageCropper component, in which you need to handle the cropped image output (see next step).

#### Set OnChange of the ImageCropper
The image cropper component outputs its state, which can either be running or completed. When ExtractImage is set to true, the state is completed, which means the croppedImage is ready to be saved. You can handle this by using the following code in the OnChange property of the ImageCropper component:

```
If(
    Self.State = "Completed",
    Set(croppedImage,Self.CroppedImage);UpdateContext({ExtractImage:false})
)
```

This snippet does two things, firstly is saves the croppedImage Base64 in a global variable, you can update this to be a local variable as well. Secondly, it resets the extractImage local variable so that the cropper can be used immediately after again.

#### Other
All the other input properties can be handled either by hardcoding values in the respective properties, but you can also use it dynamically by using sliders as an example.

### Sample implementation

The repository also contains a sample implementation solution file (unmanaged) that you can directly import in your environment. It contains a mobile form factor canvas app, the component and a dataverse table which stores the full and cropped images. See below for a small demo:







