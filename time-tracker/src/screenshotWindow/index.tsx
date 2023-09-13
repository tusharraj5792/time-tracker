import  {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import ReactDOM from "react-dom";
import css from "./styles.js";
const ScreenshotWindow = forwardRef(
  ({ children= "root-portal", el = "div" }: any, ref) => {
    let externalWindow: Window | null = null;
    const [container] = useState(() => {
      // This will be executed only on the initial render
      // https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
      return document.createElement(el);
    });
    useImperativeHandle(
      ref,
      () => ({
        closeWindow() {
          closeWindow();
        },
      }),
      [externalWindow]
    );
    useEffect(() => {
      container.style.overflow = "hidden";
      container.style.height = "100%";
      container.style.position = "relative";

      let screenOptions = `left=${window.screen.width - 400},top=${
        window.screen.height - 300
      },width=400px,height=240px`;
      externalWindow = window.open("", `screenshotCaptured`, screenOptions);
      if (externalWindow) {
        externalWindow.document.write("<html>");
        externalWindow.document.write("<head>");
        externalWindow.document.write(
          `
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ"
            crossorigin="anonymous"
        />

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css" />

        <link
            href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Lato:wght@300&family=Montserrat:wght@400;500&family=Playfair+Display:wght@500&family=Poppins:wght@200;300;500&display=swap"
            rel="stylesheet" />
        `
        );
        externalWindow.document.write("</head>");
        externalWindow.document.write("<body>");
        externalWindow.document.body.appendChild(container);
        externalWindow.document.write("</body>");
        externalWindow.document.write("</html>");
        let style: any = document.createElement("style");

        externalWindow.document.head.appendChild(style);
        if (style.styleSheet) {
          // This is required for IE8 and below.
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
      }
    }, []);

    const closeWindow = () => {
      if (externalWindow) {
        externalWindow.close();
      }
    };

    return ReactDOM.createPortal(children, container);
  }
);

export default ScreenshotWindow;
