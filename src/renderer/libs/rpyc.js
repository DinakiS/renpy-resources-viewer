import PythonShell from 'python-shell'
import path from 'upath'

export default {
  convertToRpy (filePath, store) {
    return new Promise((resolve, reject) => {
      const unrpyc = path.join(__static, 'unrpyc', 'unrpyc.py')

      let config = {
        args: ['-c', path.normalize(filePath)],
        pythonPath: 'python'
      }

      if (store.config.useRenpyPython) {
        config.pythonPath = path.join(store.files.gameDir, store.config.pythonPath)
        config.pythonOptions = ['-OO']
      }

      PythonShell.run(unrpyc, config, (err, result) => {
        if (err) throw err
        resolve(filePath.replace('.rpyc', '.rpy'))
      })
    })
  }
}
