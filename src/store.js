export default (fileName='../store.json') => {
  const fs = require('mz/fs')

  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, '{}')
  }
  let currentData = require(`./${fileName}`)

  return {
    addInstallation,
    read
  }


  function write(data) {
    return fs.writeFile(fileName, JSON.stringify(data, null, 2))
  }

  function read() {
    return Object.assign({}, currentData)
  }

  function addInstallation(installation) {
    const teamId = installation.team_id
    currentData[teamId] = currentData[teamId] || []
    currentData[teamId].push(installation)
    return write(currentData).then(read)
  }
}