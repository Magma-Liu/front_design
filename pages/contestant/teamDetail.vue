<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">我所管理的队伍信息</block>
	</cu-custom>
	<view v-if="eventID !== -1" class="please">
		<text>请选择申请该活动的队伍</text>
	</view>
	<view class="container">
		<view style="position: relative;" v-for="(team, index) in myTeams" :key="index"
			@click="goToTeamManagement(team.team_id)">
			<view class="item">
				<text class="header">{{ team.name }}</text>
				<text class="dec">{{ team.introduction }} </text>
			</view>
			<view v-if="eventID !== -1">
				<view class="mini-btn" @click.stop="applyEvent(eventID, team.team_id)">申请加入活动</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ContestantAPI from '../../api/ContestantAPI';
	import ActivityAPI from '../../api/ActivityAPI';
	export default {
		data() {
			return {
				myTeams: [],
				eventID: -1,
			};
		},
		onShow() {
			this.fetchMyTeams();
		},
		onLoad(options) {
			if (Object.keys(options).length !== 0) {
				this.eventID = options.eventID;
			}
		},
		methods: {
			// 根据我的id，获取我管理的团队信息，包括队伍名称和队伍头像
			fetchMyTeams() {
				ContestantAPI.fetchMyTeams(uni.getStorageSync('token')).then((res) => {
						this.myTeams = res.data;
					})
					.catch((error) => {
						uni.showToast({
							title: error,
							icon: 'none',
						});
					});
			},
			goToTeamManagement(teamId) {
				uni.navigateTo({
					url: `/pages/contestant/manageTeam?teamId=${teamId}`
				});
			},
			applyEvent(eventID, teamID) {
				ActivityAPI.submitSignUpForm(teamID, eventID).then((res) => {
						if (res.code === 0) {
							uni.showToast({
								title: '申请成功',
								icon: 'success',
							});
							uni.navigateBack();
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
							});
						}
					})
					.catch((error) => {
						uni.showToast({
							title: error,
							icon: 'none',
						});
					});
			},
		},
	};
</script>

<style lang="scss">
	.container {
		padding: 20rpx;
	}

	.team-avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}

	.header {
		position: relative;
		padding-left: 20rpx;
		font-size: 32rpx;
		color: #161616;
		margin-bottom: 10rpx;
		font-weight: 500;

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

	.dec {
		min-height: 88rpx;
		background: #F6F7F9;
		border-radius: 12rpx;
		padding: 10rpx;
		font-size: 28rpx;
		color: #161616;
	}

	.item {
		display: flex;
		flex-direction: column;
		margin-bottom: 30rpx;
	}

	.please {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx 0 10rpx;
		border-bottom: 2rpx dashed #F6F7F9;
	}

	.mini-btn {
		position: absolute;
		right: 20rpx;
		top: 0rpx;

		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4rpx;
		background: #19be6b;
		border-radius: 6rpx;
		color: white;
		border: none;
		font-size: 22rpx;
	}
</style>