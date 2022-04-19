/*
 * @Author: Lince 
 * @Date: 2021-05-27 13:50:22 
 * @Last Modified by: Lince
 * @Last Modified time: 2021-06-21 16:52:22
 */

<template>
  <span class="pannel-picker">
    <a-button
      class="selectBtn"
      :icon="rowObj[type].length > 0 ? 'check-circle' : 'plus'"
      size="small"
      :type="rowObj[type].length > 0 ? 'primary' : 'dashed'"
      @click="openPannel"
    >
      {{ rowObj[type].length > 0 ? "已选择" : selectName }}
    </a-button>
    <general-pannel
      ref="pannel"
      class="pannel"
      :options="options"
      :multiple="selectMultiple"
      @change="pannelChange"
    />
  </span>
</template>
<script>
import GeneralPannel from "./GeneralPannel.vue";

export default {
  props: {
    rowObj: {
      type: Object,
    },
    type: {
      // approver 审批人 copied 抄送人
      type: String,
      default: "approver",
    },
    selectName: {
      type: String,
      default: "审批人",
    },
    selectMultiple: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      options: {
        selected: [],
      },
    };
  },
  methods: {
    openPannel() {
      this.options.selected = this._.cloneDeep(this.rowObj[this.type]); // 把已选择的人员重新绑定到组件上
      this.$refs.pannel.open();
      console.log("rowObj", this.rowObj);
    },
    pannelChange(selectedRow, keys) {
      console.log("submit", selectedRow, keys);
      const oldSelected = this._.cloneDeep(this.rowObj)[this.type] // 上次选择的审批人
      let different = false
      let arr1 = oldSelected.map(function(item, index, array){
        return item.id
      })
      let arr2 = selectedRow.map(function(item, index, array){
        return item.id
      })
      let intersection = arr1.filter(function(item){
        return arr2.indexOf(item)!== (-1)
      })
      if (intersection.length > 0) {
        different = true
      }
      console.log(arr1, arr2, intersection, different)
      this.rowObj[this.type] = selectedRow;
      this.$emit('changeApprover', this.rowObj, selectedRow, different)
      this.$refs.pannel.cancel();
    },
  },
  components: {
    GeneralPannel,
  },
};
</script>

<style scoped>
.selectBtn {
  margin-left: 10px;
}
</style>