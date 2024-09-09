import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../Edp.scss";
import EdStyles from "../../SCSS/Ed.module.scss";
import { Icon, Label } from "@fluentui/react";
import { PrimaryButton } from '@fluentui/react';
import { AnniTemplate } from '../../Helpers/EmailTemplates';
import { convertToBase64, updateSettingData } from '../../Helpers/HelperFunctions';
import { useLanguage } from '../../../Language/LanguageContext';

const AnniversaryTemplate = ({appSettings,setAppSettings,SweetAlertEmailTemp}) => {
  const {translation}=useLanguage();
  const [editorAnniValue, setEditorAnniValue] = useState(AnniTemplate);
  const [imagePreviewAnni, setimagePreviewAnniAnni] = useState<any>('');
  const quillRefAnni = useRef(null);
  const fileInputRefAnni = useRef(null);
  useEffect(()=>{

    if(appSettings?.AnniversaryEmailTemplate){
      setEditorAnniValue(appSettings?.AnniversaryEmailTemplate);
    }else{
      setEditorAnniValue(AnniTemplate);
    }
    if(appSettings?.AnnivTempImage){

      setimagePreviewAnniAnni(appSettings?.AnnivTempImage)
    }
},[])

  const handleChangeAnni = (value) => {
    setEditorAnniValue(value);
    console.log(editorAnniValue)
  };

  const insertPlaceholderAnni = (placeholder) => {
    if (quillRefAnni.current) {
      const quill = quillRefAnni.current.getEditor();
      const cursorPosition = quill.getSelection()?.index || 0;
      quill.insertText(cursorPosition, placeholder);
    }
  };

  const handleImageUploadAnni = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setimagePreviewAnniAnni(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSaveAnni(){
    
            const response = await fetch(imagePreviewAnni);
            const imgBlob = await response.blob();
            const base64Image = await convertToBase64(imgBlob);
            updateSettingData({...appSettings,AnniversaryEmailTemplate:editorAnniValue,AnnivTempImage:base64Image})
            setAppSettings({...appSettings,AnniversaryEmailTemplate:editorAnniValue,AnnivTempImage:base64Image})
            SweetAlertEmailTemp("success",translation.SettingSaved)
   
   
  }


  return (
    <div id="emailTemplate">
         <Icon
            iconName="save"
            onClick={handleSaveAnni}
            style={{
              position: "fixed",
              right: "60px",
              top: "16px",
              color: "white",
              cursor: "pointer",
            }}
          />
      {imagePreviewAnni && (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <img
            src={imagePreviewAnni}
            alt="Uploaded Preview"
            style={{ maxWidth: '180', maxHeight: '100px', display: 'block', margin: '0 auto' }}
          />
        </div>
      )}
      <div style={{ margin: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Label>Upload Image</Label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRefAnni}
          onChange={handleImageUploadAnni}
          style={{ display: 'none' }}
        />
        <PrimaryButton text='Upload Image' onClick={() => fileInputRefAnni.current.click()} style={{background:"#fff", color:"#000",border:"1px solid #000"}} />
       
      </div>
      <ReactQuill
        ref={quillRefAnni}
        value={editorAnniValue}
        onChange={handleChangeAnni}
        modules={editorModules}
        formats={editorFormats}
      
      />
      <div style={{ marginTop: '20px' }}>
        <Label>Placeholders</Label>
        <div className={EdStyles.Qillplaceholdes}>
          <button className={EdStyles.QuillPlaceholderBtn} onClick={() => insertPlaceholderAnni('[FirstName]')}>First Name</button>
          <button className={EdStyles.QuillPlaceholderBtn} onClick={() => insertPlaceholderAnni('[DOB]')}>DOB</button>
          <button className={EdStyles.QuillPlaceholderBtn} onClick={() => insertPlaceholderAnni('[DOJ]')}>DOJ</button>
          <button className={EdStyles.QuillPlaceholderBtn} onClick={() => insertPlaceholderAnni('[Department]')}>Department</button>
          <button className={EdStyles.QuillPlaceholderBtn} onClick={() => insertPlaceholderAnni('[JobTitle]')}>Job Title</button>
          <button className={EdStyles.QuillPlaceholderBtn} onClick={() => insertPlaceholderAnni('[DisplayName]')}>Display Name</button>
        </div>
      </div>
    </div>
  );
};

const editorModules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font':[] }],


    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline'],
    ['link', 'image'],
    [{ 'align': [] }],
    ['clean'],
  ],
};

const editorFormats = [
  'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'link', 'image', 'align', 'clean'
];

export default AnniversaryTemplate;
