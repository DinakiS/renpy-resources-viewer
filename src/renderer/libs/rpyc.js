import PythonShell from 'python-shell'
import path from 'upath'

export default {
  convertToRpy (filePath) {
    return new Promise((resolve, reject) => {
      const rpatool = path.join(__dirname, '..', 'assets', 'unrpyc', 'unrpyc.py')

      PythonShell.run(rpatool, {
        args: ['-c', path.normalize(filePath)]
      }, (err, result) => {
        if (err) throw err
        resolve(filePath.replace('.rpyc', '.rpy'))
      })
    })
  }
}
