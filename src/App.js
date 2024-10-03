import GoogleEmployeeDirectory from "./Components/SelectSource";
import ScrollToTop from "./Components/SelectSource/ScrollToTop";
import "./App.css";

function App() {
  return (
    <div className="App" id="top">
      <GoogleEmployeeDirectory />
      <ScrollToTop />
    </div>
  );
}
export default App;
