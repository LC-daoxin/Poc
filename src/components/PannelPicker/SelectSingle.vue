<template>
  <div class="pannel-picker">
    <a-input-group compact>
      <a-input
        style="width: calc(100% - 64px)"
        :value="obj.name"
        :placeholder="placeholder"
        disabled
      />
      <a-button type="primary" @click="openPannel">{{ disabled ? disabledBtnText : btnText }}</a-button>
    </a-input-group>
    <general-pannel
      ref="pannel"
      class="pannel"
      :options="options"
      :typeList="typeList"
      :disabled="disabled"
      :multiple="selectMultiple"
      @change="pannelChange"
    />
  </div>
</template>

<script>
import GeneralPannel from "./GeneralPannel.vue";
export default {
  props: {
    typeList: {
      type: Array,
      default: () => [1],
    },
    typeName: {
      type: String,
      default: "user",
    },
    selectMultiple: {
      type: Boolean,
      default: true,
    },
    disabledBtnText: {
      type: String,
      default: "查看",
    },
    btnText: {
      type: String,
      default: "选择",
    },
    placeholder: {
      type: String,
      default: "",
    },
    showInputValue: {
      type: String,
      default: 'name'
    },
    options: {
      type: Object,
      default: () => {
        return {
          selected: [],
        };
      },
    },
    disabled: { // 是否禁止编辑
      type: Boolean,
      default: false
    },
    select: [String, Number, Array, Object], // v-model='select'
    value: [String, Number, Array, Object], // 默认值
  },
  model: {
    prop: "select",
    event: "modelChange",
  },
  watch: {
    select: {
      handler(newVal, oldVal) {
        if (Array.isArray(newVal) && newVal.length > 0) {
          this.setObjName();
        } else {
          this.obj = {
            name: "",
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    console.log("options", this.options);
    if (this.value) {
      this.$emit("modelChange", this.value); // 设置默认值
    }
  },
  data() {
    return {
      obj: {
        name: "",
      },
    };
  },
  methods: {
    // 打开选择
    openPannel() {
      this.$emit("openPannel");
      this.$refs.pannel.open(this.typeName);
      console.log("打开选择", this.select, this.options);
      if (!this.select) {
        this.options.selected = [];
      }
      if (!this.selectMultiple && this.select) {
        console.log("单选", this.select);
      } else if (this.selectMultiple && this.select) {
        console.log("多选", this.select);
      }
      this.options.selected = this.select;
    },
    // 选择确认
    pannelChange(selectedRow, keys) {
      if (!this.selectMultiple) {
        this.obj = selectedRow[0];
        this.options.selected = selectedRow;
        this.$emit("modelChange", selectedRow);
      } else {
        this.setObjName()
        this.options.selected = selectedRow;
        this.$emit("modelChange", selectedRow);
      }
      console.log("选择确认", this.obj, selectedRow, keys);
      this.$refs.pannel.cancel();
      this.$emit("cancelPannel");
    },
    // 设置显示名称
    setObjName() {
      console.log("设置显示名称", this.select);
      let names = [];
      this.select?.forEach((item) => {
        names.push(item[this.showInputValue]);
      });
      this.obj.name = names.join(",");
    },
  },
  components: {
    GeneralPannel,
  },
};
</script>

<style scoped>
</style>