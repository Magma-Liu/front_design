<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">场地信息</block>
	</cu-custom>
	<view class="container">
		<view class="add-venue">
			<view class="item">
				<view class="header">场地名称</view>
				<input class="input" v-model="newVenue.name" placeholder="输入场地名称" />
			</view>
			<view class="item">
				<view class="header">场地地址</view>
				<input class="input" v-model="newVenue.address" placeholder="输入场地地址" />
			</view>
			<view class="item">
				<view class="header">区域数量</view>
				<input class="input" v-model="newVenue.area_count" placeholder="输入区域数量" type="number" />
			</view>
			<view class="btn-warp">
				<button class="btn save" @click="editingIndex === -1 ? addVenue() : updateVenue()">保存场地</button>
				<button class="btn" @click="resetForm()">取消编辑</button>
			</view>
		</view>
		<view class="venues-list">
			<view v-for="(venue, index) in venues" :key="venue.venue_id" class="venue-item">
				<view class="top">
					<text class="name">{{ venue.name }}： {{ venue.address }}</text>
				</view>
				<view class="bottom">
					<text>区域数：{{ venue.area_count }}</text>
					<view class="btn-warp">
						<!-- <text>{{ venue.name }} - {{ venue.address }} - 区域数: {{ venue.area_count }}</text> -->
						<view class="mini-btn" @click="editVenue(index)">编辑</view>
						<view class="mini-btn del" @click="deleteVenue(venue.venue_id)">删除</view>
					</view>
				</view>
				<!-- <view class="text-warp">
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
import AdminAPI from '../../api/AdminAPI';

export default {
	data() {
		return {
			venues: [],
			newVenue: {
				name: '',
				address: '',
				area_count: 0
			},
			editingIndex: -1
		};
	},
	onShow() {
		this.fetchVenues();
	},
	methods: {
		fetchVenues() {
			AdminAPI.fetchVenues().then(data => {
				this.venues = data.data;
			}).catch(error => {
				console.error("Error fetching venues:", error);
			});
		},
		addVenue() {
			AdminAPI.addVenue(this.newVenue).then((res) => {
				this.fetchVenues();
				this.resetForm();
			}).catch(error => {
				console.error("Error adding venue:", error);
			});
		},
		editVenue(index) {
			this.newVenue = {
				...this.venues[index]
			};
			this.editingIndex = index;
		},
		updateVenue() {
			AdminAPI.updateVenue(this.venues[this.editingIndex].venue_id, this.newVenue).then((res) => {
				if (res.code === 0) {
					this.fetchVenues();
					this.resetForm();
				} else
					uni.showToast({
						title: "操作失败",
						icon: 'none'
					});
			}).catch(error => {
				console.error("Error updating venue:", error);
			});
		},
		deleteVenue(id) {
			AdminAPI.deleteVenue(id).then((res) => {
				if (res.code === 0) {
					this.fetchVenues();
				} else
					uni.showToast({
						title: "删除失败",
						icon: 'none'
					});
			}).catch(error => {
				console.error("Error deleting venue:", error);
			});
		},
		resetForm() {
			this.newVenue = {
				name: '',
				address: '',
				area_count: 0
			};
			this.editingIndex = -1;
		}
	},
};
</script>

<style scoped lang="scss">
.container {
	display: flex;
	flex-direction: column;
	padding: 10px;

	.btn-warp {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.btn {
		width: 49%;
		height: 78rpx;
		background: #909399;
		border-radius: 14rpx;
		color: white;
		border: none;
		font-size: 32rpx;
		margin: 10rpx auto 0;
	}

	.save {

		background: linear-gradient(45deg, #0081ff, #1cbbb4);
	}
}

.add-venue {
	display: flex;
	flex-direction: column;
	margin-bottom: 10px;
}

.add-venue input {
	margin-bottom: 5px;
}

.venues-list {}

.venue-item {
	// display: flex;
	// align-items: center;
	// margin-bottom: 5px;
	margin: 10rpx 0;
	padding: 10rpx 0;
	border-bottom: 2rpx dashed #dcdfe6;
}

.venue-item text {
	// flex: 1;
}

.input {
	border: 2rpx solid #e5e5e5;
	border-radius: 8rpx;
	height: 70rpx;
	margin-top: 18rpx;
	padding-left: 20rpx;
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

.top {}

.bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 20rpx;

	text {
		font-size: 28rpx;
		color: #909399;
	}

	.btn-warp {
		.mini-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			color: #ffffff;
			font-size: 24rpx;
			width: 80rpx;
			height: 40rpx;
			background: #19be6b;
			border-radius: 6rpx;
			margin-left: 8rpx;
		}

		.del {
			background: #909399;
		}
	}
}
</style>