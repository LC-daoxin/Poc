<template>
	<div class="pannel-picker">
		<a-input-group compact>
			<a-select
				v-show="showSelect"
				:mode="selectMultiple ? 'multiple': ''"
				:value="select"
				style="width: calc(100% - 64px)"
				placeholder="选择用户"
				@change="handleChange"
			>
				<a-select-option v-for="item in options.selected" :key="item.value">
					{{ item.label }}
				</a-select-option>
			</a-select>
			<a-button type="primary" @click="openPannel">选择</a-button>
		</a-input-group>
		<component
			ref="pannel"
			class="pannel"
			:is="pannel"
			:customParams="customParams"
			:multiple="selectMultiple"
			@change="pannelChange"
		></component>
	</div>
</template>

<script>
import RolePannel from './RolePannel.vue';
import DepartmentPannel from './DepartmentPannel.vue';
import PostPannel from './PostPannel.vue';
import UserPannel from './UserPannel.vue';
import UserGroupPannel from './UserGroupPannel.vue';

export default {
	props: {
		// value: String,
		pannel: {
			type: String,
			default: 'UserPannel',
		},
		customParams: {
			type: Object,
			required: true,
		},
		selectMultiple: {
			type: Boolean,
			default: true,
		},
    showSelect: {
      type: Boolean,
      default: true
    },
    options: {
      type: Object,
      default: () => {
        return {
          selected: []
        }
      }
    },
    select: [String, Number, Array], // v-model='select'
    value: [String, Number, Array] // 默认值
	},
  model: {
    prop: 'select',
    event: 'modelChange'
  },
  mounted() {
    this.$emit('modelChange', this.value) // 设置默认值
  },
	data() {
		return {
			// selected: [],
		};
	},
	methods: {
		openPannel() {
			this.$refs.pannel.open();
		},
    handleChange(e) {
      this.$emit('modelChange', e)
      this.$emit('input', e)
    },
		pannelChange(selectedRowKeys, selectedRow) {
		  console.log(selectedRow)
			const ids = [];
			const names = [];
      this.options.selected = [];
			for (let item of selectedRow) {
				ids.push(item[this.customParams.id]);
				names.push(item[this.customParams.name]);
        this.options.selected.push({
	        value: item[this.customParams.id],
	        label: item[this.customParams.name]
        })
			}
			this.$emit('modelChange', ids);
			this.$refs.pannel.cancel();
		},
	},
	components: {
		RolePannel,
		DepartmentPannel,
		PostPannel,
		UserPannel,
		UserGroupPannel,
	},
};
</script>

<style scoped>
.pannel-picker >>> .ant-input[disabled] {
	color: #333;
	background-color: #fff;
}
</style>