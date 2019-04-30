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
  const [testData, trainingData] = splitDataset(minMax(outputs, 3), testSetSize)
  
  _.range(1, 20).forEach(k => {
    const accuracy = _.chain(testData)
                      .filter(testPoint => knn(trainingData, _.initial(testPoint), k) === testPoint[3])
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
  return _.chain(pointA)
          .zip(pointB)
          .map(([a, b]) => (a - b) ** 2)
          .sum()
          .value() ** 0.5
}

function knn(data, point, k) {
  return _.chain(data)
          .map(row => {
            return [
              distance(_.initial(row), point), 
              _.last(row)
            ]
          }) 
          .sortBy(row => row[0]) 
          .take(k) 
          .countBy(row => row[1]) 
          .toPairs() 
          .sortBy(row => row[1])
          .last()
          .first()
          .parseInt()
          .value() 
}

function minMax(data, featureCount) {
  const clone = _.cloneDeep(data)
  for (let i = 0; i < featureCount; i++) {
    const column = clone.map(row => row[1])
    const min = _.min(column)
    const max = _.max(column)
    for (let j = 0; j < clone.length; j++) {
      clone[j][i] = (clone[j][i] - min) / (max - min)
    }
  }
  return clone
}