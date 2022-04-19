<template>
	<div class="choose-icon-wrapper">
		<div class="icon-preview">
			<a-icon :type="value || selected" style="font-size: 16px"></a-icon>
		</div>
		<a-button type="primary" size="small" icon="select" @click="chooseIcon">选择图标</a-button>
		<a-button :disabled="!selected" size="small" icon="delete" style="margin-left: 5px;" @click="clearIcon"
			>清空</a-button
		>
		<icon-pannel :selected="value || selected" @select="iconSelected" ref="iconPannel"></icon-pannel>
	</div>
</template>

<script>
import IconPannel from './IconPannel.vue';
export default {
	props: {
		value: String
	},
	data() {
		return {
			selected: ''
		};
	},
	methods: {
		chooseIcon() {
			this.$refs.iconPannel.open();
		},
		clearIcon() {
			this.selected = '';
			this.$emit('input', '');
		},
		iconSelected(icon) {
			this.selected = icon;
			this.$emit('input', icon);
		}
	},
	mounted() {
		this.$nextTick(() => {
			if (this.value) this.selected = this.value;
		});
	},
	components: {
		IconPannel
	}
};
</script>

<style scoped>
.choose-icon-wrapper {
	display: flex;
	align-items: center;
}
.icon-preview {
	width: 50px;
	height: 40px;
	padding-left: 10px;
}
</style>
