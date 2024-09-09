import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import  "../../SCSS/DragDrop.scss"
import DragDropImage from "../../assets/images/AttachmentAreaBGImage.png"
function DragDrop({file ,setFile}) {
   
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the 
    setFile(acceptedFiles)
    console.log(acceptedFiles)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
      
        <div className="file-input-icon" >
        <img className="drop-logo" src={DragDropImage} style={{ height: "90px", width: "100px" }} alt="" />
        <div className="" style={{ minWidth: 'max-content', marginTop: '-7px' }}>
            {/* {selectedFile && (multiple || selectedFile.length === 0) && ( */}
           
                <>
                    <span className="drag_text">Drop your file</span>
                </> 
                
            {/* )} */}
        </div>
    </div>
      }
    </div>
  )
}
export default DragDrop;