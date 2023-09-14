import { useState, useEffect, useRef } from "react";
import { decryptData, getDay, secToMin } from "../utils/utils";
import ScreenshotWindow from "../screenshotWindow";
import ScreenshotCaptured from "../screenshotCaptured";

import axios from "axios";
import { rootUrl } from "../login";
import SelectTaskWindow from "../selectTaskWindow";
import { SelectTaskPage } from "../selectTaskPage";
const ipcRenderer =
  typeof window.require === "function"
    ? window.require("electron").ipcRenderer
    : false;
const Home = () => {
  const ScreenshotWindowRef = useRef<any>(null);
  const SelectTaskWindowRef = useRef<any>(null);
  const [seconds, setSeconds] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [showScreenshotCapturedWindow, setShowScreenshotCapturedWindow] =
    useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState("");
  const [previousImage, setPreviousImage] = useState("");
  const [isScreenshotDeleted, setIsScreenshotDeleted] = useState(false);
  const screenshotCaptureInterval: any = useRef(null);
  const timeChangeInterval: any = useRef(null);

  const handleChange = (e: any) => {
    if (e.target.checked) {
      timeChangeInterval.current = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
        setTotalTime((seconds) => seconds + 1);
      }, 1000);

      screenshotCaptureInterval.current = setInterval(() => {
        secToMin(seconds);
        setTotalTime((totalT) => totalT);
        setShowScreenshotCapturedWindow(true);
        ipcRenderer.send("screenshot:capture", {});
      }, 15000);
    } else {
      setSeconds(0);
      clearInterval(timeChangeInterval.current);
      timeChangeInterval.current = null;
      clearInterval(screenshotCaptureInterval.current);
      screenshotCaptureInterval.current = null;
    }
  };

  const handleDelete = () => {
    setIsScreenshotDeleted(true);
    setCurrentImage(previousImage);
    handleCloseWindow();
  };

  function dataURLtoFile(dataurl: any, filename: string) {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  useEffect(() => {
    ipcRenderer.on("screenshot:captured", (_e: any, imageData: any) => {
      const file = dataURLtoFile(
        imageData,
        `${new Date().toLocaleString()}_screenshot.png`
      );
      let formData = new FormData();
      formData.append("file", file);
      // console.log(formData.getAll("file"));

      setCurrentImage(imageData);
      setTimeout(async () => {
        setPreviousImage(imageData);
        if (!isScreenshotDeleted && navigator.onLine) {
          try {
            const data = {
              id: 618,
              taskTimeTrackerUrl: formData,
            };
            await axios.post(`${rootUrl}/api/tasktimetracker/url`, data, {
              headers: {
                authorization: `Bearer ${userData.token}`,
                "content-length": "0",
              },
            });
          } catch (error) {
            alert(error);
          }
        } else {
          const local: any = localStorage.getItem("screenshotUrl");
          const storedScreenshots: any = JSON.parse(local);
          const localStorageData =
            storedScreenshots === null ? [] : storedScreenshots;
          localStorageData.push({
            id: 1,
            time: new Date(),
            img: imageData,
          });
          localStorage.setItem(
            "screenshotUrl",
            JSON.stringify(localStorageData)
          );
        }
        handleCloseWindow();
      }, 5000);
    });
  }, []);

  useEffect(() => {
    if (navigator.onLine) {
      let localData: any = localStorage.getItem("screenshotUrl");
      const getLocalData: any = JSON.parse(localData);
      if (!getLocalData) {
        console.log("no data ");
      } else {
        console.log("have data");
      }
    }
  }, [navigator.onLine]);

  const handleCloseWindow = () => {
    setShowScreenshotCapturedWindow(false);
    ScreenshotWindowRef?.current?.closeWindow();
    setIsScreenshotDeleted(false);
  };
  const handleCloseSelectTaskWindow = () => {
    SelectTaskWindowRef?.current?.closeWindow();
  };

  const userData = decryptData("userData");

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
      <SelectTaskWindow ref={SelectTaskWindowRef}>
        <SelectTaskPage />
      </SelectTaskWindow>
      <div className="d-flex align-items-center justify-content-center main-wrapper">
        <div className="tracker-main">
          <div className="trcking-head border-bottom">
            <div className="p-3">
              <div>
                <h2 className="fw-bold">
                  Convert Figma to React for Provider Dashboard
                </h2>
                <p className="mb-0">Girish Subramanyan - Indigo Health Inc</p>
              </div>
            </div>
          </div>
          <div className="trcking-body p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h2 className="fw-bold mb-0">
                  <span className="me-2">{secToMin(seconds)}</span>
                </h2>
                <small>Current Session</small>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="trackingToggle"
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between mt-3">
              <p className="mb-0">{secToMin(totalTime)}</p>
              <p className="mb-0">
                <span>{secToMin(totalTime)}</span> of <span>40 hrs</span>
              </p>
            </div>

            <div className="d-flex align-items-center justify-content-between mt-1 mb-3">
              <p className="mb-0">{`Today (${getDay[0]} UTC)`}</p>
              <p className="mb-0">This week (UTC)</p>
            </div>

            <div>
              <h6 className="fw-bold">Memo</h6>
              <input
                type="text"
                className="form-control"
                placeholder="What are you working on ?"
              />
            </div>

            <div className="mt-3">
              <p>Latest Screen Capture</p>
              <div className="screenshot-box d-flex align-items-center justify-content-center">
                {currentImage ? (
                  <img
                    src={currentImage}
                    className="w-100 h-100"
                    alt="img"
                    loading="lazy"
                  />
                ) : (
                  <p className="mb-0">No captures yet</p>
                )}
              </div>
              <p className="mt-2 mb-0">View Work Diary</p>
            </div>
          </div>
          <div className="trcking-foot border-top p-3">
            <div className="d-flex align-items-center justify-content-between">
              <p className="mb-0">{`${userData.firstName} ${userData.lastName}`}</p>
              <p className="mb-0">Messages</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
