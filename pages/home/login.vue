<template>
	<cu-custom bgColor="bg-gradual-blue">
		<block slot="content">登录</block>
	</cu-custom>

	<view>
		<view class="logo-warp">
			<image class="logo" src="@/static/imgs/logo.jpg"></image>
			<text class="uni-body">欢迎来到羽毛球赛事系统，请登录</text>
		</view>

		<view style="padding: 0 20rpx;">
			<uni-forms>
				<uni-section title="手机号" type="line" padding>
					<uni-easyinput v-model="loginInfo.phone" focus placeholder="请输入手机号" @input="input"></uni-easyinput>
				</uni-section>
				<uni-section title="密码" type="line" padding>
					<uni-easyinput type="password" v-model="loginInfo.password" placeholder="请输入密码"></uni-easyinput>
				</uni-section>
				<uni-section title="身份" type="line" padding>
					<uni-data-select v-model="loginInfo.identity" :localdata="identityOptions"
						:clear="false"></uni-data-select>
				</uni-section>
				&nbsp;&nbsp;
				<view class="login-btn" type="primary" plain="true" @click="login">登录</view>
			</uni-forms>
		</view>

		<view class="footer-warp" v-if="showRegister">
			<view class="footer-btn" @click="goTo('forget')">忘记密码</view>
			<view class="footer-btn" @click="goTo('/pages/home/register')">注册账号
			</view>
		</view>
	</view>
</template>

<script>
import LoginAndRegisterAPI from '../../api/LoginAndRegisterAPI';
export default {
	data() {
		return {
			loginInfo: {
				phone: '',
				password: '',
				identity: 0, // 默认选项，可以根据需求调整
			},
			showRegister: false,
			identityOptions: [{
				value: 0,
				text: '普通用户'
			},
			{
				value: 1,
				text: '裁判长'
			},
			{
				value: 2,
				text: '管理员'
			},
			{
				value: 3,
				text: '普通裁判'
			}
			], // 身份选项，可以根据实际需求调整
		};
	},
	onShow() {
		LoginAndRegisterAPI.getRegister().then(data => {
			this.showRegister = data.data;
		});
	},
	methods: {
		login() {
			LoginAndRegisterAPI.login(this.loginInfo.phone, this.loginInfo.password, this.loginInfo.identity)
				.then(data => {
					uni.setStorageSync('token', data.data);
					this.redirectToHomePage();
				})
				.catch(error => {
					console.log(error);
					uni.showToast({
						title: error,
						icon: 'none',
					});
				});
		},
		redirectToHomePage() {
			const identity = this.loginInfo.identity;
			if (identity == '0') {
				uni.setStorageSync('identity', 'Contestant');
			} else if (identity == '1') {
				uni.setStorageSync('identity', 'ChiefReferee');
			} else if (identity == '2') {
				uni.setStorageSync('identity', 'Admin');
			} else if (identity == '3') {
				uni.setStorageSync('identity', 'Referee');
			}
			uni.switchTab({
				url: '/pages/home/info'
			});
		},
		onIdentityChange(e) {
			this.loginInfo.identity = e.detail.value;
		},
		goTo(page) {
			// 根据传入的page跳转到不同的页面
			uni.redirectTo({
				url: `${page}`
			});
		},
	},
};
</script>

<style lang="scss">
.logo-warp {
	padding: 50rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.logo {
	width: 200rpx;
	height: 200rpx;
	border-radius: 50%;
	margin-bottom: 20rpx;
}

.footer-warp {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 200rpx 20rpx;
	margin-top: 20rpx;
}

.footer-btn {}

.login-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 570rpx;
	height: 88rpx;
	background: #58BE6B;
	border-radius: 90rpx 90rpx 90rpx 90rpx;
	font-size: 32rpx;
	color: #FFFFFF;
	margin: 0 auto;
}

.uni-section-content {
	padding: 0 20rpx;
}
</style>