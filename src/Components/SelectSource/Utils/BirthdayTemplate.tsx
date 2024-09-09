import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../Edp.scss";
import EdStyles from "../../SCSS/Ed.module.scss";
import { Icon, Label } from "@fluentui/react";
import { PrimaryButton } from '@fluentui/react';
import { BirthTemplate } from '../../Helpers/EmailTemplates';
import { convertToBase64, updateSettingData } from '../../Helpers/HelperFunctions';
import { useSttings } from '../store';
import { useLanguage } from '../../../Language/LanguageContext';


const BirthdayTemplate = ({setAppSettings,appSettings,SweetAlertEmailTemp}) => {
const {translation}=useLanguage();
  const [editorValue, setEditorValue] = useState(BirthTemplate);
  const [imagePreview, setImagePreview] = useState<any>('');

  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  useEffect(()=>{

       if(appSettings?.BirthdayEmailTemplate){
          setEditorValue(appSettings?.BirthdayEmailTemplate);
       }else{
        setEditorValue(BirthTemplate);
       }
       if(appSettings?.BirthTempImage){

         setImagePreview(appSettings?.BirthTempImage)
       }
  },[])

  const handleChange = (value) => {
    setEditorValue(value);
    console.log(editorValue)
  };

  const insertPlaceholder = (placeholder) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const cursorPosition = quill.getSelection()?.index || 0;
      quill.insertText(cursorPosition, placeholder);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  async function handleSaveBirth(){
       
        if(Object.keys(appSettings)?.length ){
          const response = await fetch(imagePreview);
          const imgBlob = await response.blob();
    
          const base64Image = await convertToBase64(imgBlob);
            updateSettingData({...appSettings,BirthdayEmailTemplate:editorValue,BirthTempImage:base64Image})
            setAppSettings({...appSettings,BirthdayEmailTemplate:editorValue,BirthTempImage:base64Image})
            SweetAlertEmailTemp("success",translation.SettingSaved)

        }
  
   
  }


  return (
    <div id="emailTemplate">
       <Icon
            iconName="save"
            onClick={handleSaveBirth}
            style={{
              position: "fixed",
              right: "60px",
              top: "16px",
              color: "white",
              cursor: "pointer",
            }}
          />
      {imagePreview && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src={imagePreview}
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
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <PrimaryButton text='Upload Image' onClick={() => fileInputRef.current.click()} style={{background:"#fff", color:"#000",border:"1px solid #000"}} />
       
      </div>
      <ReactQuill
        ref={quillRef}
        value={editorValue}
        onChange={handleChange}
        modules={editorModules}
        formats={editorFormats}
      
      />
      <div style={{ marginTop: '20px' }}>
        <Label>Placeholders</Label>
        <div className={EdStyles.Qillplaceholdes}>
          <button className={EdStyles.QuillPlaceholderBtn} onClick={() => insertPlaceholder('[FirstName]')}>First Name</button>
          <button className={EdStyles.QuillPlaceholderBtn} onClick={() => insertPlaceholder('[DOB]')}>DOB</button>
          <button className={EdStyles.QuillPlaceholderBtn} onClick={() => insertPlaceholder('[DOJ]')}>DOJ</button>
          <button className={EdStyles.QuillPlaceholderBtn} onClick={() => insertPlaceholder('[Department]')}>Department</button>
          <button className={EdStyles.QuillPlaceholderBtn} onClick={() => insertPlaceholder('[JobTitle]')}>Job Title</button>
          <button className={EdStyles.QuillPlaceholderBtn} onClick={() => insertPlaceholder('[DisplayName]')}>Display Name</button>
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

export default BirthdayTemplate;
