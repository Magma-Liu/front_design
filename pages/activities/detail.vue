<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">活动详情</block>
	</cu-custom>
	<div class="activity-details">
		<view class="info-item">
			<view class="key"> 活动名称 </view>
			<view class="val"> {{ activity.name }} </view>
		</view>
		<view class="info-item">
			<view class="key"> 活动介绍 </view>
			<view class="val"> {{ activity.introduction }} </view>
		</view>
		<view class="info-item">
			<view class="key"> 活动时间 </view>
			<view class="val"> {{ activity.activity_time }} </view>
		</view>
		<view class="info-item">
			<view class="key"> 场地名称 </view>
			<view class="val"> {{ activity.venue_name }} </view>
		</view>
		<view class="info-item">
			<view class="key"> 场地地址 </view>
			<view class="val"> {{ activity.venue_address }} </view>
		</view>
		<view class="info-item">
			<view class="key"> 需要的区域数量 </view>
			<view class="val"> {{ activity.required_area_count }} </view>
		</view>
		<view class="info-item">
			<view class="key"> 计分制度 </view>
			<view class="val"> {{ activity.scoring_system }} </view>
		</view>
		<view class="info-item">
			<h2 class="header">裁判长信息</h2>
		</view>
		<view class="info-item">
			<view class="key"> 裁判长姓名 </view>
			<view class="val"> {{ activity.chief_referee_name }} </view>
		</view>
		<view class="info-item">
			<view class="key"> 裁判长电话 </view>
			<view class="val"> {{ activity.chief_referee_phone }} </view>
		</view>


	</div>
	<button @click="goToActivityProcess" class="btn">活动进程</button>
	<!-- 如果是领队，则显示报名按钮 -->
	<button class="btn" v-if="isLeader" @click="goToSignUpForm">提交活动报名表</button>
</template>

<script>
	import ActivityAPI from '../../api/ActivityAPI';
	import ContestantAPI from '../../api/ContestantAPI';
	import ChiefRefereeAPI from '../../api/ChiefRefereeAPI';
	export default {
		data() {
			return {
				activity: {}, // 活动详情
				isLeader: false, // 假设这里可以根据用户的角色来判断是否是领队
			};
		},
		onLoad(options) {
			this.fetchActivityDetail(options.id);
			if (uni.getStorageSync('identity') === 'Contestant')
				this.determineIfLeader();
		},
		methods: {
			fetchActivityDetail(id) {
				ActivityAPI.fetchActivityDetail(id)
					.then(data => {
						this.activity = data.data; // 假设返回的data中已包含activity数据
						this.activity.match_types = JSON.parse(this.activity.match_types);

						// 同时获取场地信息和裁判长信息
						return Promise.all([
							ActivityAPI.fetchVenuesByID(this.activity.venue_id),
							ChiefRefereeAPI.fetchChiefRefereeInfo(this.activity.chief_referee_id)
						]);
					})
					.then(([venueInfo, chiefRefereeInfo]) => {
						// 合并场地信息和裁判长信息到活动详情中
						this.activity.venue_name = venueInfo.data.name;
						this.activity.venue_address = venueInfo.data.address;
						this.activity.chief_referee_name = chiefRefereeInfo.data.name;
						this.activity.chief_referee_phone = chiefRefereeInfo.data.phone;

					})
					.catch(error => {
						console.error('Error fetching activity details:', error);
						uni.showToast({
							title: String(error),
							icon: 'none',
						});
					});
			},
			determineIfLeader() {
				const token = uni.getStorageSync('token');
				if (token) {
					ContestantAPI.checkIfLeader(token)
						.then(isLeader => {
							this.isLeader = isLeader.data;
						})
						.catch(error => {
							console.error('Error checking if leader:', error);
							uni.showToast({
								title: 'Error checking leader status',
								icon: 'none'
							});
						});
				} else {
					uni.showToast({
						title: 'No token found',
						icon: 'none'
					});
				}
			},
			goToActivityProcess() {
				uni.navigateTo({
					url: `/pages/activities/match?event=` + JSON.stringify(this.activity)
				});
			},
			goToSignUpForm() {
				uni.navigateTo({
					url: `/pages/contestant/teamDetail?eventID=${this.activity.event_id}`
				});
			}
		},
	};
</script>

<style lang="scss">
	/* 添加CSS样式 */
	.activity-cover {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}

	.detail-info {
		padding: 10px;
	}

	.header {
		position: relative;
		padding-left: 15rpx;
		font-size: 32rpx;
		color: #161616;

		&::before {
			content: "";
			width: 6rpx;
			height: 24rpx;
			background: lightblue;
			border-radius: 8rpx;
			position: absolute;
			left: -5rpx;
			top: 50%;
			transform: translateY(-50%);
		}
	}

	.info-item {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		padding: 0 20rpx;

		.key {
			width: 220rpx;
			font-size: 28rpx;
			color: #161616;
		}

		.val {
			flex: 1;
			font-size: 24rpx;
			color: #8C8C8C;
			background: #F6F7F9;
			border-radius: 8rpx;
			padding: 10rpx 10rpx 10rpx 20rpx;
		}
	}

	.activity-details {
		padding-top: 20rpx;
	}

	.btn {
		width: 710rpx;
		height: 78rpx;
		background: #7B79FF;
		background: linear-gradient(45deg, #0081ff, #1cbbb4);
		border-radius: 14rpx;
		color: white;
		border: none;
		margin-top: 20rpx;
		font-size: 32rpx;
		margin: 20rpx auto 0;
	}
</style>