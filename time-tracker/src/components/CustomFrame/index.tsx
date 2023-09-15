const ipcRenderer =
  typeof window.require === "function"
    ? window.require("electron").ipcRenderer
    : false;
const CustomFrame = () => {
  return (
    <nav className="d-flex text-white justify-content-between align-items-center">
      <div className="left-nav">
        <span className="nav-link">&#x2630;</span>
      </div>
      <div className="right-nav">
        <span className="nav-link" onClick={() => ipcRenderer.send("minimizeWindow",{})}>&minus;</span>
        <span className="nav-link" onClick={() => ipcRenderer.send("closeWindow",{})}>&#10006;</span>
      </div>
    </nav>
  );
};

export default CustomFrame;
