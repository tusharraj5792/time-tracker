const ipcRenderer =
  typeof window.require === 'function' ? window.require('electron').ipcRenderer : false;
const CustomFrame = () => {
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
        <span className='nav-link' onClick={() => ipcRenderer.send('minimizeWindow', {})}>
          <i className='fas fa-minus'></i>
        </span>
        <span className='nav-link' onClick={() => ipcRenderer.send('closeWindow', {})}>
          <i className='fas fa-times'></i>
        </span>
      </div>
    </nav>
  );
};

export default CustomFrame;
