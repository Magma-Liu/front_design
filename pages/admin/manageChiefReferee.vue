<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">裁判长信息</block>
	</cu-custom>
	<form>
		<view class="cu-form-group">
			<view class="title">姓名</view>
			<input v-model="newJudge.name" placeholder="输入裁判长姓名" name="input" />
		</view>
		<view class="cu-form-group">
			<view class="title">手机号</view>
			<input v-model="newJudge.phone" placeholder="输入手机号" name="input" />
		</view>
		<view class="cu-form-group">
			<view class="title">密码</view>
			<view class="pwd-input" style="position: relative;">
				<input :type="!showPassword ? 'password' : 'text'" v-model="newJudge.password" placeholder="请输入密码" />
				<view class="icon-warp">
					<uni-icons v-if="newJudge.password" class="content-clear-icon"
						:type="showPassword ? 'eye-slash-filled' : 'eye-filled'" :size="24" color="#c0c4cc"
						@click="showPassword = !showPassword"></uni-icons>
					<uni-icons v-if="newJudge.password" class="content-clear-icon clear" type="clear" :size="24"
						color="#c0c4cc" @click="newJudge.password = '', showPassword = false"></uni-icons>
				</view>
			</view>
			<!-- <uni-easyinput :inputBorder="false" type="password" v-model="newJudge.password"
				placeholder="请输入密码"></uni-easyinput> -->
		</view>
		<button @click="uploadJudge" class="btn">
			<text class="cuIcon-upload"></text> 上传信息
		</button>
	</form>

	<view class="judges-list">
		<view v-for="(judge, index) in judges" :key="index" class="judge-item">
			<view class="text-warp">
				<view class="text">
					<view class="key"> 裁判名称： </view>{{ judge.name }}
				</view>
				<view class="text">
					<view class="key">
						联系方式：
					</view> {{ judge.phone }}
				</view>
			</view>
			<view class="btn-warp">
				<view class="mini-btn" @click="editJudge(index)">编辑</view>
				<view class="mini-btn del" @click="deleteJudge(judge.referee_id)">删除</view>
			</view>
		</view>
	</view>
</template>

<script>
import AdminAPI from '../../api/AdminAPI';
export default {
	data() {
		return {
			showPassword: false,
			judges: [],
			newJudge: {
				referee_id: '',
				name: '',
				phone: '',
				password: ''
			},
			editingIndex: -1
		};
	},
	onShow() {
		this.fetchJudges();
	},
	options: {
		styleIsolation: 'shared'
	},
	methods: {
		fetchJudges() {
			AdminAPI.fetchJudges().then(data => {
				this.judges = data.data;
			}).catch(error => {
				uni.showToast({
					title: error,
					icon: 'none',
				});
			});
		},
		uploadJudge() {
			if (this.editingIndex !== -1) {
				AdminAPI.updateJudge(this.newJudge).then((res) => {
					if (res.code === 0) {
						this.fetchJudges();
						this.newJudge = {
							referee_id: '',
							name: '',
							phone: '',
							password: ''
						};
						this.editingIndex = -1;
						uni.showToast({
							title: "更新成功",
							icon: 'success',
						});
					} else {
						uni.showToast({
							title: "更新失败",
							icon: 'none',
						});
					}
				}).catch(error => {
					uni.showToast({
						title: error,
						icon: 'none',
					});
				});
			} else {
				AdminAPI.addJudge(this.newJudge.name, this.newJudge.phone, this.newJudge.password).then((res) => {
					if (res.code === 0) {
						this.fetchJudges();
						this.newJudge = {
							referee_id: '',
							name: '',
							phone: '',
							password: ''
						};
						this.editingIndex = -1;
						uni.showToast({
							title: "添加成功",
							icon: 'success',
						});
					} else {
						uni.showToast({
							title: "添加失败",
							icon: 'none',
						});
					}
				}).catch(error => {
					uni.showToast({
						title: error,
						icon: 'none',
					});
				});
			}
		},
		editJudge(index) {
			// 复制当前裁判长的数据到 newJudge，用于表单编辑
			this.newJudge = {
				...this.judges[index]
			};
			this.newJudge.referee_id = this.judges[index].referee_id;
			this.editingIndex = index;
		},
		deleteJudge(id) {
			AdminAPI.deleteJudge(id).then((res) => {
				if (res.code === 0) {
					uni.showToast({
						title: "删除成功",
						icon: 'success',
					});
					this.fetchJudges();
				} else {
					uni.showToast({
						title: "删除失败",
						icon: 'none',
					});
				}
			}).catch(error => {
				uni.showToast({
					title: error,
					icon: 'none',
				});
			});
		}
	},
};
</script>

<style scoped lang="scss">
.container {
	display: flex;
	flex-direction: column;
	padding: 10px;
}

.add-judge {
	display: flex;
	margin-bottom: 10px;
}

.add-judge input {
	flex: 1;
	margin-right: 10px;
}

.judges-list {
	padding: 20rpx 20rpx 0;
	padding-bottom: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}

.judge-item {
	background: #F6F7F9;
	border-radius: 20rpx 20rpx 20rpx 20rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
}

.judge-item text {
	flex: 1;
}

.pwd-input {
	flex: 1;
	display: flex;
	align-items: center;
}

.title {
	width: 126rpx;
}

.content-clear-icon {
	// position: absolute;
	// top: 50%;
	// right: 90rpx;
	// transform: translateY(-50%);
	// pointer-events: auto;
}

.icon-warp {
	display: flex;
	align-items: center;
	margin-right: 20rpx;

	.clear {
		margin-right: 0;
	}
}

.btn-warp {
	display: flex;
	align-items: center;
	margin-top: 10rpx;

	.mini-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 49%;
		height: 78rpx;
		background: #19be6b;
		border-radius: 14rpx;
		color: white;
		border: none;
		font-size: 32rpx;
		margin: 10rpx auto 0;
	}

	.del {
		background: #909399;
	}
}

.text-warp {
	.text {
		display: flex;
		align-items: baseline;
		font-weight: 500;
		padding: 4rpx 0;

		.key {
			font-size: 28rpx;
			color: #8C8C8C;
			font-weight: normal;
		}
	}
}
</style>