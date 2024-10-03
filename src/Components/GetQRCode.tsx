import { IconButton, Modal } from "@fluentui/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import QRCode from "react-qr-code";

const GetQRCode = ({ isOpen, onDismiss, user }) => {

  const data = {
    NAME: user.name ?? "",
    department: user.department ?? "",
    email: user.email ?? "",
    job: user.job ?? "",
    mobile: user.mobile ?? "",
    workphone: user.workphone ?? "",
  };
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
  
  const qrData = JSON.stringify(data);
  return (
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
            <IconButton iconProps={{ iconName: "Share" }} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GetQRCode;
