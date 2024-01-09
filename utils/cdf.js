// Cumulative distribution function -- chatGPT
function cdf(dataArray) {
  const rand = Math.random();
  let sum = 0;

  for (let data of dataArray) {
    sum += data.probability;
    if (rand < sum) {
      return data.result;
    }
  }
}
