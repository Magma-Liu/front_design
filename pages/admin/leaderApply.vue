<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">领队申请信息</block>
	</cu-custom>
	<view class="applications-list">
		<view v-for="(application, index) in applications" :key="index" class="application-item">
			<view class="item">
				<view class="key">申请人: </view>
				<view class="val"> {{ application.name }} ({{ application.phone }}) </view>
			</view>
			<view class="item">
				<view class="key">申请时间: </view>
				<view class="val"> {{ application.application_time }} </view>
			</view>
			<view v-if="application.approval_time === null" class="btn-warp">
				<view class="mini-btn" @click="approveApplication(application.contestant_id, admin_token)">同意</view>
				<view class="mini-btn reject-btn" @click="rejectApplication(application.contestant_id, admin_token)">拒绝
				</view>
			</view>
			<view v-else>
				<view class="item">
					<view class="key">处理人: </view>
					<view class="val"> {{ application.admin_name }} ({{ application.admin_phone }})</view>
				</view>
				<view class="item">
					<view class="key">处理时间: </view>
					<view class="val"> {{ application.approval_time }} </view>
				</view>
				<text class="state" v-if="application.is_approved">已同意</text>
				<text class="state reject-state" v-else>已拒绝</text>
			</view>
		</view>
	</view>
</template>

<script>
	import AdminAPI from '../../api/AdminAPI';
	import ContestantAPI from '../../api/ContestantAPI';
	export default {
		data() {
			return {
				applications: [],
				admin_token: '',
			};
		},
		onShow() {
			this.fetchApplications();
			this.admin_token = uni.getStorageSync('token');
		},
		methods: {
			fetchApplications() {
				AdminAPI.fetchApplications().then(data => {
					const applications = data.data;
					const promises = applications.map(application => {
						return this.handleApplication(application);
					});

					Promise.all(promises).then((applicationsInfo) => {
						this.applications = applicationsInfo;
					}).catch(error => {
						uni.showToast({
							title: error,
							icon: 'none',
						});
					});
				}).catch(error => {
					uni.showToast({
						title: error,
						icon: 'none',
					});
				});
			},

			handleApplication(application) {
				return ContestantAPI.fetchProfileInfo(application.contestant_id)
					.then(profileInfo => {
						application.name = profileInfo.data.name;
						application.phone = profileInfo.data.phone;

						if (application.approval_time) {
							return AdminAPI.fetchAdminInfo(application.admin_id)
								.then(adminInfo => {
									application.admin_name = adminInfo.data.name;
									application.admin_phone = adminInfo.data.phone;
									return application;
								});
						} else {
							return application;
						}
					});
			},
			approveApplication(contestant_id, admin_token) {
				AdminAPI.approveApplication(contestant_id, admin_token)
					.then(() => {
						uni.showToast({
							title: '已同意申请',
							icon: 'success',
						});
						this.fetchApplications(); // 重新获取申请信息
					}).catch(error => {
						uni.showToast({
							title: error,
							icon: 'none',
						});
					});
			},
			rejectApplication(contestant_id, admin_token) {
				AdminAPI.rejectApplication(contestant_id, admin_token)
					.then(() => {
						uni.showToast({
							title: '已拒绝申请',
							icon: 'success',
						});
						this.fetchApplications(); // 重新获取申请信息
					}).catch(error => {
						uni.showToast({
							title: error,
							icon: 'none',
						});
					});
			},
		}
	};
</script>

<style scoped lang="scss">
	.container {
		/* display: flex; */
		/* flex-direction: column; */
		/* padding: 10px; */
		// padding: 0 20rpx;
	}

	.applications-list {
		padding: 20rpx 20rpx 0;
		/* display: flex;
		flex-direction: column; */
	}

	.item {
		position: relative;
		display: flex;
		align-items: baseline;
		padding: 10rpx 0;

		.key {
			font-size: 28rpx;
			color: #161616;
			// margin: 20rpx 0;
			// padding-left: 20rpx;
		}

		.val {
			font-size: 32rpx;
			color: #161616;
			margin-left: 8rpx;
			// height: 82rpx;
			// background: #F6F7F9;
			// border-radius: 20rpx 20rpx 20rpx 20rpx;
			// padding: 0 20rpx;
			// line-height: 82rpx;

		}
	}

	.application-item {
		position: relative;
		background: #F7F7FF;
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		margin-bottom: 20rpx;
		padding: 20rpx;

	}

	.state {
		position: absolute;
		right: 30rpx;
		top: 30rpx;
		color: #19be6b;
		font-size: 24rpx;
	}

	.reject-state {
		color: #fa3534;
	}

	.btn-warp {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.mini-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 49%;
			height: 78rpx;
			background: linear-gradient(45deg, #0081ff, #1cbbb4);
			border-radius: 14rpx;
			color: white;
			border: none;
			font-size: 32rpx;
			margin: 10rpx auto 0;
		}

		.reject-btn {
			background: #909399;
		}
	}
</style>