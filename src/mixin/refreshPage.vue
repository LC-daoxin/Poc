<template></template>

<script>
export default {
	data() {
		return {
			targetWindow: null, // 打开的页面window
			pageListenerEvent: null,
			designerUrl: 'http://localhost:8050' // process.env.VUE_APP_DESIGNER_URL
		};
	},
	methods: {
		// 监听表单操作
		pageListener(event) {
			if (event.origin === this.designerUrl) {
				console.log('监听表单操作pageListener', event);
				this.pageListenerEvent = event
			}
		}
	},
	mounted() {
		window.addEventListener('message', this.pageListener);
	},
	beforeDestory() {
		console.log('beforeDestory')
		window.removeEventListener('message');
	}
};
</script>

<style lang="less" scoped>
</style>

