function timeAgo(date) {
  const now = new Date();
  const pastDate = new Date(date);

  const differenceInMillis = now - pastDate;

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  if (differenceInMillis < minute) {
    const seconds = Math.floor(differenceInMillis / second);
    return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;
  } else if (differenceInMillis < hour) {
    const minutes = Math.floor(differenceInMillis / minute);
    return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
  } else if (differenceInMillis < day) {
    const hours = Math.floor(differenceInMillis / hour);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (differenceInMillis < month) {
    const days = Math.floor(differenceInMillis / day);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else if (differenceInMillis < year) {
    const months = Math.floor(differenceInMillis / month);
    return `${months} mon${months !== 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(differenceInMillis / year);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }
}

export default timeAgo;
// Example usage
// const givenDate = new Date(
//   "Tue Jun 04 2024 10:55:14 GMT+0500 (Pakistan Standard Time)"
// ); // Example date
// console.log(timeAgo(givenDate));
