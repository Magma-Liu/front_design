<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">申请加入活动的队伍信息</block>
	</cu-custom>
	<view class="applications-list">
		<view v-for="(application, index) in applications" :key="index" class="application-item">
			<view class="item">
				<view class="text">
					<view class="key">申请人</view>
					<view class="val">{{ application.name }} ({{ application.introduction }})</view>
				</view>
				<view class="btn-warp" v-if="application.is_approved === null">
					<button class="mini-btn" @click="approveApplication(application.team_id)">同意</button>
					<button class="mini-btn reject-btn" @click="rejectApplication(application.team_id)">拒绝</button>
				</view>
				<view v-else class="state-warp">
					<text class="state" v-if="application.is_approved">已同意</text>
					<text class="state state-reject" v-else>已拒绝</text>
					<button class="btn reject-btn" v-if="application.is_approved"
						@click="rejectApplication(application.team_id)">改为拒绝</button>
					<button class="btn" v-else @click="approveApplication(application.team_id)">改为同意</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ContestantAPI from '../../api/ContestantAPI';
	import ChiefRefereeAPI from '../../api/ChiefRefereeAPI';
	export default {
		data() {
			return {
				applications: [],
				event: {},
			};
		},
		onLoad(params) {
			if (params) {
				this.event = JSON.parse(params.event)
			}
			this.fetchApplications();
		},
		methods: {
			async fetchApplications() {
				try {
					const data = await ChiefRefereeAPI.fetchApplications(this.event.event_id);
					const applications = data.data;
					const promises = applications.map(async application => {
						const profileInfo = await ContestantAPI.fetchTeamInfo(application.team_id);
						application.name = profileInfo.data.name;
						application.introduction = profileInfo.data.introduction;
						return application;
					});
					this.applications = await Promise.all(promises);
				} catch (error) {
					console.error('Failed to fetch applications:', error);
					uni.showToast({
						title: error,
						icon: 'none',
					});
				}
			},

			approveApplication(teamId) {
				ChiefRefereeAPI.approveTeamApplication(this.event.event_id, teamId)
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
			rejectApplication(teamId) {
				ChiefRefereeAPI.rejectTeamApplication(this.event.event_id, teamId)
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
	.applications-list {
		padding: 20rpx;
	}

	.item {
		position: relative;
		background: #F6F7F9;
		border-radius: 8rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;

		.text {

			.key {
				position: relative;
				font-size: 28rpx;
				color: #161616;
				font-weight: bold;
				padding-left: 15rpx;

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

			.val {
				font-size: 32rpx;
				color: #161616;
				margin-top: 12rpx;
			}
		}

		.btn-warp {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 20rpx;

			.mini-btn {
				width: 49%;
				height: 78rpx;
				background: #19be6b;
				border-radius: 14rpx;
				color: white;
				border: none;
				font-size: 32rpx;
				margin: 10rpx auto 0;
			}

			.reject-btn {
				background: #fa3534;
			}
		}
	}

	.state-warp {

		.state {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
			font-size: 28rpx;
			color: #19be6b;
		}

		.state-reject {
			color: #fa3534;
		}

		.btn {
			width: auto;
			background: #19be6b;
		}

		.reject-btn {
			background: #fa3534;
		}
	}
</style>