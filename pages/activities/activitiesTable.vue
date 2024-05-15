<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">活动信息</block>
	</cu-custom>
	<view class="warp">
		<form>
			<view class="cu-form-group">
				<view class="title">活动名称</view> 
				<input class="ipt" maxlength="-1" placeholder="请输入活动名称" v-model="name" />
			</view>
			<view class="cu-form-group area-warp">
				<view class="title">活动介绍</view> <textarea class="area" maxlength="-1" placeholder="请输入活动介绍"
					v-model="eventDescription"></textarea>
			</view>
			<view class="cu-form-group">
				<view class="title">场地数量</view> <input class="ipt" placeholder="请输入场地数量" v-model="venueCount"
					type="number" />
			</view>
			<div v-if="identity !== 'ChiefReferee'">
				<view class="cu-form-group margin-top">
					<view class="title">活动负责人</view>
					<picker @change="pickerChange('chief', $event)" :value="chiefIndex" :range="chiefsName"
						class="picker">
						<view class="picker"> {{ chiefIndex > -1 ? chiefsName[chiefIndex] : '选择裁判长'
                        }} </view>
					</picker>
				</view>
			</div>
			<view class="cu-form-group">
				<view class="title">活动场地</view>
				<picker @change="pickerChange('venue', $event)" :value="venueIndex" :range="venuesName">
					<view class="picker"> {{ venueIndex > -1 ? venuesName[venueIndex] : '选择场馆' }} </view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">计分制度</view>
				<picker @change="pickerChange('scoring', $event)" :value="scoringIndex" :range="scoringSystems">
					<view class="picker"> {{ scoringIndex > -1 ? scoringSystems[scoringIndex] : '选择计分制度' }} </view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">比赛类型</view>
				<picker @change="pickerChange('matchType', $event)" :value="selectedMatchTypeIndex"
					:range="matchTypeCount">
					<view class="picker"> {{ selectedMatchTypeIndex > -1 ? matchTypeCount[selectedMatchTypeIndex] : '选择比赛类型'
                    }} </view>
				</picker>
			</view>
			<!-- 根据选择的比赛类型动态显示对局形式选项 -->
			<view v-for="(matchType, index) in selectedMatchTypes" :key="index" class="cu-form-group margin-top">
				<view class="title">{{ index + 1 }}局对局形式</view>
				<picker :value="selectedMatchTypesIndex[index]" :range="matchTypeOptions"
					@change="matchTypeChange(index, $event)">
					<view class="picker"> {{ selectedMatchTypesIndex[index] > -1 ?
                    matchTypeOptions[selectedMatchTypesIndex[index]] : '选择对局形式' }} </view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">活动日期</view>
				<picker mode="date" :value="date" start="2024-05-01" @change="dateChange">
					<view class="picker"> {{ date }} </view>
				</picker>
			</view>
			<view class=".cu-form-group">
				<view class="title">活动时间</view>
				<picker mode="time" :value="time" start="08:00" end="23:59" @change="timeChange">
					<view class="picker"> {{ time }} </view>
				</picker>
			</view>
			<button class="btn" @click="uploadActivity">
				<text class="cuIcon-upload"></text> 上传活动信息
			</button>
		</form>
	</view>
</template>

