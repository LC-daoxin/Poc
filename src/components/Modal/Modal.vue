<template>
  <a-modal
    ref="modal"
    :class="getClass(modalClass)"
    :style="getStyle(modalStyle)"
    :visible="visible"
    v-bind="_attrs"
    v-on="$listeners"
    @ok="handleOk"
    @cancel="handleCancel"
  >

    <slot></slot>

    <template v-if="!isNoTitle" slot="title">
      <a-row class="s-modal-title-row" type="flex">
        <a-col class="left">
          <slot name="title">{{ title }}</slot>
        </a-col>
        <a-col v-if="switchFullscreen" class="right" @click="toggleFullscreen">
          <a-button class="ant-modal-close ant-modal-close-x"  :icon="fullscreenButtonIcon"/>
        </a-col>
      </a-row>
    </template>

    <!-- 处理 scopedSlots -->
    <template v-for="slotName of scopedSlotsKeys" :slot="slotName">
      <slot :name="slotName"></slot>
    </template>

    <!-- 处理 slots -->
    <template v-for="slotName of slotsKeys" v-slot:[slotName]>
      <slot :name="slotName"></slot>
    </template>

  </a-modal>
</template>

<script>

  import { getClass, getStyle } from '@/utils/props-util'
  import { triggerWindowResizeEvent } from '@/utils/util'

  export default {
    name: 'SModal',
    props: {
      title: String,
      visible: Boolean,
      fullscreen: {
        type: Boolean,
        default: false
      },
      switchFullscreen: {
        type: Boolean,
        default: false
      },
      okClose: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        usedSlots: ['title'],
        innerFullscreen: this.fullscreen,
      }
    },
    computed: {
      _attrs() {
        let attrs = { ...this.$attrs }
        if (this.innerFullscreen) {
          attrs['width'] = '100%'
        }
        return attrs
      },
      modalClass() {
        return {
          's-modal-box': true,
          'fullscreen': this.innerFullscreen,
          'no-title': this.isNoTitle,
          'no-footer': this.isNoFooter,
        }
      },
      modalStyle() {
        let style = {}
        // 如果全屏就将top设为 0
        if (this.innerFullscreen) {
          style['top'] = '0'
        }
        return style
      },
      isNoTitle() {
        return !this.title && !this.allSlotsKeys.includes('title')
      },
      isNoFooter() {
        return this._attrs['footer'] === null
      },
      slotsKeys() {
        return Object.keys(this.$slots).filter(key => !this.usedSlots.includes(key))
      },
      scopedSlotsKeys() {
        return Object.keys(this.$scopedSlots).filter(key => !this.usedSlots.includes(key))
      },
      allSlotsKeys() {
        return Object.keys(this.$slots).concat(Object.keys(this.$scopedSlots))
      },
      // 切换全屏的按钮图标
      fullscreenButtonIcon() {
        return this.innerFullscreen ? 'fullscreen-exit' : 'fullscreen'
      },
    },
    watch: {
      visible() {
        if (this.visible) {
          this.innerFullscreen = this.fullscreen
        }
      },
      innerFullscreen(val) {
        this.$emit('update:fullscreen', val)
      },
    },
    methods: {

      getClass(clazz) {
        return { ...getClass(this), ...clazz }
      },
      getStyle(style) {
        return { ...getStyle(this), ...style }
      },

      close() {
        this.$emit('update:visible', false)
      },

      handleOk() {
        if (this.okClose) {
          this.close()
        }
      },
      handleCancel() {
        this.close()
      },

      /** 切换全屏 */
      toggleFullscreen() {
        this.innerFullscreen = !this.innerFullscreen
        triggerWindowResizeEvent()
      },

    }
  }
</script>

<style lang="less">
  .s-modal-box {

    &.fullscreen {
      top: 0;
      left: 0;
      padding: 0;

      // 兼容1.6.2版本的antdv
      & .ant-modal {
        top: 0;
        padding: 0;
        height: 100vh;
      }

      & .ant-modal-content {
        height: 100vh;
        border-radius: 0;

        & .ant-modal-body {
          /* title 和 footer 各占 55px */
          height: calc(100% - 55px - 55px);
          overflow: auto;
        }
      }

      &.no-title, &.no-footer {
        .ant-modal-body {
          height: calc(100% - 55px);
        }
      }

      &.no-title.no-footer {
        .ant-modal-body {
          height: 100%;
        }
      }
    }

    .s-modal-title-row {
      .left {
        width: calc(100% - 56px - 56px);
      }

      .right {
        width: 56px;
        position: inherit;

        .ant-modal-close {
          border: 0px;
          top: -5px;
          left: 50px;
          color: rgba(0, 0, 0, 0.45);

          &:hover {
            color: rgba(0, 0, 0, 0.75);
          }
        }        
      }
    }
  }

  @media (max-width: 767px) {
    .s-modal-box.fullscreen {
      margin: 0;
      max-width: 100vw;
    }
  }
</style>