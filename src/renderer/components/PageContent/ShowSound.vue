<template>
  <div class='player-wrap'>
    <audio 
      class="audio-player"
      :src="'file:///' + file"
      @canplay="init"
      @playing="_playing"
      @pause="_playing"
      @timeupdate="_timeupdate"
      autoplay>
    </audio>
    
    <div class="player">
      <button class='btn' :class="{play: !isPlaying, pause: isPlaying}" @click="play">
        <span v-if="!isPlaying" class='icon-play'></span>
        <span v-if="isPlaying" class='icon-pause'></span>
      </button>
      <div class='progress'>
        <div class="current" :style="`width: ${progress}%`"></div>
      </div>
      <span>{{time}} / {{duration}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['file'],
  data () {
    return {
      audio: null,
      isPlaying: true,
      duration: 0,
      time: 0,
      progress: 0
    }
  },
  watch: {
    file (val) {
      if (val) {
        if (this.isPlaying) {
          this.audio.pause()
        }
        this.audio = null
      }
    }
  },
  methods: {
    play () {
      if (this.audio.paused) {
        this.audio.play()
      } else {
        this.audio.pause()
      }
    },

    init (e) {
      let audio = e.target
      this.audio = audio

      this.duration = this.normalizeTime(audio.duration)
      this.time = 0
    },

    _playing (e) {
      if (e.target.paused) {
        this.isPlaying = false
      } else {
        this.isPlaying = true
      }
    },
    _timeupdate (e) {
      this.time = this.normalizeTime(e.target.currentTime)
      this.progress = e.target.currentTime / e.target.duration * 100
    },

    normalizeTime (val) {
      let min = parseInt(val / 60, 10)
      let sec = parseInt(val % 60, 10)

      return `${('' + min).padStart(2, 0)}:${('' + sec).padStart(2, 0)}`
    }
  }
}
</script>

<style lang="scss" scoped>
  .player-wrap {
    display: flex;
    height: 100%;

    .audio-player {
      display: none;
    }

    .player {
      margin: auto;
      width: 100%;
      text-align: center;

      .btn {
        background: none;
        border: 1px solid;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 2rem;
        padding: 0;
        padding-top: 3px;
        cursor: pointer;
        
        &.play {
          padding-left: 3px;
          color: #a7dc29;
        }
        &.pause {
          color: #FFD02C;
        }
      }

      .progress {
        width: calc(100% - 20px);
        height: 10px;
        margin: 10px;
        background: #13171D;

        .current {
          height: 100%;
          background-color: #a7dc29;
        }
      }
    }
  }

</style>
