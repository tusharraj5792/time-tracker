import CryptoJS from "crypto-js";

const secretKey: string = import.meta.env.VITE_SECRET_KEY;

export const useAuth = () => {
  const _token = getCookie("authToken");
  if (_token) {
    return {
      auth: true,
    };
  } else {
    return {
      auth: false,
    };
  }
};

export const encryptData = (name: string, data: string) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  saveCookie(name, encrypted, 5);
};

export const decryptData = (name: string) => {
  const encrypted = getCookie(name);
  if (encrypted) {
    const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey).toString(
      CryptoJS.enc.Utf8
    );
    return JSON.parse(decrypted);
  }
  return null;
};
const saveCookie = (
  cookieName: string,
  cookieValue: string,
  hourToExpire: number
) => {
  //setting cookie with expiry time
  const currentDate = new Date();
  currentDate.setTime(currentDate.getTime() + hourToExpire * 3600 * 1000);
  document.cookie =
    cookieName +
    " = " +
    cookieValue +
    "; expires = " +
    currentDate.toUTCString();
};

export const getCookie = (name: string) =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

export const secToMin = (seconds: number) => {
  let sec = seconds;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);

  const hsecisplay = h > 0 ? h + (h == 1 ? " hr " : " hrs ") : h + " hr ";
  const msecisplay = m > 0 ? m + (m == 1 ? " m " : " m ") : m + " m ";

  return hsecisplay + msecisplay;
};
export const getDay = new Date().toString().split(" ");
