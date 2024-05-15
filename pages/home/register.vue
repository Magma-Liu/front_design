<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">注册用户</block>
	</cu-custom>
	<form>
		<view class="cu-form-group">
			<view class="title">姓名</view>
			<input v-model="userInfo.name" placeholder="输入姓名" name="input" />
		</view>
		<view class="cu-form-group">
			<view class="title">手机号</view>
			<input v-model="userInfo.phone" placeholder="输入手机号" name="input" />
		</view>
		<view class="cu-form-group">
			<view class="title">密码</view>
			<view class="pwd-input" style="position: relative;">
				<input :type="!showPassword ? 'password' : 'text'" v-model="userInfo.password" placeholder="请输入密码" />
				<view class="icon-warp">
					<uni-icons v-if="userInfo.password" class="content-clear-icon"
						:type="showPassword ? 'eye-slash-filled' : 'eye-filled'" :size="24" color="#c0c4cc"
						@click="showPassword = !showPassword"></uni-icons>
					<uni-icons v-if="userInfo.password" class="content-clear-icon clear" type="clear" :size="24"
						color="#c0c4cc" @click="userInfo.password = '', showPassword = false"></uni-icons>
				</view>
			</view>
			<!-- <uni-easyinput type="password" v-model="userInfo.password" placeholder="请输入密码"></uni-easyinput> -->
		</view>
		<button @click="register" class="btn">
			<text class="cuIcon-add"></text> 注册
		</button>
	</form>
	<!-- <view class="container">
		<view class="form-item">
			<input type="text" placeholder="请输入手机号" v-model="userInfo.phone" />
		</view>
		<view class="form-item">
			<input type="password" placeholder="请输入密码" v-model="userInfo.password" />
		</view>
		<view class="form-item">
			<input type="text" placeholder="请输入名称" v-model="userInfo.name" />
		</view>
		<button @click="register">注册</button>
	</view> -->
</template>

<script>
import LoginAndRegisterAPI from '../../api/LoginAndRegisterAPI';
export default {
	data() {
		return {
			showPassword: false,
			userInfo: {
				phone: '',
				password: '',
				name: '',
			},
		};
	},
	methods: {
		register() {
			LoginAndRegisterAPI.register(this.userInfo.phone, this.userInfo.password, this.userInfo.name)
				.then(data => {
					const token = data.data;
					uni.setStorageSync('token', token);
					uni.setStorageSync('identity', 'Contestant');
					// 根据业务需求跳转到相应页面
					uni.switchTab({
						url: '/pages/home/info'
					});
				})
				.catch(error => {
					uni.showToast({
						title: error,
						icon: 'none',
					});
				});
		},
	},
};
</script>

<style scoped lang="scss">
.pwd-input {
	flex: 1;
	display: flex;
	align-items: center;
}

.icon-warp {
	display: flex;
	align-items: center;
	margin-right: 20rpx;

	.clear {
		margin-right: 0;
	}
}
</style>
