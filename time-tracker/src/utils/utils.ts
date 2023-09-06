
export const secToMin = (seconds: number) => {
   let sec =(seconds);
        const h = Math.floor(sec / 3600);
        const m = Math.floor(sec % 3600 / 60);
        
    
        const hsecisplay = h > 0 ? h + (h == 1 ? " hr " : " hrs ") : h + " hr ";
        const msecisplay = m > 0 ? m + (m == 1 ? " m " : " m ") : m + " m ";

    return hsecisplay + msecisplay;

}


// function toSeconds( h:number , m: number, ) {
//     return h * 3600 + m * 60 ;
//   }

// export const totalTimeCal=(time:string)=>{
// let split=time.split(" ")
// const hours=Number(split[0])
// const min=Number(split[2])
// let totalSec =toSeconds(hours,min)
// let finalTotal =totalSec+totalSec
// return  secToMin(finalTotal)
// }
// totalTimeCal("11 hr 20 m")
export const getDay = new Date().toString().split(" ")