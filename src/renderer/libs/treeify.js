export default function (files, archiveName) {
  var fileTree = {}

  function mergePathsIntoFileTree (prevDir, currDir, i, filePath) {
    if (i === filePath.length - 1) {
      prevDir[currDir] = {
        info: files[filePath.join('/')],
        basename: filePath.join('/'),
        archive: archiveName,
        type: 'file'
      }
    }

    if (!prevDir.hasOwnProperty(currDir)) {
      prevDir[currDir] = {
        type: 'folder'
      }
    }
    return prevDir[currDir]
  }

  function parseFilePath (filePath) {
    var fileLocation = filePath.split('/')

    // If file is in root directory, eg 'index.js'
    if (fileLocation.length === 1) {
      return (fileTree[fileLocation[0]] = {
        info: files[filePath],
        basename: filePath,
        archive: archiveName,
        type: 'file'
      })
    }

    fileLocation.reduce(mergePathsIntoFileTree, fileTree)
  }

  Object.keys(files).forEach(parseFilePath)

  return fileTree
}
