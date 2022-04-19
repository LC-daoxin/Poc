<template>
  <a-row class="select-component-box" type="flex" :gutter="8">
    <a-col class="left" :class="{'full': !buttons}">
      <slot name="left">
        <a-select
          mode="multiple"
          :placeholder="placeholder"
          v-model="selectValue"
          :options="selectOptions"
          allowClear
          :disabled="disabled"
          :open="selectOpen"
          style="width: 100%;"
          @dropdownVisibleChange="handleDropdownVisibleChange"
          @click.native="visible=(buttons?visible:true)"
        />
      </slot>
    </a-col>

    <a-col v-if="buttons" class="right">
      <a-button type="primary" icon="search" :disabled="disabled" @click="visible=true">{{selectButtonText}}</a-button>
    </a-col>

    <select-component-modal
      v-model="selectValue"
      :visible.sync="visible"
      v-bind="modalProps"
      @options="handleOptions"      
    />
  </a-row>
</template>

<script>
  import SelectComponentModal from './SelectComponentModal'

  export default {
    name: 'CommonSelectComponent',
    components: { SelectComponentModal },
    props: {
      value: {
        type: String,
        default: ''
      },     
      returnId: {
        type: Boolean,
        default: true
      },
      placeholder: {
        type: String,
        default: '请选择'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      // 是否支持多选，默认 true
      multiple: {
        type: Boolean,
        default: true
      },
      // 是否显示按钮，默认 true
      buttons: {
        type: Boolean,
        default: true
      },
      // 显示的 Key
      displayKey: {
        type: String,
        default: null
      },
      // 返回的 key
      returnKeys: {
        type: Array,
        default: () => ['id', 'id']
      },
      // 选择按钮文字
      selectButtonText: {
        type: String,
        default: '选择'
      }
    },
    data() {
      return {
        selectValue: [],
        selectOptions: [],
        dataSourceMap: {},
        visible: false,
        selectOpen: false        
      }
    },
    computed: {
      valueKey() {
        return this.returnKeys[0]
      },
      modalProps() {          
        return Object.assign({
          valueKey: this.valueKey,
          multiple: this.multiple,
          returnKeys: this.returnKeys, 
          extendQueryParam: this.$attrs.queryParam,               
          displayKey: this.displayKey || this.valueKey
        }, this.$attrs)
      },
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {          
          if (val) {
            this.selectValue = val.split(',')
          } else {
            this.selectValue = []
          }
        }
      },
      selectValue: {
        deep: true,
        handler(val) {          
          let rows = val.map(key => this.dataSourceMap[key])
          let data = val.join(',')
          if (data !== this.value) {
            this.$emit('select', rows)
            this.$emit('input', data)
            this.$emit('change', data)
          }
        }
      }
    },
    methods: {
      handleOptions(options, dataSourceMap) {
        this.selectOptions = options
        this.dataSourceMap = dataSourceMap
      },
      handleDropdownVisibleChange() {     
        this.selectOpen = true
        this.$nextTick(() => {
          this.selectOpen = false
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .select-component-box {

    @width: 82px;

    .left {
      width: calc(100% - @width - 8px);
    }

    .right {
      width: @width;
    }

    .full {
      width: 100%;
    }

    /deep/ .ant-select-search__field {
      display: none !important;
    }
  }
</style>