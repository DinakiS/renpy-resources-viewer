import path from 'path'

export default {
  fileType (name) {
    const ext = path.extname(name).toLowerCase()

    if (['.png', '.jpg', '.ico', '.bmp', '.webp'].includes(ext)) {
      return 'picture'
    }
    if (['.mp3', '.wav', '.ogg', '.opus'].includes(ext)) {
      return 'sound'
    }
    if (['.webm', '.mkv', '.avi', '.mp4'].includes(ext)) {
      return 'video'
    }
    if (['.rpy', '.rpyc'].includes(ext)) {
      return 'code'
    }
    if (['.otf', '.ttf'].includes(ext)) {
      return 'font'
    }
    if (name.endsWith('rpa')) {
      return 'archive'
    }

    return 'undefined'
  }
}
