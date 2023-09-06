import { useState, useEffect, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/index";
import { getDay, secToMin } from "../utils/utils";
import ScreenshotWindow from "../screenshotWindow";
import ScreenshotCaptured from "../screenshotCaptured";
const ipcRenderer =
  typeof window.require === "function"
    ? window.require("electron").ipcRenderer
    : false;
const Home = () => {
  const ScreenshotWindowRef = useRef<any>(null);
  const [seconds, setSeconds] = useState<number>(0);
  const [screenShotCapture, setScreenShotCapture] = useState<boolean>(false);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [timeInterval, setTimeInterval] = useState<any>(null);
  const [screenShotInterval, setScreenShotInterval] = useState<any>(null);
  const [showScreenshotCapturedWindow, setShowScreenshotCapturedWindow] =
    useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState("");
  const [previousImage, setPreviousImage] = useState("");
  const [isScreenshotDeleted, setIsScreenshotDeleted] = useState(false);

  const handleChange = (e: any) => {
    if (e.target.checked) {
      setTimeInterval(
        setInterval(() => {
          setSeconds((seconds) => seconds + 1);
        }, 1000)
      );
      setScreenShotInterval(
        setInterval(() => {
          console.log("test");
          setScreenShotCapture(true);
          secToMin(seconds);
          setTotalTime((totalT) => totalT + 5);
          setShowScreenshotCapturedWindow(true);
        }, 10000)
      );
    } else {
      setSeconds(0);
      clearInterval(timeInterval);
      setScreenShotCapture(false);
      clearInterval(screenShotInterval);
    }
  };

  const handleDelete = () => {
    setIsScreenshotDeleted(true);
    setCurrentImage(previousImage);
    handleCloseWindow();
  };

  useEffect(() => {
    if (screenShotCapture) {
      // after every 10 minutes
      ipcRenderer.send("screenshot:capture", {});
      ipcRenderer.on("screenshot:captured", (_e: any, imageData: any) => {
        // console.log(imageData);
        setCurrentImage(imageData);
        setTimeout(async () => {
          setPreviousImage(imageData);
          if (!isScreenshotDeleted) {
            try {
              //add data to firebase cloud
              await addDoc(collection(db, "user-record"), {
                id: 1,
                time: new Date(),
                img: imageData,
              });
            } catch (error) {
              alert(error);
            }
          }
          handleCloseWindow();
        }, 5000);
      });
    }
  }, [screenShotCapture, showScreenshotCapturedWindow]);

  const handleCloseWindow = () => {
    setShowScreenshotCapturedWindow(false);
    setScreenShotCapture(false);
    ScreenshotWindowRef?.current?.closeWindow();
    setIsScreenshotDeleted(false);
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
                  onChange={handleChange}
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
              <p className="mb-0">Navjot Kaur</p>
              <p className="mb-0">Messages</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
