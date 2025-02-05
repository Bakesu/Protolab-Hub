export const convertMinutes = (minutes: number) => {
    if (minutes === null || minutes == 0 || isNaN(minutes)) return "0";
    let h = Math.trunc(minutes / 60);
    let m = minutes % 60;
  
    let hDisplay = h > 0 ? h + (h === 1 ? "h, " : "h, ") : "";
    let mDisplay = m > 0 ? m + (m === 1 ? "min " : "min ") : "";

    return hDisplay + mDisplay;
  }

  export function formatISODate(tickItem: string, index?: number): string {
    const timestampDate = new Date(tickItem)
    const month = timestampDate.getMonth() + 1
    const date = addZero(timestampDate.getDate())
    const hours = addZero(timestampDate.getHours())
    const minutes = addZero(timestampDate.getMinutes())
    return `(${date}/${month} - ${hours}:${minutes})`
}

function addZero(i: number): string {
    let result = i.toString();
    if (i < 10) {
        result = "0" + result
    }
    return result
}