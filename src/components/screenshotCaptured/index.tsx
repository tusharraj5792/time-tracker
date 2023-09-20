interface props {
  screenshotUrl: string;
  handleDelete: () => void;
  handleCloseWindow: () => void;
}
import "./screenshotCaptured.css";
const ScreenshotCaptured = (props: props) => {
  const style: any = { "--duration": 5 };

  return (
    <div className="d-flex align-items-center justify-content-center screenshot-main">
      <div className="ss-box p-3">
        <div
          className="d-flex align-items-center justify-content-between"
          style={{ fontSize: "18px" }}
        >
          <p className="mb-0">Screen Capture</p>
          <i
            className="fa-solid fa-xmark"
            style={{ cursor: "pointer" }}
            onClick={props.handleCloseWindow}
          ></i>
        </div>

        <div className="screenshot-box d-flex align-items-center justify-content-center mt-3 me-2">
          {
            <img
              src={props.screenshotUrl && props.screenshotUrl}
              className="w-100 h-100"
              alt="img"
              loading="lazy"
            />
          }
        </div>

        <div className="d-flex align-items-center justify-content-center">
          <div
            className="round-time-bar w-100"
            data-style="smooth"
            style={style}
          >
            <div></div>
          </div>

          <i className="fa-solid fa-trash-can" onClick={props.handleDelete}></i>
        </div>
      </div>
    </div>
  );
};

export default ScreenshotCaptured;
