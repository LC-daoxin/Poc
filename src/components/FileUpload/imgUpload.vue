<template>
	<div class="img">
		<div class="upload">
			<div class="file-upload">
				<a-icon class="icon" type="plus" />
				<div class="file-upload-text">{{ text }}</div>
				<input
					:disabled="uploadLoading"
					class="file-upload-input"
					type="file"
					accept="image/*"
					@change="handleFileChange($event, 1)"
				/>
			</div>
			<a-button v-show="false" @click="handleUpload">上传</a-button>
			<div v-show="imgUrl" class="imgShow">
				<a-spin :spinning="uploadLoading">
					<img :src="imgUrl" />
				</a-spin>
				<div class="seen-show">
					<a-icon class="eye" type="eye" @click="watch" />
					<a-icon class="delete" type="delete" @click="handleDelete" />
				</div>
			</div>
		</div>
		<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
			<img alt="example" style="width: 100%" :src="imgUrl" />
		</a-modal>
	</div>
</template>

<script>
import documentManage from '@/api/documentCenter/documentManage.js';
export default {
	name: 'imgUpload',
	data() {
		return {
			imgUrl: '',
			imgId: null,
			uploadLoading: false,
			previewVisible: false
		};
	},
	props: {
		imageUrl: {
			type: String,
			required: false
		},
		text: {
			type: String,
			required: false,
			default: '上传图片'
		},
		isDirectDel: {
			// 是否直接删除上传到后台的图片 或 虚拟删除
			type: Boolean,
			default: false
		}
	},
	watch: {
		imageUrl: {
			deep: true,
			immediate: true,
			handler(val) {
				this.imgUrl = val;
			}
		}
	},
	methods: {
		// 选择照片
		handleFileChange(e, type) {
			this.showType = type;
			this.file = null;
			const [file] = e.target.files;
			if (!file) return;
			this.file = file;
			this.uploadLoading = true;
			this.handleUpload();
		},
		async handleUpload() {
			if (!this.file) return;
			let formData = new FormData();
			formData.append('file', this.file);
			await documentManage
				.uploadTitle(formData)
				.then((res) => {
					const {code, msg, data} = res;
					console.log(res);
					if (code === '0001') {
						this.imgUrl = data.relativeRequestUrl;
						this.imgId = data.id;
						this.$emit('success', this.imgUrl);
					} else {
						this.$message.error(msg);
					}
					this.uploadLoading = false;
				})
				.catch((err) => {
					this.uploadLoading = false;
				});
		},
		async handleDelete() {
			if (this.imgId) {
				if (this.isDirectDel) {
					await this.realDel(this.imgId);
				} else {
					await this.fakeDel(this.imgId);
				}
			}
			this.imgUrl = '';
			this.imgId = null;
			this.$emit('success', this.imgUrl);
		},
		realDel(id) {
			return new Promise((resolve, reject) => {
				documentManage.delete({ids: id}).then((res) => {
					const {code, msg} = res;
					if (code === '0001') {
						resolve();
					} else {
						reject(res);
					}
				});
			});
		},
		fakeDel(id) {
			return new Promise((resolve, reject) => {
				let params = {id: id, bizType: 'system', delFlag: 1};
				documentManage.update(params).then((res) => {
					const {code} = res;
					if (code === '0001') {
						resolve();
					} else {
						reject(res);
					}
				});
			});
		},
		watch() {
			this.previewVisible = true;
		},
		handleCancel() {
			this.previewVisible = false;
		}
	}
};
</script>

<style lang="less" scoped>
.upload {
	display: flex;
	flex-direction: row;
	.file-upload {
		width: 104px;
		height: 104px;
		display: flex;
		position: relative;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		background-color: #fafafa;
		border: 1px dashed #d9d9d9;
		border-radius: 4px;
		cursor: pointer;
		transition: border-color 0.3s ease;
		font-size: 12px;
		&:hover {
			border-color: #1890ff;
		}
		.file-upload-text {
			font-size: 12px;
			height: 14px;
			line-height: 14px;
			margin-top: 5px;
		}
		.icon {
			color: #999999;
			font-size: 32px;
			font-weight: 700;
		}
		.file-upload-input {
			background-color: transparent;
			position: absolute;
			width: 999px;
			height: 999px;
			top: -10px;
			right: -10px;
			cursor: pointer;
			&:focus {
				outline: none !important;
			}
		}
	}
	.imgShow {
		width: 104px;
		height: 104px;
		overflow: hidden;
		border: 1px dashed #d9d9d9;
		border-radius: 4px;
		margin-left: 10px;
		position: relative;
		&:hover .seen-show {
			display: flex;
		}
		.seen-show {
			display: none;
			position: absolute;
			left: 0;
			top: 0;
			width: 104px;
			height: 104px;
			color: #fff;
			background: rgba(0, 0, 0, 0.2);
			line-height: 40px;
			justify-content: center;
			align-items: center;
			i {
				font-size: 18px;
				font-weight: 700;
				cursor: pointer;
			}
			.eye {
			}
			.delete {
				margin-left: 15px;
			}
		}
		img {
			width: 104px;
			height: 104px;
		}
	}
}
</style>