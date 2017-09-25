

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
  


function humanTime(dateObj) {
  return `${months[dateObj.getMonth]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`; 
}

module.exports = {
  humanTime
};