<script>
	import ChiefRefereeAPI from '../../api/ChiefRefereeAPI';
	import ActivityAPI from '../../api/ActivityAPI';
	import AdminAPI from '../../api/AdminAPI';
	export default {
		data() {
			return {
				identity: '',
				event_id: '',
				name: '',
				eventDescription: '',
				venueCount: 0,
				chiefs: [],
				chiefsName: [],
				venues: [],
				venuesName: [],
				scoringSystems: ['11分制', '21分制', '30分制'],
				chiefIndex: -1,
				venueIndex: -1,
				scoringIndex: -1,
				date: '2024-05-01',
				time: '08:00',
				temp: '',
				selectedMatchTypes: [], // 存储用户选择的比赛类型，有几个元素，就有几局比赛
				selectedMatchTypesIndex: [], // 存储用户选择的每局比赛的对局形式索引
				matchTypeOptions: ['男单', '女单', '男双', '女双', '混双'], // 可选的比赛类型
				matchTypeCount: ['5局3胜', '3局2胜', '7局4胜'], // 默认为五局三胜
				selectedMatchTypeIndex: -1, // 用户选择的比赛类型索引
			};
		},
		onLoad(param) {
			this.identity = uni.getStorageSync('identity');
			this.initData();
			if (param.event) {
				this.temp = JSON.parse(param.event);
				this.event_id = this.temp.event_id;
				this.name = this.temp.name;
				this.eventDescription = this.temp.introduction;
				this.venueCount = this.temp.required_area_count;
				this.scoringIndex = this.scoringSystems.findIndex(scoring => scoring === this.temp.scoring_system);
				this.date = this.temp.activity_time.split(' ')[0];
				this.time = this.temp.activity_time.split(' ')[1];
				this.selectedMatchTypeIndex = this.matchTypeCount.findIndex(type => type[0] == this.temp.match_types
					.length);
				this.selectedMatchTypes = new Array(parseInt(this.matchTypeCount[this.selectedMatchTypeIndex])).fill(0);
				this.selectedMatchTypesIndex = this.temp.match_types.map(matchType => this.matchTypeOptions.findIndex(
					option => option === matchType));
			}
		},
		methods: {
			initData() {
				ChiefRefereeAPI.fetchAllChiefs().then(data => {
					this.chiefs = data.data;
					this.chiefsName = this.chiefs.map(chief => chief.name);
					if (this.temp !== '') {
						this.chiefIndex = this.chiefs.findIndex(chief => chief.referee_id === this.temp
							.chief_referee_id);
					}
				}).catch(error => {
					console.error('Error fetching chiefs:', error);
				});

				AdminAPI.fetchVenues().then(data => {
					this.venues = data.data;
					this.venuesName = this.venues.map(venue => venue.name);
					if (this.temp !== '') {
						this.venueIndex = this.venues.findIndex(venue => venue.venue_id === this.temp.venue_id);
					}
				}).catch(error => {
					console.error('Error fetching venues:', error);
				});
			},
			uploadActivity() {
				if (this.name === '' || this.eventDescription === '' || this.venueCount === 0 || this.chiefIndex === -1 ||
					this.venueIndex === -1 || this.scoringIndex === -1, this.date === '' || this.time === '') {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					});
					return;
				}

				const activity = {
					event_id: this.event_id,
					name: this.name,
					introduction: this.eventDescription,
					required_area_count: this.venueCount,
					chief_referee_id: this.chiefs[this.chiefIndex].referee_id,
					venue_id: this.venues[this.venueIndex].venue_id,
					scoring_system: this.scoringSystems[this.scoringIndex],
					activity_time: this.date + ' ' + this.time,
					match_types: JSON.stringify(this.selectedMatchTypes.map(index => this.matchTypeOptions[index])),
				};

				ActivityAPI.updateActivityInfo(activity).then((res) => {
					if (res.code === 0) {
						uni.showToast({
							title: '上传成功',
							icon: 'success'
						});
						uni.navigateBack();
					} else {
						uni.showToast({
							title: '上传失败',
							icon: 'success'
						});
					}
				}).catch(error => {
					uni.showToast({
						title: error,
						icon: 'none'
					});
				});
			},
			pickerChange(type, event) {
				const index = event.detail.value;
				if (type === 'chief') {
					this.chiefIndex = index;
				} else if (type === 'venue') {
					this.venueIndex = index;
				} else if (type === 'scoring') {
					this.scoringIndex = index;
				} else if (type === 'matchType') {
					this.selectedMatchTypeIndex = index;
					this.selectedMatchTypes = new Array(parseInt(this.matchTypeCount[index])).fill(0);
					this.selectedMatchTypesIndex = new Array(parseInt(this.matchTypeCount[index])).fill(-1);
				}
			},
			matchTypeChange(matchIndex, event) {
				this.selectedMatchTypesIndex[matchIndex] = event.detail.value;
			},
			dateChange(event) {
				this.date = event.detail.value;
			},
			timeChange(event) {
				this.time = event.detail.value;
			},

		}
	};
</script>

<style lang="scss">
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}

	.picker {
		display: block;
		width: 100%;
		padding: 10px;
		background-color: #fff;
		border-radius: 4px;
		text-align: center;
		border: 1px solid #ddd;
	}

	.cu-form-group {
		padding: 20rpx;

		.ipt,
		.area {
			background: #F6F7F9;
			border-radius: 8rpx;
			line-height: normal;
			margin: 0;
		}

		.ipt {
			height: 88rpx;
			padding: 0 0 0 20rpx;
		}

		.area {
			height: 148rpx;
			padding: 20rpx;
		}
	}

	.area-warp {
		display: flex;
		align-items: flex-start;
	}

	.picker {
		display: flex;
		align-items: center;
		height: 88rpx;
	}

	.cu-form-group picker {
		padding-right: 0;
	}

	.cu-form-group picker::after {
		right: 0;
	}

	.warp {
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>