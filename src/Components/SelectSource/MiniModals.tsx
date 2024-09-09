import React, { Children, useEffect, useRef, useState } from 'react';
import "./Styles.scss"
import {
  DirectionalHint,
  IIconProps,
  Icon,
  IconButton,
  TeachingBubble,
} from "@fluentui/react";
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import { PrimaryButton } from '@fluentui/react';
const MiniModals = ({ tooltipText="", heading,minHeight,maxHeight,height,children,minWidth,width,message="", onYes=()=>{}, onNo=()=>{},buttonOneText="Yes",buttonTwoText="No" ,isPanel,crossButton,showButtons,closeAction}) => {

const[teachingBubbleOpen,setTeachingBubbleOpen]=useState(false);
 
useEffect(() => {
  if (heading?.length>0) {
    // Disable body scrolling when popup is open
    document.body.style.overflowY = 'hidden';
  } else {
    
    document.body.style.overflowY = 'scroll';
  }

  
  return () => {
    document.body.style.overflow = 'scroll';
  };
}, []);
  const handleYesClick = () => {
    
    if (onYes) {
        onYes();
       
       
    }
  };

  const handleNoClick = () => {
    
    if (onNo) {
      onNo();
      

    }
  };
 function handleClossButton(){
    closeAction();
 }
  return (
    <>
   
 <div className={`overlay ${isPanel&&"absolute"}`} >
 
      <div  style={{ height: `${height}`,maxHeight:`${maxHeight}`,minHeight: `${minHeight}`,width:`${width}`, minWidth: `${minWidth}`}} className="mini_popup_modal">
      <div className="popInnerBox" >
  <div>

     { crossButton && <div className='popup_head'>
      <div style={{display:"flex",gap:"5px",alignItems:"center"}}>
        <h3 className='heading'>{heading} </h3>
      { tooltipText && <IconButton className='toptip'

                  id="targetButtonExcl"
                  title={
                    tooltipText }
                  onClick={()=>{setTeachingBubbleOpen(true)}}
                  iconProps={{ iconName: "Info" }}
                ></IconButton>}
                {/* {teachingBubbleOpen && (
                  <TeachingBubble
                    calloutProps={{
                      directionalHint: DirectionalHint.bottomCenter,
                    }}
                    target="#targetButtonExcl"
                    isWide={true}
                    hasCloseButton={true}
                    closeButtonAriaLabel={
                     "Close"
                    }
                    onDismiss={(()=>{setTeachingBubbleOpen(false)})}
                    headline=""
                  >
                    {tooltipText} </TeachingBubble>
                )} */}
                    </div>
        <Icon iconName='Cancel' className='cancel-icon' onClick={handleClossButton} />

      </div> 

}
{message && <p className='message'>{message}</p>}
<div className='child_content'>
        {children}
      </div> 
  </div>

    
    { showButtons && <div className='btn_box'>
        <PrimaryButton className='popup_btn primary' onClick={handleYesClick}>{buttonOneText}</PrimaryButton>
        <PrimaryButton className='popup_btn close ' onClick={handleNoClick}>{buttonTwoText}</PrimaryButton>
        
      </div>
}
    </div>
    </div>
    </div>
    </>
  );
};
MiniModals.defaultProps = {
    minHeight: "unset",
    minWidth: '470px',
    isPanel:false,
    showButtons:false,
    width:"auto",
    height:"unset",
    maxHeight:"450px",

  };
export default MiniModals;
