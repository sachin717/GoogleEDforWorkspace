import * as React from "react";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from 'react-image-crop';
 
function ImageCropper(props: { imageToCrop: string; onImageCropped: (croppedImage: any) => void; height?:any;width?:any }) {
    const {width=120,height=120}=props
    const [cropConfig, setCropConfig] = React.useState<any>({
        unit: "px",
        width: width,
        height: height,
    });
 
    const [imageRef, setImageRef] = React.useState<HTMLImageElement | null>(null);
 
    async function cropImage(crop: any) {
        if (imageRef && crop.width && crop.height) {
            const croppedImage = await getCroppedImage(
                imageRef,
                crop,
                "croppedImage.png"
            );
            props.onImageCropped(croppedImage);
        }
    }
 
    function getCroppedImage(sourceImage: HTMLImageElement, cropConfig: any, fileName: string): Promise<Blob> {
        const canvas = document.createElement("canvas");
        const scaleX = sourceImage.naturalWidth / sourceImage.width;
        const scaleY = sourceImage.naturalHeight / sourceImage.height;
        canvas.width = cropConfig.width;
        canvas.height = cropConfig.height;
        const ctx = canvas.getContext("2d");
 
        if (!ctx) throw new Error('2D Context is not supported.');
 
        ctx.drawImage(
            sourceImage,
            cropConfig.x * scaleX,
            cropConfig.y * scaleY,
            cropConfig.width * scaleX,
            cropConfig.height * scaleY,
            0,
            0,
            cropConfig.width,
            cropConfig.height
        );
 
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob: any) => {
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }
 
                blob.name = fileName;
                resolve(blob);
            }, "image/png");
        });
    }
 
    return (
        <>
            <ReactCrop
                //  src={imageToCrop}
                //  onImageLoaded={(imageRef) => setImageRef(imageRef)}
                //  crossorigin="anonymous" // to avoid CORS-related problems
                crop={cropConfig}
                ruleOfThirds
                onComplete={(cropConfig) => cropImage(cropConfig)}
                onChange={(cropConfig) => setCropConfig(cropConfig)}
                maxWidth={width} // 1080
                maxHeight={height} // 720
            >
                <img
                    height={height}
                    width={width}
                    style={{objectFit:"contain"}}
                    src={props.imageToCrop}
                    onLoad={(e) => setImageRef(e.target as HTMLImageElement)}
                    alt="Crop Preview"
                />
            </ReactCrop>
        </>
    );
}
 
export default ImageCropper;