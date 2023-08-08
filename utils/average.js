exports.calculateAverage = (array) => {
    const sum = array.reduce((acc, currentValue) => acc + currentValue, 0);
    const average = sum / array.length;
    return average.toFixed(1);
};
