import { useState, useEffect, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/index";
import { getDay, secToMin } from "../utils/utils";
import ScreenshotWindow from "../screenshotWindow";
import ScreenshotCaptured from "../screenshotCaptured";
import { Login } from "../login";
import axios from "axios";
import { useLocation } from "react-router";
const ipcRenderer =
  typeof window.require === "function"
    ? window.require("electron").ipcRenderer
    : false;
const Home = () => {
  const location=useLocation()
  const ScreenshotWindowRef = useRef<any>(null);
  const [seconds, setSeconds] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [showScreenshotCapturedWindow, setShowScreenshotCapturedWindow] =
    useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState("");
  const [previousImage, setPreviousImage] = useState("");
  const [isScreenshotDeleted, setIsScreenshotDeleted] = useState(false);

  const screenShotInterval: any = useRef(null);
  const TimeInterval: any = useRef(null);

  const handleChange = (e: any) => {
    if (e.target.checked) {
      TimeInterval.current = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
        setTotalTime((seconds) => seconds + 1);
      }, 1000);

      screenShotInterval.current = setInterval(() => {
        secToMin(seconds);
        setTotalTime((totalT) => totalT);
        setShowScreenshotCapturedWindow(true);
        ipcRenderer.send("screenshot:capture", {});
      }, 15000);
    } else {
      setSeconds(0);
      clearInterval(TimeInterval.current);
      TimeInterval.current = null;
      clearInterval(screenShotInterval.current);
      screenShotInterval.current = null;
    }
  };

  const handleDelete = () => {
    setIsScreenshotDeleted(true);
    setCurrentImage(previousImage);
    handleCloseWindow();
  };

  useEffect(() => {
    ipcRenderer.on("screenshot:captured", (_e: any, imageData: any) => {
      setCurrentImage(imageData);
      setTimeout(async () => {
        setPreviousImage(imageData);
        if (!isScreenshotDeleted && navigator.onLine) {
          try {
            //add data to firebase cloud
            // await addDoc(collection(db, "user-record"), {
            //   id: new Date().getTime().toString(),
            //   time: new Date(),
            //   img: imageData,
            // });

            const data = {
              id: 618,
              url: imageData,
            };

            // const response =await axios.post(
            //   `https://task-api.ensuesoft.com/api/tasktimetracker/url?taskId=${618}&url=jonojo`,
            //   null,
            //   {
            //     headers: {
            //       authority: "task-api.ensuesoft.com",
            //       accept: "text/plain",
            //       "accept-language": "en-US,en;q=0.9",
            //       authorization:
            //         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYiLCJlbWFpbCI6InBvb2phLmthb25kYWxAZW5zdWVzb2Z0LmNvbSIsIm5iZiI6MTY5NDUyMDE0MywiZXhwIjoxNjk0NTY1NzQzLCJpYXQiOjE2OTQ1MjAxNDN9.HEUYB6Ql1dBgmTYzUKQNNwDa5Prxg8rB3LIrvXu9Ku4",
            //       "content-length": "0",
            //       origin: "https://task-api.ensuesoft.com",
            //       referer: "https://task-api.ensuesoft.com/swagger/index.html",
            //       "sec-ch-ua":
            //         '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
            //       "sec-ch-ua-mobile": "?0",
            //       "sec-ch-ua-platform": '"Windows"',
            //       "sec-fetch-dest": "empty",
            //       "sec-fetch-mode": "cors",
            //       "sec-fetch-site": "same-origin",
            //       "user-agent":
            //         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            //     },
            //   }
            // );
          } catch (error) {
            alert(error);
          }
        } else {
          const local: any = localStorage.getItem("screenshotUrl");
          const storedScreenshots: any = JSON.parse(local);
          const ssData = storedScreenshots === null ? [] : storedScreenshots;
          ssData.push({
            id: 1,
            time: new Date(),
            img: imageData,
          });
          localStorage.setItem("screenshotUrl", JSON.stringify(ssData));
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
  return (
    <>
      {location.state?<>
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
              <p className="mb-0">{`${location.state.firstName} ${location.state.lastName}`}</p>
              <p className="mb-0">Messages</p>
            </div>
          </div>
        </div>
      </div>
      
      
      </>:null}
      
    </>
  );
};

export default Home;
