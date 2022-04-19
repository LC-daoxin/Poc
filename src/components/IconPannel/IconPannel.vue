<template>
	<a-modal :visible="visible" :footer="false" width="800px" @cancel="cancel">
		<h3 class="selected">当前已选择：<a-icon :type="selected"></a-icon></h3>
		<div class="icon-list-wrapper">
			<a-collapse default-active-key="1" :bordered="false">
				<template #expandIcon="props">
					<a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
				</template>
				<template v-for="item of icons">
					<a-collapse-panel :key="item.id" :header="item.classifyName">
						<div class="icon-wrapper">
							<template v-for="child of item.children">
								<div
									:key="child"
									class="icon-block"
									:class="{'icon-active': selected === child}"
									@click="select(child)"
								>
									<a-icon class="icon" :type="child"></a-icon>
									<span class="icon-title">{{ child }}</span>
								</div>
							</template>
						</div>
					</a-collapse-panel>
				</template>
			</a-collapse>
		</div>
	</a-modal>
</template>

<script>
import icons from './icons.js';

export default {
	props: {
		selected: String,
	},
	data() {
		return {
			icons,
			visible: false,
		};
	},
	methods: {
		open() {
			this.visible = true;
		},
		cancel() {
			this.visible = false;
		},
		select(child) {
			this.$emit('select', child);
		},
	},
};
</script>

<style scoped>
.selected {
	font-size: 18px;
	background-color: #eaeaea;
	margin: 20px 20px 0;
	padding: 10px;
	border-radius: 4px;
}
.icon-wrapper {
	display: flex;
	flex-wrap: wrap;
}
.icon-list-wrapper {
	padding: 10px;
}
.icon-list-wrapper >>> .ant-collapse-header {
	font-size: 18px;
	font-weight: bold;
}
.icon-list-wrapper >>> .ant-collapse-item {
	border-bottom: 0;
}
.ant-collapse-borderless {
	background-color: #fff;
}
.icon-block {
	width: 16.66%;
	text-align: center;
	list-style: none;
	cursor: pointer;
	height: 100px;
	color: #555;
	transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
	position: relative;
	margin: 3px 0;
	border-radius: 4px;
	background-color: #fff;
	overflow: hidden;
	padding: 10px 0 0;
}
.icon-block:hover {
	background-color: #1890ff;
	color: #fff;
}
.icon-active {
	background-color: #1890ff;
	color: #fff;
}
.icon-block:hover .icon {
	transform: scale(1.4);
}
.icon {
	font-size: 36px;
	margin: 12px 0 8px;
	transition: transform 0.3s ease-in-out;
	will-change: transform;
}
.icon-title {
	display: block;
	text-align: center;
	transform: scale(0.83);
	font-family: Lucida Console, Consolas;
	white-space: nowrap;
}
</style>
