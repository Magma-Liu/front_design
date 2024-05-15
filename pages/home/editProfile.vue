<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">修改基本信息</block>
	</cu-custom>

	<view class="container">
		<form @submit.prevent="updateProfile">
			<view class="input-group">
				<text class="label">姓名</text>
				<input class="input-box" v-model="profile.name" placeholder="请输入姓名" />
			</view>
			<view class="input-group">
				<text class="label">手机号</text>
				<input class="input-box" v-model="profile.phone" placeholder="请输入手机号" type="number" />
			</view>
			<view class="input-group">
				<text class="label">密码</text>
				<uni-easyinput type="password" v-model="profile.password" placeholder="请输入新密码"></uni-easyinput>
			</view>
			<button class="btn" type="submit" @click="updateProfile">更新信息</button>
		</form>
	</view>
</template>

<script>
	import LoginAndRegisterAPI from '../../api/LoginAndRegisterAPI';
	export default {
		data() {
			return {
				profile: {
					token: uni.getStorageSync('token'),
					name: '',
					phone: '',
					password: '',
				},
			};
		},
		methods: {
			// 获取当前用户的基本信息
			fetchProfile() {
				LoginAndRegisterAPI.fetchProfileInfo(this.profile.token)
					.then(data => {
						this.profile.name = data.data.name;
						this.profile.phone = data.data.phone;
						this.profile.password = data.data.password;
					})
					.catch(error => {
						uni.showToast({
							title: error,
							icon: 'none',
						});
					});
			},
			updateProfile() {
				LoginAndRegisterAPI.updateProfile(this.profile.token, this.profile.name, this.profile.password, this
						.profile.phone)
					.then(() => {
						uni.showToast({
							title: '更新成功',
							icon: 'success',
						});
						uni.switchTab({
							url: '/pages/home/info'
						});
					})
					.catch(() => {
						uni.showToast({
							title: '更新失败',
							icon: 'none',
						});
					});
			},
		},
		onShow() {
			this.fetchProfile();
		}
	};
</script>

<style scoped lang="scss">
	.container {
		/* padding: 20px; */
		padding: 20rpx 20rpx 0;
	}

	.input-group {
		margin-bottom: 20px;
	}

	.label {
		position: relative;
		padding-left: 18rpx;
		&::before {
			content: "";
			width: 6rpx;
			height: 24rpx;
			background: lightblue;
			border-radius: 8rpx;
			position: absolute;
			left: 0rpx;
			top: 50%;
			transform: translateY(-50%);
		}
	}

	.submit-btn {
		background-color: #007AFF;
		color: white;
		padding: 10px;
		border: none;
	}

	.input-box {
		border: 2rpx solid #e5e5e5;
		border-radius: 8rpx;
		height: 70rpx;
		margin-top: 18rpx;
		padding-left: 20rpx;
	}
</style>