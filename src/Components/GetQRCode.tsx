import { IconButton, Modal } from "@fluentui/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import UserSearchBox from "./SelectSource/UserSearchBox";
import { useFields } from "../context/store";
import { Icon, PrimaryButton } from "office-ui-fabric-react";

const GetQRCode = ({ isOpen, onDismiss, user }) => {
  const {allUsers}=useFields()
 const [showShareModal,setShowShareModal]=useState(false);
 const [dataToShare,setDataToShare]=useState<any>({});
  const data = {
    NAME: user.name ?? "",
    department: user.department ?? "",
    email: user.email ?? "",
    job: user.job ?? "",
    mobile: user.mobile ?? "",
    workphone: user.workphone ?? "",
  };
  function handleShareQr(){
 setShowShareModal(true)
  }
  const qrRef:any = useRef();
  const downloadQRCode = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    
    // Create a new Blob with the SVG data
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
  
    const img = new Image();
    img.onload = () => {
      // Set canvas size to match SVG dimensions
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
  
      // Download the canvas as PNG
      const pngFile = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngFile;
      a.download = 'qr-code.png';
      a.click();
    };
    
    img.src = url;
  };
  function transformUserDataToFomat(users) {
    return users?.map((user) => ({
      id: user?.id,
      image: user?.image,
      initials: user?.initials,
      name: user?.name,
      job: user?.job,
      email: user?.email,
      department: user?.department,
      dob: user?.DOB,
      doj: user?.DOJ,
      location: user?.location,
    }));
  }
  function handleSelectedUser(data){
     console.log(data)
     setDataToShare(data);
  }
  const qrData = JSON.stringify(data);
  return (
    <>
    <Modal isOpen={isOpen} onDismiss={() => onDismiss(false)} isBlocking>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <IconButton
            style={{
              cursor: "pointer",
              color: "#000",
            }}
            iconProps={{ iconName: "Cancel" }}
            ariaLabel="Close popup modal"
            onClick={() => onDismiss(false)}
          />
        </div>
        <div
          style={{
            padding: "30px 50px",
            textAlign: "center",
          }}
        >
          <div ref={qrRef}>
          <QRCode size={220} value={qrData} />
          </div>
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: "500" }}>
              {user.name}
            </div>
            <div style={{ fontSize: "12px" }}>
              {user.job} | {user.department}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              marginTop: "10px",
            }}
          >
            <IconButton iconProps={{ iconName: "Download" }} onClick={()=>downloadQRCode()} />
            <IconButton iconProps={{ iconName: "Share" }} onClick={handleShareQr} />
          </div>
        </div>
      </div>
    </Modal>
    <Modal isOpen={showShareModal} onDismiss={() => setShowShareModal(false)} isBlocking>
      <div style={{padding:"25px", minHeight:"120px" ,display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",gap:"15px"}}>
        <Icon 
           style={{
            cursor: "pointer",
            color: "#000",
            position:"absolute",
            right:"5px",
            top:"5px"
          }}
          iconName={"Cancel"}
         
          onClick={() => setShowShareModal(false)}
          />

      <UserSearchBox  width={250} onSelect={handleSelectedUser} placeholder="Search user" options={transformUserDataToFomat(allUsers)} />
      <a  style={{textDecoration:"none",color:"white"}}
      href={`mailto:${user?.email}?subject=Contact%20Details%20of%20${encodeURIComponent(user.name)}%20&body=Contact%20details%20of%20${encodeURIComponent(user.name)}%0A%0A` + 
      `ID: ${dataToShare.id}%0A` + 
      `Name: ${dataToShare.name}%0A` + 
      `Job: ${dataToShare.job}%0A` + 
      `Email: ${dataToShare.email}%0A` + 
      `Department: ${dataToShare.department}%0A` + 
      `DOB: ${dataToShare.dob}%0A` + 
      `DOJ: ${dataToShare.doj}%0A` + 
      `Location: ${dataToShare.location}`}
>
      
      
      <PrimaryButton>
  
    
    Share
</PrimaryButton>
  </a>

      </div>
    </Modal>
    </>
  );
};

export default GetQRCode;
