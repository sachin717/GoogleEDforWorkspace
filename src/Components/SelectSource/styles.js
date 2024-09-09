import { css } from "styled-components";

const style = () => css`
  button[role="tab"]{
    min-width:100px !important;
    // background-color:rgb(0, 120, 212, .4);
  }
  button[role="tab"]:hover{
    background-color:rgb(0, 120, 212);
    color:#ffff;
  }
  .linkContent-177{
    background-color:rgb(0, 120, 212, .4);
  }
  .is-selected{
    color:rgb(0, 120, 212);
  }
  .fqhdpT .iconsDiv i{
    color:rgb(0, 120, 212);
  }
  flex: 1;
  .edp {
    height: 100%;
    background-color: #fff;
    overflow: auto;
  }
  .labelSpanStyles {
    margin-bottom: 2%;
    width: 31%;
    float: left;
    margin-right: 2%;
  }
  .labelSpanStyles label {
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    padding: 0px;
    color: #333;
  }
  .labelSpanStyles span {
    display: flex;
   
  }
  .empManagerStyle {
    width: 100%;
    margin-top: 10px;
    // border-top: 1px solid #cdcdcd;
  }
  .empManagerStyle h4 {
    font-size: 16px;
    padding-bottom: 1%;
    border-bottom: 1px solid #ddd;
    margin: 0px 0px 8px 0px;
    color: #333;
  }
  .labelSpanStylesTemp {
    margin-bottom: 1%;
    width: 31%;
    float: left;
    margin-right: 2%;
  }
  .managerNameDet:nth-child(2) {
    font-size: 11px !important;
  }
  .empManagerLogonew {
    margin-right: -4%;
    max-width: 50px;
    float: left;
  }
 
  .RichEditorBlk {
    width: 100%;
  }
  .commBarandSearchStyles {
    display: flex;
    margin-bottom: 4px;
    align-items: center;
  }
  .searchlist {
    display: flex;
    width: 99%;
    //  margin-top: 30px;
    justify-content: space-around;
    margin: 0px;
    padding: 10px;
  }
  .mainInput {
    display: flex;
    justify-content: space-between;
    // margin: 1% 0%;
    position: relative;
    width: 100%;
  }
  
  .mainInput i {
    position: absolute;
    left: 0.5%;
    top: 31%;
    color: var(--lightdarkBGGray);
  }
  
  .InputClass>input:focus-visible {
    border-color: var(--lightdarkBGGray);
  }
  
  .InputClass {
    position: relative;
    justify-content: center;
    width: 91%;
    margin: 0px 22% 0px 26%;
  }
  
  .InputClass i {
    position: absolute;
    left: 1%;
    top: 28%;
  }
  .inputField {
    width: 100%;
    font-size: 14px;
    font-weight: 400;
    box-shadow: none;
    margin: 0px;
    padding: 1px 0px 1px 25px;
    box-sizing: border-box;
    color: rgb(50, 49, 48);
    background-color: rgb(255, 255, 255);
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;
    border-radius: 2px;
    border: 1px solid rgb(96, 94, 92);
    height: 32px;
    min-width: 25%;
  }
  .box1 {
    display: flex;
    flex-direction: column;
    // width: fit-content;
    justify-content: flex-start;
    cursor: pointer;
  
  }
  
  .box3 {
    width: 100%;
  display: flex;
    margin-top: 0px;
  }
  .gensetng {
    // color: var(--lightdarkColor);
    color: #333;
    // background-color: var(--lightdarkBGGray);
    background-color: #f8f8f8;
    height: auto;
    display: inline-block;
    margin: 5px;
    padding: 0px;
    list-style-type: none;
    width: 100%;
    max-width: 100%;
  
  
    //  float: left;
  }
  .headingTitle {
    padding: 0px 0px 5px 10px;
    border-bottom: 1px solid #cacaca;
    margin: 10px 0px 0px 0px;
    // color: var(--lightdarkColor);
    color: var(--lightdarkBGGray);
  }
  .mainadvanceclass,
.mainadvanceclass2 {
  cursor: pointer;
  padding: 10px 5px;
}

.mainadvanceclass2 li {
  cursor: pointer;
  padding: 5px;
}

.mainadvanceclass2 .labelandicon span {
  font-size: 16px;
}

.labelandicon {
  padding: 12px 0px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
}
.settingBlock:last-child {
  border-bottom: 0px;
  color: #333;
}

.settingBlock label:first-child,
.settingBlockST label:first-child {
  font-weight: 500;
  color: #333;
}
.settingBlock,
.settingBlockST {
  padding: 1% 0% !important;
  border-bottom: 1px solid #dadada;
}
.settingBlock,
.settingBlockST {
  padding-bottom: 2%;
}
.excludeTable,
.usersTable,
.customTable {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
  margin: 1% 0%;
  white-space: nowrap;
}

.excludeTable th,
.usersTable th,
.customTable th {
  font-size: 14px;
  font-weight: 500;
  color: "[theme:themePrimary]";
  text-align: left;
  border-right: 1px solid #ddd;
  padding: 8px;
  border-bottom: 1px solid #ddd;
  background-color: "[theme:neutralLight]";
}

.excludeTable td,
.usersTable td,
.customTable td {
  font-size: 14px;
  font-weight: 400;
  color: #333;
  border-right: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.customTable tr td:first-child {
  width: 12%;
}

.usersTable tr td:first-child {
  width: 50px;
}
.selectStyles .dropdown-container {
    border: 1px solid #ddd;
  }
  .selectStyles {
    // width: 130px;
    // width: 190px !important;
    margin-right: 1%;
  }
  .searchBoxStyles,
  .selectStyles {
    // min-width: 165px;
    opacity: 1;
  }
.settingViewLabel {
  padding: 0px;
}

.mini_popup_modal {
   
  position: relative;
   display: flex;
   align-items: center;
   justify-content: center;
    // padding: 15px;
    
    
    background-color: white;
    border: 1px solid #ccc;

   
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
    transition: 0.3s all;
    
  }
.overlay {
      background-color: rgba(0, 0, 0, .7);
    display: grid;
    height: 100vh;
    left: 0;
    place-items: center;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
}

 .heading{
    color: #fff !important;
    font-size: 18px !important;
    font-weight: 400 !important;
    margin-left: 10px !important;
    
 }
 .popup_head{

    width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
//   position: absolute;
//   left: 0;
//   top: 0;
  padding: 10px 0;
  color: #fff !important;
  background-color: rgb(0, 120, 212) !important;
 }
 .ms-Panel-contentInner{
  position: relative;
 }
  .absolute{
  position: absolute;
  bottom: 0;
  right: 0;
  }
//   .mini_popup_modal.visible {
//     display: block;
//   }
  .message{
    text-align: center !important;
    font-size: 15px !important;
    font-weight: 400 !important;
  }
  .child_content{
    padding: 15px;
    overflow-y:auto !important; 
   
  }
 
  .btn_box{
    display: flex;
    justify-content: center;
    gap: 10px;
    
    
  }
 
  .cancel-icon{
   color:#fff !important;
   font-size: 20px !important;
    cursor: pointer;
    margin-right: 10px !important;
    
  }

  .popup_btn {
   
    font-size: 18px;
    outline: none;
    font-weight: 600;
    padding: 10px 30px;
    background-color:  var(--lightdarkBG);
    border: 1px solid gray;
   
    
    cursor: pointer;
    background-color: transparent;
  }
  .popup_head h3{
    margin: 0;
  }
  .primary{
     background-color:  var(--lightdarkBG)
     ;
     color:#fff;

  }
  .primary:hover{
    background-color:var(--lightdarkHoverBG) !important;
   
  }
  .close{
    color: black !important;
  }
  .close:hover{
    color: black !important;
    background-color: transparent !important;
  }
  .close{
    color: black !important;
  }
 
  .toptip{
    color:#fff !important;
    height: 22px !important;
  }
  .toptip:hover{
    background-color: transparent;
  }
 .popInnerBox{
     position:absolute !important;
     width:100% !important;
     background:#fff !important;
 }
.excludeTable tr:last-child td,
.usersTable tr:last-child td {
  border-bottom: 0px;
}
.labelandicon span {
  margin-left: 5px;
  font-family: "Segoe UI WestEuropean", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif !important;

}
  .narrowList {
    margin: -10px 0px;
  }
  .box4 {
    width: 30%;
    display: flex;
    justify-content: end;
    margin-top: -14px;
  }
  .box2 {
    display: flex;
    // margin:10px;
    // padding:10px;
  }
  .inputField:focus-visible {
    border-color: '[theme:themePrimary]';
    outline: none;
  }
  .Icons {
    display: flex;
  }
  .box3 {
    width: 100%;
  display: flex;
    margin-top: 0px;
  }
  .commBarandSearchStyles>div:last-child {
    margin-left: auto;
  }
  .DBPPStyle{
    list-style: none;
    cursor: pointer;
    padding: 2% 0%;
  }
  .DBPPStyleUL{
    padding-left: 10px;
    margin: 0px;
    }
  .editorBlockStyles {
    width: 100%;
    display: flex;
    flex-flow: column;
    position: inherit;
  }
  .managerNameDet:first-child {
    font-size: 13px;
    font-weight: 500;
    padding-bottom: 3px;
    display: flex;
    align-items: center;
    height: 16px;
  }
  .managerNameDet {
    font-size: 11px;
    line-height: 14px;
    font-weight: 400;
    padding-bottom: 1px;
    color: #333;
    text-align: left;
  }
  .labelSpanStylesTemp label {
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    padding: 0px;
    color: #333;
  }
  .labelSpanStylesTemp a {
    color: #333;
    text-decoration: none;
  }
  .labelSpanStyles a {
    color: #333;
    text-decoration: none;
  }
  
  .labelSpanStylesTemp span a {
    color: #333 !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
  .empDetailIcon {
    padding: 0px 15px;
    color: "[theme:themePrimary]";
    text-decoration: none;
    font-size: 20px;
    cursor: pointer;
  }
  .custom-row {
    height: 100vh;
    align-items: center;
    justify-content: center;
    background-color: #dfdfdf;
  }
  .labelSpanStylesTemp label {
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    padding: 0px;
    color: #333;
  }
  .empMoreDetailsBlock {
    flex-wrap: wrap;
    margin-top: 1%;
    border-bottom: 1px solid #ddd;
    display: flex;
  }
  .edp .tileView .makeCenterStyles {
    width: 65%;
  }
  .personallabelSpanStyles {
    margin-top: 1%;
   //padding-bottom: 8px;
    color: #333;
    display: grid;
    grid-template-columns: 1fr 3fr;
  }
  .personallabelSpanStyles span {
    max-width: 84%;
  }
  .personallabelSpanStyles span {
    max-width: 75%;
  }
  .LeftalignPc{
    display: flex;
    width: fit-content;
  }
  .personallabelSpanStyles span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    max-width: 100%;
    
  }
  .personallabelSpanStyles label {
    // width: auto;
    font-size: 14px;
    font-weight: 500;
    padding: 0px;
  }
  .searchFiltersDiv {
    float: left;
    flex-grow: 2;
    flex-flow: wrap;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 5px;
    margin-bottom:20px;
  
  }
  .searchFiltersDiv>div {
    position: relative;
   
  }
  .filterDiv {
    width: 100%;
    // margin-bottom: 2%;
    overflow: hidden;
  }
  .filterDiv .ms-OverflowSet-item .ms-CommandBarItem-link :hover {
    background-color: "[theme:themePrimary]";
    color: #fff;
  }
  .filterDiv .ms-CommandBar-overflowButton,
  .filterDiv .ms-OverflowSet-item .ms-CommandBarItem-link:hover {
    color: #fff !important;
  }
  .filterDiv .ms-OverflowSet-item .ms-CommandBarItem-link,
  .filterDiv .ms-CommandBar-overflowButton {
    border: 0px !important;
    background: inherit;
    color: #333;
    padding: 0px 0px !important;
  }
  .activeColor {
    background-color: "[theme:themePrimary]" !important;
    color: #fff !important;
  }
  .closeiconprofile {
    position: absolute;
    right: 10px;
    top: 0px;
    cursor: pointer;
  }
  .empDetailPanel {
    width: 100%;
    padding: 2% 3% 8px 3%;
    box-sizing: border-box;
    // height: 110vh;
  }
  .empMainDetailStyles .empLogo {
    // margin-right: 2%;
    max-width: 110px;
  }
  .empDetailIconView {
    width: 100%;
    padding-bottom: 1%;
    gap: 5px;
    border-bottom: 1px solid #ddd;
    position: relative;
    display:flex;
  }
  .empTitle {
    font-size: 16px;
    font-weight: 500;
    padding-bottom: 2px;
    color: #333;
    height: 22px;
    display: flex;
    align-items: center;
    gap:5px;
  }
  .empMainDetail {
    font-size: 12px;
    font-weight: 400;
    padding-bottom: 1px;
    color: #333
  }
  .empLogo {
    position: relative;
  }
  .empLogo img {
    max-width: 100%;
    // object-fit: fill;
  }
  .empMainDetailStyles {
    // width: 97%;
    margin-bottom: 2%;
    // gap: 5px;
    display: flex;
    justify-content: space-between;
  }
  .activeColor i {

    color: #fff !important;
  }
  .spinnerLoadStyle {
  position:absolute;
  transform:translate(-50%,-30%);
  top:30%;
  left:50%;

    margin-top: 6%;
  }
  .activeColor :hover {
    background-color: #f4f4f4;
   
  }
  
.clpbrdspan {
  display: "flex";
  gap: 18px;
  align-items: "center";
  cursor: pointer;
}
  .edp .searchFiltersDiv {
    float: left;
    flex-grow: 2;
    flex-flow: wrap;
    display: flex;
    gap: 5px;
  }
  .searchBoxStyles {
    width: 100% !important;
    border: 0px;
    // margin-right: 1%;
    float: left;
    border-bottom: 1px solid #ddd;
    background: inherit;
    color:#333;
    max-width:150px;
  }
  .iconsFilterDiv {
    width: 100%;
    margin-bottom: 1%;
  }
  .iconsFilterDiv>div {
    flex-flow: row nowrap;
  }
  .container {
    max-width: 100%;
    margin: 0px auto;
    height: auto;
    background-color: "[theme:themePrimary]";
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
  }
  .mainDiv {
    max-width: 100%;
    position: relative;
    min-height:60vh;
  }
  .container .Card {
    width: 20%;
    float: left;
    background: #ddd;
    text-align: center;
  }
  .gridDiv:not(:last-child),
.edp .tileView:not(:last-child) {
  margin-bottom: 0 !important;
}

.edp .tileView:not(:first-child) {
  margin-top: 0 !important;
}
  .empDetailsView {
    width: 100%;
  }
  #ViewDiv {
    display: block !important;
    width: 100%;
    page-break-inside: avoid !important;
    position: relative !important;
    overflow-x: visible !important;
    page-break-before: auto;
    page-break-after: auto;
  
  }
  .titleStyles {
    font-size: 13px;
    font-weight: 400;
    height: auto;
    line-height: 17px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // padding: 0px 0px 2px;
  }
  .viewIconsStyle {
    font-size: 26px;
    font-weight: 600;
    color: rgb(0, 112, 220);
    margin-right: 8px;
    cursor: pointer;
  }

  .viewIconsStyleActive {
    font-size: 26px;
    font-weight: 600;
    color: rgb(0, 112, 220);
    margin-right: 8px;
    cursor: pointer;
    border-top: 1px solid "[theme:themePrimary]";
  }

  .viewIconsStyleT {
    font-size: 18px;
    font-weight: 600;
    color: rgb(0, 112, 220);
    margin-right: 8px;
    cursor: pointer;
    padding-top: 3px;
  }

  .viewIconsStyleActiveT {
    font-size: 18px;
    font-weight: 600;
    color: rgb(0, 112, 220);
    margin-right: 8px;
    cursor: pointer;
    border-bottom: 2px solid "[theme:themePrimary]";
    padding-top: 3px;
  }
  .titleStylesJT {
    font-size: 13px;
    font-weight: 400;
    height: auto;
    line-height: 17px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-bottom: 2px;
    // padding: 0px 0px 2px;
    // color: #333;
  }
  .titleStylesCF {
    font-size: 13px;
    font-weight: 400;
    height: auto;
    line-height: 17px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    min-width: 20%;
    // padding: 0px 0px 2px;
    // color: #333;
  }
  .titleStylesDept {
    font-size: 13px;
    font-weight: 400;
    height: auto;
    line-height: 17px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-bottom: 2px;
    // padding: 0px 0px 2px;
    // color: #333;
  }
  .makeCenterStyles {
    width: 69%;
    margin: 0px auto;
    display: flex;
    justify-content: center;
  }
  .iconsDiv {
  display:flex;
  justify-content:end;
    width: auto;
    margin: 0px;
    gap: 10px;
   
  }
  .ms-Persona-primaryText,
  .ms-Persona-secondaryText {
    line-height: 20px;
  }

  .iconsDiv i {
    font-size: 22px;
    font-weight: 400;
    color: "[theme:themePrimary]";
    // margin-right: 8px;
    cursor: pointer;
    margin-top: 4px;
    // padding-bottom: 3px;
    height: 24px;
  }

  .iconsDivT {
    font-size: 17px;
    font-weight: 400;
    color: "[theme:themePrimary]";
    // margin-right: 8px;
    cursor: pointer;
    margin-top: 4px;
    // padding-bottom: 3px;
    height: 24px;
  }

  .iconsDivT:active {
    font-size: 22px;
    font-weight: 400;
    color: "[theme:themePrimary]";
    // margin-right: 8px;
    cursor: pointer;
    margin-top: 4px;
    // padding-bottom: 3px;
    height: 24px;
  }

  .iconsDiv i :active {
    font-size: 22px;
    font-weight: 400;
    color: "[theme:themePrimary]";
    // margin-right: 8px;
    cursor: pointer;
    margin-top: 4px;
    // padding-bottom: 3px;
    height: 24px;
  }
  .makeCenterStyles div {
    flex-direction: column;
  }
  .titleStylesLoc {
    font-size: 13px;
    font-weight: 400;
    height: auto;
    line-height: 17px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 2px;
    // padding: 0px 0px 2px;
    color: #3a3a3a;
  }
  .titleStyles a {
    color: #333;
    text-decoration: none;
  }
  .listView {
    max-width: 100%;
    position: relative;
  }
  .empView {
    float: left;
    width: 15%;
    text-align: center;
    padding-bottom: 5px;
    margin-bottom: 1%;
    cursor: pointer;
    border: 1px solid #ddd;
    padding-top: 0%;
    position: relative;
    overflow: hidden;
  }
  .tileView .empView {
    margin-bottom: 0%;
  }
  .tileView .nameStyles {
    padding: 5px 5px 0px 5px;
    font-size: 13px;
  }
  .tileView {
    width: 100%;
    float: left;
    margin-top: 1%;
    margin-bottom: 5%;
  }

  .tileView .makeCenterStyles {
    width: 66%;
    margin: 5px auto 0px;
    display: flex;
    justify-content: center;

  }
  .listStylesClass {
    max-height: 700px;
    max-width: 100%;
  }
  .tileView .makeCenterStyles div {
    flex-direction: column;
  }
  .row {  
    background-color: #fff;
    padding: 15px;
    height: 100%;
    min-height: 700px;
    margin: 0;
  }
  .titleStylesLoc i {
    vertical-align: middle;
    padding-right: 5px;
    color: "[theme:themePrimary]";
    font-size: 12px;
    padding-bottom: 2px;
  }
  .nameStyles {
    font-weight: 600;
    font-size: 15px;
    color: #000;
    padding: 10px 5px 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .docCardStyle {
    padding: 10px;
    width: 8%;
    text-align: center;
    display: inline-block;
    color: #000;
    border: none;
    flex: 0 1 0;
    min-width: 170px;
    border: 1px solid #ddd;
    margin: 0px 12px 12px 0px;
    position: relative;
    background: #fff;
    overflow: hidden;
    padding-bottom: 45px;
  }
  .source-container {
    background-color: #fff;
    display: flex;
    flex: 1,
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    min-height: 200px;
    box-shadow: 0 1px 1px 0 rgba(10,22,70,.1), 0 0 1px 0 rgba(10,22,70,.06);
    border-radius: 4px;
    cursor: pointer;
    .content-container {
      flex: 2;
      flex-direction: column;
      display: flex;
      justify-content: center;
      .title {
        font-size: 18px;
        font-weight: 600;
      }
      .content {
        font-size: 16px;
      }
    }
  
    .icon-container {
      flex: 1;
      flex-direction: row;
      display: flex;
      align-items: center;
      justify-content: center;
    }
      .commands{
      margin-top:0;
      }
      .ms-Panel-headerText{
      color:white;
      }
  }
`;

export { style };
