<template>
  <div class="Generate">
    <iframe
      sandbox="allow-forms allow-modals allow-popups allow-scripts allow-same-origin allow-downloads"
      id="Generate"
      @load="onload"
      :src="url"
      class="iframe"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import _ from 'lodash'
  import axios from 'axios'

  export default {
    name: 'TemplateList',
    components: {
    },
    data() {
      return {
        url: '/static/OnlineEditing.html'
      }
    },
    computed: {
      ...mapState({
        lang: (state) => state.app.lang,
        activitiesSelect: (state) => state.poc.activitiesSelect,
      }),
    },
    watch: {
      lang(val) {
        this.setColumns(val)
      },
    },
    mounted() {},
    methods: {
      sendName(name) {
        document.getElementById('Generate').contentWindow.postMessage({
          name
        }, '*')
      },
      onload() {

      }
    }
  }
</script>

<style lang="less" scoped>
.Generate {
  height: calc(100vh);
  padding: 0 0 30px;
}
.iframe {
  margin: 20px 0;
  border:none;
  width:95%;
  height: 100%;
  margin-left: 2.5%;
}
</style>
