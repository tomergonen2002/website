<template>
  <div class="desktop" :style="desktopStyle">
    <div class="desktop-area">
      <div v-for="icon in icons" :key="icon.id" class="desktop-icon" @dblclick="open(icon.id)">
        <img :src="icon.src" :alt="icon.title" class="icon-img"/>
        <div class="icon-label">{{ icon.title }}</div>
      </div>
    </div>

    <div v-if="windowOpen" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="window" id="xpWindow">
        <div class="title-bar">
          <div class="title-bar-text">{{ windowTitle }}</div>
          <div class="title-bar-controls">
            <button class="title-btn close" @click="close" aria-label="Close"></button>
          </div>
        </div>
        <div class="window-body">
          <component :is="windowComponent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AboutSection from '../../index.html?raw' // placeholder (we'll render simple content below)

export default {
  name: 'Desktop',
  components: { Pictures, Games, Contact, DesktopNote },
  data() {
    return {
      windowOpen: false,
      windowTitle: '',
      windowComponent: null,
      icons: [
        { id: 'computer', title: 'My Computer', src: '/img/My Computer.png' },
        { id: 'pictures', title: 'Pictures', src: '/img/My Pictures.png' },
        { id: 'games', title: 'Games', src: '/img/My Games.png' },
        { id: 'contact', title: 'Contact', src: '/img/Email.png' },
        { id: 'desktop-note', title: 'Bla', src: '/img/Desktop.png' }
      ]
    }
  },
  computed: {
    desktopStyle() {
      return { minHeight: '100vh' }
    }
  },
  methods: {
    open(id) {
      const mapping = {
        computer: { title: 'About', comp: { template: '<div><h2>About</h2><p>My name is Tomer, I study Business Informatics at HTW Berlin.</p></div>' } },
        pictures: { title: 'Pictures', comp: Pictures },
        games: { title: 'Games', comp: Games },
        contact: { title: 'Contact', comp: Contact },
        'desktop-note': { title: 'Desktop', comp: DesktopNote }
      }
      const entry = mapping[id]
      if (!entry) return
      this.windowTitle = entry.title
      this.windowComponent = entry.comp
      this.windowOpen = true
    },
    close() { this.windowOpen = false }
  }
}
</script>

<style>
.spa-desktop { background: url('/img/Wallpaper.png') center/cover no-repeat fixed; }
.desktop-area { padding: 24px; display:flex; flex-wrap:wrap; gap:12px; }
.desktop-icon { width:96px; text-align:center; cursor:pointer; }
.icon-img { width:48px; height:48px; display:block; margin:0 auto 6px; }
.icon-label { color:#fff; text-shadow:0 1px 0 rgba(0,0,0,0.6); font-size:13px }
.taskbar { position:fixed; left:0; right:0; bottom:0; height:40px; background:linear-gradient(#1f4a86,#2b5797); display:flex; align-items:center; gap:8px; padding:4px 8px }
.start-button { background:linear-gradient(#f0f0f0,#e0e0e0); padding:4px 10px; border-radius:3px }
.task-btn { background:#fff; border:1px solid rgba(0,0,0,0.1); padding:4px 8px; }
.modal-overlay { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.45); }
.window { width:720px; box-shadow:0 12px 48px rgba(0,0,0,0.6); }
.window .window-body { background:#fff; padding:12px }
.title-bar { display:flex; align-items:center; justify-content:space-between; padding:6px 8px; background:linear-gradient(#0b57a4,#0a4f95); color:#fff }
.title-bar-text { font-weight:700 }
.title-bar-controls { display:flex; gap:6px }
.title-btn { width:28px; height:18px; border:none; background-repeat:no-repeat; background-size:auto 100%; cursor:pointer; padding:0 }
.title-btn.close { background-image: url('/img/titlebar-buttons.png'); background-position: -64px 0 }
</style>
