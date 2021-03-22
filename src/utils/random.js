/* function to generate a random number from the interval minto max */
export function randomIntFromInterval(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}