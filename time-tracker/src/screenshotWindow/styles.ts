let css: any;

css = `
.screenshot-main {
  height: 100vh;
}
.screenshot-main .ss-box {
  width: 400px;
  height: 240px;
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
}
.screenshot-main .screenshot-box {
  border: 1px solid #e9e9e9;
  height: 150px;
  width: 100%;
  border-radius: 6px;
}
.screenshot-main .screenshot-box img {
  border-radius: 6px;
}
.screenshot-main .progress {
  height: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}
.screenshot-main .vertical {
  display: inline-block;
  width: 70px;
  height: 5px;
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
}
.screenshot-main .vertical {
  box-shadow: inset 0px 4px 6px #ccc;
}
.screenshot-main .progress-bar {
  box-shadow: inset 0px 4px 6px rgba(100, 100, 100, 0.6);
}
.screenshot-main .progress-bar-info {
  background-color: #5bc0de;
}
.screenshot-main .progress-bar {
  float: left;
  width: 0;
  height: 100%;
  font-size: 12px;
  line-height: 20px;
  color: #fff;
  text-align: center;
  background-color: #337ab7;
  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  -webkit-transition: width 0.6s ease;
  -o-transition: width 0.6s ease;
  transition: width 0.6s ease;
}

.round-time-bar {
  margin: 1rem;
  overflow: hidden;
}
.round-time-bar div {
  height: 5px;
  transform-origin: left center;
  animation: roundtime calc(var(--duration) * 1s) steps(var(--duration))
  forwards;
  background: #7f54ee;  
}
.round-time-bar[data-style="smooth"] div {
  animation: roundtime calc(var(--duration) * 1s) linear forwards;
}
@keyframes roundtime {
  to {
    transform: scaleX(0);
  }
}

  `;

export default css;
