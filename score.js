/*
KNN ALGORITHM USING MULTIPLE VARIABLES
INPUT DATA FORMAT: [dropPosition, bounciness, size, bucketLabel]
*/

const outputs = []

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel])
}

function runAnalysis() {
  const testSetSize = 100
  const [testData, trainingData] = splitDataset(outputs, testSetSize)
  _.range(1, 20).forEach(k => {
    const accuracy = _.chain(testData)
                      .filter(testPoint => knn(trainingData, testPoint[0], k) === testPoint[3])
                      .size()
                      .divide(testSetSize)
                      .value()
    console.log(`For k ${k}, accuracy was ${accuracy}`)
  })
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data)
  const testData = _.slice(shuffled, 0, testCount)
  const trainingData = _.slice(shuffled, testCount)
  return [testData, trainingData]
}

const distance = (pointA, pointB) => {
  return Math.abs(pointA - pointB)
}

function knn(data, point, k) {
  return _.chain(data)
  .map(output => [distance(output[0], point), output[3]]) 
  .sortBy(output => output[0]) 
  .take(k) 
  .countBy(output => output[1]) 
  .toPairs() 
  .sortBy(output => output[1])
  .last()
  .first()
  .parseInt()
  .value() 
}