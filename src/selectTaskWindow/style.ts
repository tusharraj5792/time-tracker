let css: any;

css = `
.main-wrapper {
  height: 100vh;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
}

.main-wrapper select.form-control:focus {
  box-shadow: none;
}

.main-wrapper select.form-control {
  appearance: auto;
}

.main-wrapper h6 {
  color: #f24759;
}

.max-ul-h {
  max-height: 120px;
  overflow: auto;
}

.max-ul-h li:hover {
  background-color: #F5F5F5;
  cursor: pointer;
  color: #F24759;
}

::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
  `;

export default css;
