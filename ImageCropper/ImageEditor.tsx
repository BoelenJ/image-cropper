import * as React from 'react';
import { useState, useCallback, useEffect,useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';

export interface props {
  containerWidth: number;
  containerHeight: number;
  image: string;
  extractImage: boolean;
  borderRadius: number;
  handleCrop: (base64: string) => void;
  zoom: number;
  rotation: number;
  border: number;
}

export function ImageEditor(props: props) {
  const editor = useRef<AvatarEditor>(null);

  const getCroppedImage = useCallback(async () => {
    if(editor){
      const image = editor.current?.getImage().toDataURL('image/jpeg');
      if(image){
        return image;
      }
    }
  }, [editor, props.extractImage]);

  useEffect(() => {
    if (props.extractImage == true) {
      getCroppedImage().then((image) => {
        if (image) {
          console.log(image);
          props.handleCrop(image)
        }
      });
    } else {
      props.handleCrop("");
    }
  }, [props.extractImage]);

  return (
      <AvatarEditor
      crossOrigin="anonymous"
      ref={editor}
      image={props.image}
      width={props.containerWidth}
      height={props.containerHeight}
      borderRadius={props.borderRadius}
      border={props.border}
      scale={props.zoom}
      color={[0, 0, 0, 0.3]} // RGBA
      rotate={props.rotation}
    />
  )
}

