<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<block slot="backText">退出登录</block>
		<block slot="content">个人信息</block>
	</cu-custom>

	<view class="container">
		<view class="user-info">
			<view class="item">
				<view class="key"> 用户名 </view>
				<view class="val">{{ profile.name }} </view>
			</view>
			<view class="item">
				<view class="key"> 手机号</view>
				<view class="val">{{ profile.phone }} </view>
			</view>
		</view>
		<button class="btn" @click="navigateTo('/pages/home/editProfile')">修改基本信息</button>
		<!-- Contestant -->
		<div v-if="identity === 'Contestant'">
			<!-- 检查用户是否是领队 -->
			<button class="btn" v-if="!profile.isLeader" @click="applyLeader">申请成为队长</button>
			<template v-else>
				<!-- 如果是领队，显示管理团队和创建团队的按钮 -->
				<button class="btn" @click="navigateTo('/pages/contestant/teamDetail')">管理我的团队</button>
				<button class="btn" @click="navigateTo('/pages/contestant/createTeam')">创建队伍</button>
			</template>
		</div>


		<!-- ChiefReferee -->
		<div v-if="identity === 'ChiefReferee'">
			<button class="btn" @click="navigateTo('/pages/chief_referee/manageActivities')">管理活动</button>
			<button class="btn" @click="navigateTo('/pages/chief_referee/manageReferee')">管理裁判</button>
		</div>

		<!-- Admin -->
		<div v-if="identity === 'Admin'">
			<button class="btn" @click="navigateTo('/pages/admin/manageVenue')">管理场地</button>
			<button class="btn" @click="navigateTo('/pages/admin/manageChiefReferee')">管理裁判长</button>
			<button class="btn" @click="navigateTo('/pages/admin/leaderApply')">管理领队申请</button>
			<button class="btn" @click="navigateTo('/pages/admin/addAdmin')">新增管理员</button>
		</div>

		<!-- Referee -->
		<div v-if="identity === 'Referee'">
			<button class="btn" @click="navigateTo('/pages/referee/manageMatch')">管理比赛</button>
		</div>
	</view>
	<tarbar :PageCur="PageCur"></tarbar>
</template>

<script>
import ContestantAPI from '../../api/ContestantAPI';
import LoginAndRegisterAPI from '../../api/LoginAndRegisterAPI';
import tarbar from '../../custom-tab-bar/tarbar.vue';

export default {
	data() {
		return {
			identity: '',
			token: '',
			profile: {
				name: '',
				phone: '',
				isLeader: false,
			},
			PageCur: 'mine'
		};
	},
	onShow() {
		this.identity = uni.getStorageSync('identity');
		this.token = uni.getStorageSync('token');
		this.fetchProfile();
	},
	methods: {
		applyLeader() {
			ContestantAPI.applyLeader(this.token)
				.then((res) => {
					if (res.code === 0) {
						uni.showToast({
							title: '申请成功',
							icon: 'success'
						});
					}
					else {
						uni.showToast({
							title: '申请失败',
							icon: 'none'
						});
					}
				});
		},

		fetchProfile() {
			LoginAndRegisterAPI.fetchProfileInfo(this.token).then(data => {
				if (this.identity === 'Contestant') {
					this.profile.isLeader = data.data.is_leader; // 保存 is_leader 字段
				}
				this.profile.name = data.data.name;
				this.profile.phone = data.data.phone;
			}).catch(error => {
				console.error('Failed to fetch profile:', error);
				uni.showToast({
					title: 'Failed to load profile',
					icon: 'none'
				});
			});
		},
		navigateTo(page) {
			uni.navigateTo({
				url: `${page}`
			});
		},
	},
};
</script>

<style lang="scss">
.container {
	padding: 0 20rpx;
}

.user-info {
	padding: 20rpx 0;

	.item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 30rpx;
		height: 82rpx;
		background: #F6F7F9;
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		padding: 0 20rpx;

		&:nth-child(2) {
			margin-bottom: 0;
		}

		.key {
			font-size: 28rpx;
			color: #161616;
		}

		.val {
			font-size: 28rpx;
			color: #8C8C8C;
		}
	}
}

.btn {
	height: 78rpx;
	background: #7B79FF;
	background: linear-gradient(45deg, #0081ff, #1cbbb4);
	border-radius: 14rpx;
	color: white;
	border: none;
	margin-top: 20rpx;
	font-size: 32rpx;
}
</style>