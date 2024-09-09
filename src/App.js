import GoogleEmployeeDirectory from "./Components/SelectSource";
import "./App.css";
import ScrollToTop from "./Components/SelectSource/ScrollToTop";

function App() {
  return (
    <div className="App" id="top">
      <GoogleEmployeeDirectory />
      <ScrollToTop />
      {/* <a href="#top"  style={{display:"flex", justifyContent:"center", alignItems:"center",height:"30px",width:"30px",background:"rgb(0, 120, 212)",position:"fixed", bottom:"20px",right:"10px",borderRadius:"50%",textDecoration: "none"}}><Icon style={{color:"#fff"}} iconName="ChevronUpMed" /></a> */}
    </div>
  );
}
export default App;
