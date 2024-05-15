<template>
	<cu-custom bgColor="bg-gradual-blue">
		<block slot="content">活动列表</block>
	</cu-custom>
	<view>
		<swiper class="screen-swiper" :class="dotStyle ? 'square-dot' : 'round-dot'" :indicator-dots="true"
			:circular="true" :autoplay="true" interval="5000" duration="500">
			<swiper-item v-for="(item, index) in swiperList" :key="index">
				<image :src="getImageUrl(item.url)" mode="aspectFill" v-if="item.type == 'image'">
				</image>
				<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover"
					v-if="item.type == 'video'"></video>
			</swiper-item>
		</swiper>
	</view>
	<div v-if="identity === 'Admin'">
		<button class="add-btn" @click="navigateToAddActivity('/pages/activities/activitiesTable')">新增活动</button>
	</div>

	<div v-for="(activity, index) in activities" :key="index" @click="goToActivityDetail(activity.event_id)">
		<div class="cu-card article" :class="isCard ? 'no-card' : ''">
			<div class="cu-item shadow">
				<div class="header">{{ activity.name }}</div>
				<div class="content">
					<img v-if="index % 3 == 0" class="cover-image" :src="getImageUrl(4)" mode="aspectFill">
					<img v-if="index % 3 == 1" class="cover-image" :src="getImageUrl(5)" mode="aspectFill">
					<img v-if='index % 3 == 2' class="cover-image" :src="getImageUrl(6)" mode="aspectFill">
					<!-- <img class=".cuIcon-activity"> -->
					<div class="desc">
						<div class="text-sm-dec">活动描述:{{ activity.introduction }}</div>
						<view class="tips">
							<div class="text-sm-name">场馆名称:{{ activity.venue_name }}</div>
							<div class="text-sm-time">活动时间:{{ activity.activity_time }}</div>
						</view>
					</div>
				</div>
				<!-- 仅管理员显示的按钮 -->
				<div v-if="identity === 'Admin'">
					<view class="btn-warp">
						<button class="footer-btn btn-edit" @click.stop="goToEditActivity(index)">编辑</button>
						<button class="footer-btn btn-del" @click.stop="deleteActivity(activity.event_id)">删除</button>
					</view>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ActivityAPI from '../../api/ActivityAPI';
export default {
	data() {
		return {
			identity: '',
			cover: '@/static/imgs/logo.jpg',
			activities: [], // 活动列表
			swiperList: [
				{
					id: 4,
					type: 'image',
					url: '1'
				}, {
					id: 5,
					type: 'image',
					url: '2'
				}, {
					id: 6,
					type: 'image',
					url: '3'
				},
			],
			dotStyle: true,
			PageCur: 'home'
		};
	},
	onShow() {
		this.identity = uni.getStorageSync('identity');
		this.fetchActivities();
	},
	methods: {
		getImageUrl(image) {
			return `${getApp().globalData.baseUrl}/images/${image}.jpeg`;
		},
		fetchActivities() {
			ActivityAPI.fetchActivities()
				.then(data => {
					// 处理每个活动获取场地信息
					const venuePromises = data.data.map(activity => {
						if (activity.venue_id) {
							return ActivityAPI.fetchVenuesByID(activity.venue_id)
								.then(venueData => {
									activity.venue_name = venueData.data.name; // 假设返回的场地信息中有 name
									activity.venue_address = venueData.data
										.address; // 假设返回的场地信息中有 address
									activity.match_types = JSON.parse(activity.match_types);
									return activity; // 返回更新后的活动对象
								})
								.catch(error => {
									console.error('Failed to fetch venue details', error);
									return activity; // 即使场地信息获取失败，也返回原始活动数据
								});
						}
						return Promise.resolve(activity); // 如果没有 venue_id，直接返回原始活动数据
					});
					// 等待所有场地信息获取完成
					Promise.all(venuePromises)
						.then(completedActivities => {
							this.activities = completedActivities;
						})
						.catch(error => {
							console.error('Error in processing activities with venue details', error);
							this.activities = data; // 在错误情况下，使用未添加场地信息的原始数据
						});
				})
				.catch(error => {
					uni.showToast({
						title: String(error),
						icon: 'none',
					});
				});
		},
		deleteActivity(id) {
			ActivityAPI.deleteActivity(id)
				.then((res) => {
					if (res.code == 0) {
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						});
						this.fetchActivities();
					} else {
						uni.showToast({
							title: '删除失败',
							icon: 'none'
						});
					}
				})
				.catch(error => {
					uni.showToast({
						title: error,
						icon: 'none'
					});
				});
		},
		navigateToAddActivity(page) {
			uni.navigateTo({
				url: page
			});
		},

		goToActivityDetail(id) {
			uni.navigateTo({
				url: `/pages/activities/detail?id=${id}`
			});
		},

		goToEditActivity(index) {
			uni.navigateTo({
				url: `/pages/activities/activitiesTable?event=` + JSON.stringify(this.activities[index])
			});
		},
	},
};
</script>

<style lang="scss">
.add-btn {
	width: 710rpx;
	height: 78rpx;
	background: #7B79FF;
	background: linear-gradient(45deg, #0081ff, #1cbbb4);
	border-radius: 14rpx;
	color: white;
	border: none;
	font-size: 32rpx;
	margin: 20rpx auto 0;
}

.content {
	padding: 0 20rpx 20rpx 0;
	margin-top: 20rpx;
}

.text-cut {}

.cover-image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 18rpx;
}

.cu-card.article>.cu-item .title {
	padding: 0;
}

.desc {
	display: flex;
	flex-direction: column;
	padding: 10rpx 0;

}

.text-sm-dec,
.text-sm-name,
.text-sm-time {
	font-size: 28rpx;
}

.text-sm-name,
.text-sm-time {
	color: #909399;
}

.text-grey {}

.text-purple {}

.text-green {}

.btn-warp {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.footer-btn {
	width: 49%;
	height: 78rpx;
	background: linear-gradient(45deg, #0081ff, #1cbbb4);
	border-radius: 14rpx;
	color: white;
	border: none;
	font-size: 32rpx;
	margin: 10rpx auto 0;
}

.btn-edit {
	background: #18b566;
}

.btn-del {
	background: #909399;
}

.header {
	position: relative;
	padding-left: 20rpx;
	font-size: 32rpx;
	color: #161616;

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
</style>