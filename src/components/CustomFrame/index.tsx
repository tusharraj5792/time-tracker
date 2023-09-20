import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { removeTokens } from "../../utils/utils";

const ipcRenderer =
  typeof window.require === 'function' ? window.require('electron').ipcRenderer : false;
  const CustomFrame = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const[shortName,setShortName]=useState("");
  const [fullName, setFullName] = useState("")
  const [isDropdown, setIsDropdown] = useState<boolean>(false)

useEffect(() => {
  if(location.state)
  {
    
    if(location.state.firstName && location.state.lastName)
    {
      setShortName(location.state.firstName.slice(0,1)+location.state.lastName.slice(0,1))
      setFullName(location.state.firstName+" " +location.state.lastName)
    }else
    {
      setShortName(location.state.firstName.slice(0,2))
      setFullName(location.state.firstName)
    }
  }else{
    setShortName("")
    setFullName('');
  }
}, [location.state])
const handleOpenDropdown = ()=>{
  setIsDropdown(!isDropdown);
}
const Logout = ()=>{
  removeTokens()
  setIsDropdown(false);
  navigate('/login');

}
  return (
    <nav className='d-flex text-white justify-content-between align-items-center p-3 border-bottom pe-0'>
      <div className='left-nav'>
        <span>
          <img
            src='./small-logo.ico'
            alt='Logo'
            className='img-fluid d-block mx-auto'
            style={{ width: '20px' }}
          />
        </span>
      </div>
      <div className='right-nav'>
       {fullName !=="" && (<span className="nav-link">{fullName}</span>)}
        {shortName !=="" && <span className="userProfile nav-link" onClick={()=>handleOpenDropdown()}>{shortName}</span>}
        <span className='nav-link' onClick={() => ipcRenderer.send('minimizeWindow', {})}>
          <i className='fas fa-minus'></i>
        </span>
        <span className='nav-link' onClick={() => ipcRenderer.send('closeWindow', {})}>
          <i className='fas fa-times'></i>
        </span>
        {isDropdown && (
          <div className="dropdown" onClick={()=>Logout()}>
            <ul>
              <li>Log Out</li>
            </ul>
          </div>
        )}
      </div>
      
    </nav>
  );
};

export default CustomFrame;
