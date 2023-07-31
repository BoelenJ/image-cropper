import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { ImageEditor, props } from "./ImageEditor";	
import * as React from "react";
import { IState } from "./IState";

export class ImageCropper implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private cropState: IState;
    private croppedImage: string;

    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        context.mode.trackContainerResize(true);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {

        const image = context.parameters.Image.raw != null ? context.parameters.Image.raw : "";
        const extractImage = context.parameters.ExtractImage.raw;        
        const zoom = context.parameters.Zoom.raw != null ? context.parameters.Zoom.raw : 1;
        const rotation = context.parameters.Rotation.raw != null ? context.parameters.Rotation.raw : 0;
        const containerWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const containerHeight = parseInt(context.mode.allocatedHeight as unknown as string);
        const borderRadius = context.parameters.BorderRadius.raw != null ? context.parameters.BorderRadius.raw : 0;
        const border = context.parameters.Border.raw != null ? context.parameters.Border.raw : 50;

        const width = containerWidth - (border * 2);
        const height = containerHeight - (border * 2);

        const props: props = { 
            containerHeight: height > 0 ? height : 100,
            containerWidth: width > 0 ? width : 100,
            image: image,
            extractImage: extractImage,
            handleCrop: this.handleCrop.bind(this),
            zoom: zoom,
            rotation: rotation,
            borderRadius: borderRadius,
            border: border
        };
        return React.createElement(
            ImageEditor, props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { 
            CroppedImage: this.croppedImage,
            State: this.cropState.Name,
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }

    private handleCrop(base64: string): void {
        console.log("handleCrop");
        console.log(base64);
        if(base64 == null || base64 == "") {
            this.cropState = {
                Name: "Running"
              };
            this.croppedImage = "";
            this.notifyOutputChanged();
        }else{
            this.cropState = {
                Name: "Completed"
              };
            this.croppedImage = base64;
            this.notifyOutputChanged();
        }
    }
}
