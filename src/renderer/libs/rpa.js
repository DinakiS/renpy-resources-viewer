import fs from 'fs'
import zlip from 'zlib'
import jPickle from 'jPickle'
import PythonShell from 'python-shell'
import path from 'upath'

function readFile (path) {
  let f = fs.openSync(path, 'r')
  let size = fs.statSync(path).size

  return { f, size }
}

export default {
  getIndex (path) {
    return new Promise((resolve, reject) => {
      let fileInfo = readFile(path)
      let buff = Buffer.alloc(33)

      fs.read(fileInfo.f, buff, 0, 33, 0, (err, bytes, headerData) => {
        if (err) return reject(err)

        let offset = parseInt(headerData.slice(8, 24).toString('utf8'), 16)
        let key = parseInt(headerData.slice(25, 33).toString('utf8'), 16)

        buff = Buffer.alloc(fileInfo.size - offset)

        fs.read(fileInfo.f, buff, 0, fileInfo.size - offset, offset, (err, bytes, indexBuf) => {
          if (err) return reject(err)

          let unzip = zlip.unzipSync(indexBuf)
          let index = jPickle.loads(unzip.toString('binary'))

          Object.keys(index).forEach(k => {
            index[k] = index[k][0]
          })

          Object.keys(index).forEach(k => {
            if (index[k].length !== 2) {
              let offset = index[k][0]
              let dlen = index[k][1]
              let start = index[k][2]

              index[k] = [ offset ^ key, dlen ^ key, start ]
            }
          })

          resolve({
            size: fileInfo.size,
            index: index
          })
        })
      })
    })
  },
  extractFile (archive, file, out) {
    return new Promise((resolve, reject) => {
      const rpatool = path.join(__static, '/rpatool.py')

      PythonShell.run(rpatool, {
        args: ['-x', path.normalize(archive), `${path.join(out, file.basename)}=${path.normalize(file.basename)}`]
      }, (err, result) => {
        if (err) throw err
        resolve(path.join(out, file.basename))
      })
    })
  }
}
