<template>
  <div class="pannel-picker">
    <a-input-group compact>
      <a-select
        v-show="showSelect"
        :mode="selectMultiple ? 'multiple' : ''"
        :value="select"
        style="width: calc(100% - 64px)"
        :placeholder="placeholder"
        :disabled="disabled"
        @change="handleChange"
        @deselect="deselect"
      >
        <a-select-option v-for="item in options.selected" :key="item.id">
          {{ item.name }}（{{ item.typeName }}）
        </a-select-option>
      </a-select>
      <a-button type="primary" :disabled="disabled" @click="openPannel">选择</a-button>
    </a-input-group>
    <general-pannel
      ref="pannel"
      class="pannel"
      :options="options"
      :multiple="selectMultiple"
      @change="pannelChange"
    />
  </div>
</template>

<script>
import GeneralPannel from "./GeneralPannel.vue";

export default {
  props: {
    placeholder: {
      type: String,
      default: "请选择",
    },
    selectMultiple: {
      type: Boolean,
      default: true,
    },
    outputType: { // 选择输出类型
      type: String, // key: [id1, id2, ...] username: [username1, username2, ...] default [{}, {}, ...]
      default: 'key'
    },
    showSelect: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Object,
      default: () => {
        return {
          selected: [],
        };
      },
    },
    disabled: {
      type: Boolean,
      default: false
    },
    select: [String, Number, Array], // v-model='select'
    value: [String, Number, Array], // 默认值
  },
  model: {
    prop: "select",
    event: "modelChange",
  },
  mounted() {
    if (this.value) {
      this.$emit("modelChange", this.value); // 设置默认值
    }
  },
  data() {
    return {
      // selected: [],
    };
  },
  methods: {
    openPannel() {
      this.$emit("openPannel");
      this.$refs.pannel.open();
      console.log("select", this.select);
      console.log("options", this.options.selected);
    },
    handleChange(e) {
      this.$emit("modelChange", e);
      this.$emit("change", e);
    },
    // 取消选中时调用 删除selected对应的obj
    deselect(e) {
      this.options.selected = this.options.selected.filter((item) => {
        return item.id !== e;
      });
    },
    pannelChange(selectedRow, keys) {
      console.log("submit", selectedRow, keys);
      this.options.selected = selectedRow;
      // outputType 选择输出类型 定义选择输出格式
      const outputArr = new Map([
        ["key", keys],
        ["username", selectedRow.map(item => item.username)],
        ["default", selectedRow]
      ]);
      const data = outputArr.get(this.outputType) || outputArr.get('default')
      console.log(typeof data, data)
      this.$emit("modelChange", data);
      this.$refs.pannel.cancel();
      this.$emit("cancelPannel", data);
    },
  },
  components: {
    GeneralPannel,
  },
};
</script>

<style lang="less" scoped>
.pannel-picker {
  // display: inline-block;
  /deep/ .ant-input[disabled] {
    color: #333;
    background-color: #fff;
  }
}
</style>