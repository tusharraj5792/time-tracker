import { useState, useEffect, useRef } from 'react';
import { decryptData, getDay, secToMin } from '../../utils/utils';
import ScreenshotWindow from '../../components/screenshotWindow';
import ScreenshotCaptured from '../../components/screenshotCaptured';
import { SelectTaskPage } from '../../components/selectTaskPage';
import { ApiService } from '../../utils/api.services';

const ipcRenderer =
  typeof window.require === 'function' ? window.require('electron').ipcRenderer : false;
let isDeletedCaptureImage = false;
const Home = () => {
  const ScreenshotWindowRef = useRef<any>(null);
  const SelectTaskWindowRef = useRef<any>(null);
  const [seconds, setSeconds] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [showScreenshotCapturedWindow, setShowScreenshotCapturedWindow] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState('');
  const [previousImage, setPreviousImage] = useState('');
  const [isScreenshotDeleted, setIsScreenshotDeleted] = useState(false);
  const screenshotCaptureInterval: any = useRef(null);
  const timeChangeInterval: any = useRef(null);
  const [allProjects, setAllProjects] = useState([]);
  const [isProjectSelected, setIsProjectSelected] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<any>();
  const [projectDetails, setProjectDetails] = useState<{
    projectName: string;
    id: number;
  }>({ projectName: '', id: 0 });
  const [showSelectTaskWindow, setShowSelectTaskWindow] = useState<boolean>(true);
  const [taskDetails, setTaskDetails] = useState<{
    taskName: string;
    taskId: number;
  }>({
    taskName: '',
    taskId: 0,
  });
  const userData = decryptData('userData');
  const inputRef = useRef(null);

  useEffect(() => {
    isDeletedCaptureImage = isScreenshotDeleted;
  }, [isScreenshotDeleted]);

  const handleCloseSelectTaskWindow = () => {
    SelectTaskWindowRef?.current?.closeWindow();
  };

  const handleChange = (e: any) => {
    if (e.target.checked) {
      setShowSelectTaskWindow(false);
    } else {
      setShowSelectTaskWindow(true);
      setSeconds(0);
      clearInterval(timeChangeInterval.current);
      timeChangeInterval.current = null;
      clearInterval(screenshotCaptureInterval.current);
      screenshotCaptureInterval.current = null;
      setProjectDetails({ projectName: '', id: 0 });
      setTaskDetails({ taskName: '', taskId: 0 });
      setIsProjectSelected(false);
      setProjectId(0);
      handleCloseSelectTaskWindow();
    }
  };

  const handleDelete = () => {
    setIsScreenshotDeleted(true);
    setCurrentImage(previousImage);
    setShowScreenshotCapturedWindow(false);
    ScreenshotWindowRef?.current?.closeWindow();
  };

  const handleSelectProject = (id: number) => {
    const projectName: any = allProjects.find((project: any) => project.id === id);

    if (id) {
      setIsProjectSelected(true);
      setProjectId(id);
      setProjectDetails({ projectName: projectName.name, id: id });
    }
  };

  const handleSelectTask = (task: { taskName: string; taskId: number }) => {
    if (task.taskId && task.taskName) {
      setShowSelectTaskWindow(false);
      setTaskDetails({ taskName: task.taskName, taskId: task.taskId });
      handleCloseSelectTaskWindow();
      timeChangeInterval.current = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
        setTotalTime((seconds) => seconds + 1);
      }, 1000);
      setTimeout(() => {
        const tooglebtn: any = document.getElementById('trackingToggle');
        tooglebtn.checked = true;
      }, 200);

      screenshotCaptureInterval.current = setInterval(() => {
        secToMin(seconds);
        setTotalTime((totalT) => totalT);
        setShowScreenshotCapturedWindow(true);
        ipcRenderer.send('screenshot:capture', { taskId: task.taskId, projectId });
      }, 300000);
    }
  };

  function dataURLtoFile(dataurl: any, filename: string) {
    const arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  useEffect(() => {
    ipcRenderer.on('screenshot:captured', (_e: any, data: any) => {
      const file = dataURLtoFile(data.image, `${new Date().toLocaleString()}_screenshot.png`);
      const formData = new FormData();
      formData.append('file', file);
      setCurrentImage(data.image);
      setTimeout(async () => {
        setPreviousImage(data.image);
        if (!isDeletedCaptureImage && navigator.onLine) {
          handleSaveScreenshots(formData, data);
        } else {
          const local: any = localStorage.getItem('screenshotUrl');
          const storedScreenshots: any = JSON.parse(local);
          const localStorageData = storedScreenshots === null ? [] : storedScreenshots;
          localStorageData.push({
            id: 1,
            time: new Date(),
            img: data.image,
          });
          localStorage.setItem('screenshotUrl', JSON.stringify(localStorageData));
        }
        handleCloseWindow();
      }, 5000);
    });
  }, []);

  useEffect(() => {
    if (navigator.onLine) {
      const localData: any = localStorage.getItem('screenshotUrl');
      const getLocalData: any = JSON.parse(localData);
      if (!getLocalData) {
        console.log('no data in local storage');
      } else {
        console.log('local storage  have data');
      }
    }
  }, [navigator.onLine]);

  const handleCloseWindow = () => {
    setShowScreenshotCapturedWindow(false);
    ScreenshotWindowRef?.current?.closeWindow();
    setIsScreenshotDeleted(false);
  };

  const handleSaveScreenshots = async (formData: any, data: any) => {
    await ApiService.postData(
      `api/tasktimetracker/screenshot?taskid=${data.taskId}`,
      formData,
      data.projectId,
    );
  };

  return (
    <>
      {showScreenshotCapturedWindow && (
        <ScreenshotWindow ref={ScreenshotWindowRef}>
          <ScreenshotCaptured
            screenshotUrl={currentImage}
            handleDelete={handleDelete}
            handleCloseWindow={handleCloseWindow}
          />
        </ScreenshotWindow>
      )}
      {showSelectTaskWindow ? (
        <SelectTaskPage
          isProjectSelected={isProjectSelected}
          projectId={projectId}
          setAllProjects={setAllProjects}
          handleSelectProject={handleSelectProject}
          allProjects={allProjects}
          handleSelectTask={handleSelectTask}
          setIsProjectSelected={setIsProjectSelected}
        />
      ) : (
        <div className='d-flex align-items-center justify-content-center main-wrapper'>
          <div className='tracker-main'>
            <div className='trcking-head border-bottom'>
              <div className='p-3'>
                <div>
                  <h2 className='fw-bold'>
                    {Object.keys(projectDetails).length && projectDetails?.projectName !== ''
                      ? projectDetails.projectName
                      : 'Please select the project name'}
                  </h2>
                  <p className='mb-0'>
                    {projectDetails && taskDetails.taskName
                      ? taskDetails.taskName
                      : 'Please select task'}
                  </p>
                </div>
              </div>
            </div>
            <div className='trcking-body p-3'>
              <div className='d-flex align-items-center justify-content-between'>
                <div>
                  <h2 className='fw-bold mb-0'>
                    <span className='me-2'>{secToMin(seconds)}</span>
                  </h2>
                  <small>Current Session</small>
                </div>
                <div className='form-check form-switch'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    role='switch'
                    id='trackingToggle'
                    ref={inputRef}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>

              <div className='d-flex align-items-center justify-content-between mt-3'>
                <p className='mb-0'>{secToMin(totalTime)}</p>
                <p className='mb-0'>
                  <span>{secToMin(totalTime)}</span> of <span>40 hrs</span>
                </p>
              </div>

              <div className='d-flex align-items-center justify-content-between mt-1 mb-3'>
                <p className='mb-0'>{`Today (${getDay[0]} UTC)`}</p>
                <p className='mb-0'>This week (UTC)</p>
              </div>

              <div className='mt-3'>
                <p>Latest Screen Capture</p>
                <div className='screenshot-box d-flex align-items-center justify-content-center'>
                  {currentImage ? (
                    <img src={currentImage} className='w-100 h-100' alt='img' loading='lazy' />
                  ) : (
                    <p className='mb-0'>No captures yet</p>
                  )}
                </div>
                <p className='mt-2 mb-0'>View Work Diary</p>
              </div>
            </div>
            <div className='trcking-foot border-top p-3'>
              <div className='d-flex align-items-center justify-content-between'>
                <p className='mb-0'>{`${userData.firstName} ${userData.lastName}`}</p>
                {/* <p className="mb-0">Messages</p> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
