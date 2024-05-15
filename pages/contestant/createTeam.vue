<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">创建队伍</block>
	</cu-custom>
	<view class="container">
		<view class="item">
			<view class="key"> 队伍名称 </view>
			<input class="val" type="text" placeholder="请输入队伍名称" v-model="teamName" />
		</view>
		<view class="item">
			<view class="key"> 队伍介绍 </view>
			<textarea maxlength="-1" class="val area" type="text" placeholder="请输入队伍介绍" v-model="introduction" />
		</view>
		<button class="btn" @click="createTeam">发送申请</button>
	</view>
</template>

<script>
	import ContestantAPI from '../../api/ContestantAPI';
	export default {
		data() {
			return {
				teamName: '',
				introduction: '',
				token: uni.getStorageSync('token'),
			};
		},
		methods: {
			createTeam() {
				ContestantAPI.createTeam(this.teamName, this.introduction, this.token)
					.then(res => {
						console.log(res);
						if (res.code === 0) {
							uni.showToast({
								title: "创建成功",
								icon: 'success',
							});
							uni.navigateBack();
						} else {
							uni.showToast({
								title: "创建失败",
								icon: 'none',
							});
						}
					})
			},
		},
	};
</script>

<style lang="scss">
	.container{
		padding: 20rpx 20rpx 0;
	}
	.item {
		display: flex;
		flex-direction: column;
		margin-bottom: 20rpx;

		.key {
			position: relative;
			padding-left: 20rpx;
			font-size: 32rpx;
			color: #161616;
			margin-bottom: 10rpx;

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
			height: 62rpx;
			background: #F6F7F9;
			border-radius: 12rpx;
			padding-left: 12rpx;
			margin-bottom: 10rpx;
		}
		.area{
			width: 100%;
			padding: 10rpx;
			height: 188rpx;
		}
	}
</style>