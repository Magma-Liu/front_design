<template>
	<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">对战详情</block>
	</cu-custom>
	<button class="btn" v-if="isChiefReferee" @click="scheduleMatches(this.event.event_id)">安排所有比赛</button>
	<div class="matches">
		<div class="matches">
			<div v-for="(match, index) in matches" :key="index" class="match-detail">
				<view class="header">
					比赛 {{ index + 1 }}
				</view>
				<view class="matches-item">
					<view class="key"> 裁判姓名</view>
					<view class="val"> {{ match.refereeName }} </view>
				</view>
				<view class="matches-item">
					<view class="key"> 裁判电话</view>
					<view class="val"> {{ match.refereePhone }} </view>
				</view>
				<view class="matches-item">
					<view class="key"> 计分制度</view>
					<view class="val"> {{ match.scoring_system }} </view>
				</view>
				<view class="matches-item">
					<view class="key"> 队伍1名称</view>
					<view class="val"> {{ match.team1Name }} </view>
				</view>
				<view class="matches-item">
					<view class="key"> 队伍2名称</view>
					<view class="val"> {{ match.team2Name }} </view>
				</view>
				<button class="btn" v-if="isChiefReferee" @click="editMatch(index)">
					{{ match.editing ? '保存' : '编辑对战信息' }}
				</button>
				<button class="btn" v-if="isChiefReferee" @click="deleteMatch(index)">
					删除对战信息
				</button>
				<div v-if="match.editing">
					<view class="cu-form-group margin-top">
						<view class="title">选择裁判</view>
						<picker @change="pickerChange('referee', $event, index)" :value="matches[index].refereeIndex"
							:range="referees.map(referee => referee.name)">
							<view class="picker"> {{ matches[index].refereeIndex > -1 ?
								referees[matches[index].refereeIndex].name
								:
								'选择裁判' }} </view>
						</picker>
					</view>
					<view class="cu-form-group margin-top">
						<view class="title">选择队伍1</view>
						<picker @change="pickerChange('team1', $event, index)" :value="matches[index].team1Index"
							:range="teams.map(team => team.name)">
							<view class="picker"> {{ matches[index].team1Index > -1 ?
								teams[matches[index].team1Index].name :
								'选择队伍1' }} </view>
						</picker>
					</view>
					<view class="cu-form-group margin-top">
						<view class="title">选择队伍2</view>
						<picker @change="pickerChange('team2', $event, index)" :value="matches[index].team2Index"
							:range="teams.map(team => team.name)">
							<view class="picker"> {{ matches[index].team2Index > -1 ?
								teams[matches[index].team2Index].name :
								'选择队伍2' }} </view>
						</picker>
					</view>
				</div>
				<div v-if="!isChiefReferee && event && event.match_types && event.match_types.length > 0">
					<div v-for="(type, index2) in event.match_types" :key="index2">
						<h1 class="header">第{{ index2 + 1 }}局 - {{ type }}</h1>
						<p class="score">分数：{{ match['score' + (index2 + 1)] }}</p>
						<view class="btn" v-if="isReferee && !match.editingScore[index2]"
							@click="prepareUpdateScore(match, index2)">更新比分</view>
						<div v-if="isReferee && match.editingScore[index2]">
							<view class="header-cus">更新比分</view>
							<div class="bor-bottom" style="margin-bottom: 20rpx;">
								<view class="matches-item cus-item">
									<view class="key">
										队伍1
									</view>
									<view class="val">
										{{ match.team1Name }}
									</view>
								</view>
								<view class="matches-item cus-item">
									<view class="key">
										得分
									</view>
									<view class="val">
										{{ match.team1Score }}
										<view class="btn-warp">
											<view class="mini-btn plus-btn" @click="updateScore(match, 'team1', 1)">+1
											</view>
											<view class="mini-btn reduce-btn" @click="updateScore(match, 'team1', -1)">
												-1</view>
										</view>
									</view>
								</view>
							</div>
							<div>
								<view class="matches-item cus-item">
									<view class="key">
										队伍2
									</view>
									<view class="val">
										{{ match.team2Name }}
									</view>
								</view>
								<view class="matches-item cus-item">
									<view class="key">
										得分
									</view>
									<view class="val">
										{{ match.team2Score }}
										<view class="btn-warp">
											<view class="mini-btn plus-btn" @click="updateScore(match, 'team2', 1)">+1
											</view>
											<view class="mini-btn reduce-btn" @click="updateScore(match, 'team2', -1)">
												-1</view>
										</view>
									</view>
								</view>
								<!-- <p>队伍2: {{ match.team2Name }} 得分: {{ match.team2Score }}</p> -->
							</div>
							<view class="confirm-btn-warp">
								<view class="mini-btn confirm-btn" @click="saveScore(match, index2)">保存分数</view>
								<view class="mini-btn cancel-btn" @click="match.editingScore[index2] = false">取消</view>
							</view>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ActivityAPI from '../../api/ActivityAPI';
import ContestantAPI from '../../api/ContestantAPI';
import RefereeAPI from '../../api/RefereeAPI';
import ChiefRefereeAPI from '../../api/ChiefRefereeAPI';
import LoginAndRegisterAPI from '../../api/LoginAndRegisterAPI';
export default {
	data() {
		return {
			matches: {}, // 对战信息列表
			event: {},
			referees: {},
			teams: {},
			isChiefReferee: false,
			isReferee: false,
			referee_id: -1,
		};
	},
	onShow() {
		this.fetchActivityProcess(this.event.event_id);
	},
	onLoad(params) {
		console.log(params, 'params')
		if (params) {
			this.event = JSON.parse(params.event);
			if (params.isChiefReferee) {
				this.isChiefReferee = true;
				this.loadData();
			}
			if (params.isReferee) {
				this.isReferee = true;
				this.getRefereeID();
			}
		}
	},
	methods: {
		prepareUpdateScore(match, index) {
			match.editingScore[index] = true;
			match.team1Score = parseInt(match['score' + (index + 1)].split('-')[0]);
			match.team2Score = parseInt(match['score' + (index + 1)].split('-')[1]);
		},

		updateScore(match, team, delta) {
			if (team === 'team1') {
				match.team1Score += delta;
			} else {
				match.team2Score += delta;
			}
			if (match.team1Score < 0) {
				match.team1Score = 0;
			}
			if (match.team2Score < 0) {
				match.team2Score = 0;
			}
		},
		saveScore(match, index) {
			const score1 = match.team1Score.toString();
			const score2 = match.team2Score.toString();
			const score = `${score1}-${score2}`;

			// 根据比赛类型更新相应的分数字段
			if (index === 0) {
				match.score1 = score;
			} else if (index === 1) {
				match.score2 = score;
			} else if (index === 2) {
				match.score3 = score;
			} else if (index === 3) {
				match.score4 = score;
			} else if (index === 4) {
				match.score5 = score;
			} else if (index === 5) {
				match.score6 = score;
			} else if (index === 6) {
				match.score7 = score;
			}

			// 调用 API 保存分数
			RefereeAPI.updateScore(match.match_id, index + 1, score)
				.then(() => {
					uni.showToast({
						title: '分数更新成功',
						icon: 'success',
					});
					match.editingScore[index] = false;
				})
				.catch(error => {
					console.error('Failed to update score:', error);
					uni.showToast({
						title: '分数更新失败',
						icon: 'none',
					});
				});
		},

		getRefereeID() {
			LoginAndRegisterAPI.fetchProfileInfo(uni.getStorageSync('token'))
				.then(data => {
					this.referee_id = data.data.referee_id;
				})
				.catch(error => {
					console.error('Failed to fetch referee ID:', error);
					uni.showToast({
						title: error,
						icon: 'none',
					});
				});
		},

		fetchActivityProcess(id) {
			ActivityAPI.fetchMatchList(id)
				.then(data => {
					// 过滤比赛信息
					if (this.isReferee) {
						this.matches = data.data.filter(match => match.referee_id === this.referee_id);
					} else {
						this.matches = data.data;
					}
					// 创建一个数组来处理所有比赛信息的异步请求
					const matchDetailsPromises = this.matches.map(match => {
						// 获取裁判和两支队伍的信息
						return Promise.all([
							RefereeAPI.fetchRefereeInfo(match.referee_id),
							ContestantAPI.fetchTeamInfo(match.team1_id),
							ContestantAPI.fetchTeamInfo(match.team2_id)
						]).then(([refereeInfo, team1Info, team2Info]) => {
							// 将获取到的信息合并到每场比赛的详情中
							match.refereeName = refereeInfo.data.name;
							match.refereePhone = refereeInfo.data.phone;
							match.team1Name = team1Info.data.name;
							match.team2Name = team2Info.data.name;
							// 初始化部分比赛信息
							if (this.isChiefReferee) {
								match.editing = false;
							}
							if (this.isReferee) {
								match.team1Score = 0;
								match.team2Score = 0;
							}
							return match;
						}).catch(error => {
							console.error('Failed to fetch additional match info:', error);
							return match; // 即使某个请求失败，也返回原始比赛信息
						});
					});

					// 等待所有比赛信息的处理完成
					Promise.all(matchDetailsPromises)
						.then(completedMatches => {
							this.matches = completedMatches;
							if (this.isReferee) {
								this.matches.forEach(match => {
									match.editingScore = new Array(this.event.match_types.length).fill(
										false);
								});
							}
						});
				})
				.catch(error => {
					uni.showToast({
						title: "error",
						icon: 'none',
					});
				});
		},
		scheduleMatches(id) {
			uni.showModal({
				title: '提示：',
				content: '一键生成会重置所有对战表，请确认',
				success: function (res) {
					if (res.confirm) {
						ChiefRefereeAPI.scheduleAllMatches(id)
							.then((res) => {
								if (res.code == 0) {
									uni.showToast({
										title: '安排成功',
										icon: 'success'
									});
									this.fetchActivityProcess(this.event.event_id);
									this.loadData();
								} else {
									uni.showToast({
										title: '安排失败',
										icon: 'none'
									});
								}
							});
					}
				}.bind(this),
			});
		},
		editMatch(index) {
			const match = this.matches[index];
			match.editing = !match.editing;
			if (!match.editing) {
				// 保存比赛信息
				const referee = this.referees[this.matches[index].refereeIndex];
				const team1 = this.teams[this.matches[index].team1Index];
				const team2 = this.teams[this.matches[index].team2Index];
				ChiefRefereeAPI.updateMatch(match.match_id, referee.referee_id, team1.team_id, team2.team_id)
					.then((res) => {
						if (res.code == 0) {
							uni.showToast({
								title: '保存成功',
								icon: 'success'
							});
							this.fetchActivityProcess(this.event.event_id);
							this.loadData();
						} else {
							uni.showToast({
								title: '保存失败',
								icon: 'none'
							});
						}
					})
					.catch(error => {
						uni.showToast({
							title: '保存失败',
							icon: 'none'
						});
					});
			}
		},
		deleteMatch(index) {
			const match = this.matches[index];
			uni.showModal({
				title: '提示：',
				content: '删除比赛将无法恢复，请确认',
				success: function (res) {
					if (res.confirm) {
						ChiefRefereeAPI.deleteMatch(match.match_id)
							.then((res) => {
								if (res.code == 0) {
									uni.showToast({
										title: '删除成功',
										icon: 'success'
									});
									this.fetchActivityProcess(this.event.event_id);
									this.loadData();
								} else {
									uni.showToast({
										title: '删除失败',
										icon: 'none'
									});
								}
							});
					}
				}.bind(this),
			});
		},
		iniIndex() {
			// 设置初始索引值
			this.matches.forEach(match => {
				if (match.team1_id && this.teams !== undefined)
					match.team1Index = this.teams.findIndex(team => team.team_id === match.team1_id);
				else
					match.team1Index = -1;
				if (match.team2_id && this.teams !== undefined)
					match.team2Index = this.teams.findIndex(team => team.team_id === match.team2_id);
				else
					match.team2Index = -1;
				if (match.referee_id && this.referees !== undefined)
					match.refereeIndex = this.referees.findIndex(referee => referee.referee_id === match
						.referee_id);
				else
					match.refereeIndex = -1;
			});
		},

		async loadData() {
			try {
				// 获取已通过审批的申请队伍信息
				const applicationsData = await ChiefRefereeAPI.fetchApplications(this.event.event_id);
				const approvedApplications = applicationsData.data.filter(application => application
					.is_approved === true);
				const teamPromises = approvedApplications.map(async application => {
					const profileInfo = await ContestantAPI.fetchTeamInfo(application.team_id);
					return {
						...application,
						name: profileInfo.data.name,
						introduction: profileInfo.data.introduction
					};
				});
				this.teams = await Promise.all(teamPromises);

				// 获取活动所属的裁判信息
				const refereesData = await ChiefRefereeAPI.fetchRefereesInEvent(this.event.event_id);
				this.referees = refereesData.data;

				// 设置初始索引值
				this.iniIndex();
			} catch (error) {
				console.error('Failed to fetch data:', error);
				uni.showToast({
					title: error,
					icon: 'none',
				});
			}
		},

		pickerChange(type, event, index) {
			const value = event.detail.value;
			const match = this.matches[index];

			if (type === 'referee') {
				this.matches[index].refereeIndex = value;
			} else if (type === 'team1') {
				this.matches[index].team1Index = value;
			} else if (type === 'team2') {
				this.matches[index].team2Index = value;
			}
		},

	},
};
</script>
<style lang="scss">
.matches {
	display: flex;
	flex-direction: column;
	padding: 10px;

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: auto;
	}
}

.header {
	position: relative;
	padding-left: 15rpx;
	font-size: 32rpx;
	color: #161616;
	margin-top: 20rpx;

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

.match-detail {
	border: 1px solid #ccc;
	padding: 10px;
	margin-bottom: 10px;
}

.matches-item {
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
		position: relative;
		flex: 1;
		font-size: 24rpx;
		color: #8C8C8C;
		background: #F6F7F9;
		border-radius: 8rpx;
		padding: 10rpx 10rpx 10rpx 20rpx;
	}
}

.score {
	font-size: 24rpx;
	color: #8C8C8C;
	background: #F6F7F9;
	border-radius: 8rpx;
	padding: 10rpx 10rpx 10rpx 20rpx;
	margin: 10rpx 0;
}

.cu-form-group {
	.picker {
		display: flex;
		align-items: center;
		height: 88rpx;
	}
}

.cu-form-group picker {
	display: flex;
	align-items: center;
	flex: 1;
	height: 54rpx;
	font-size: 24rpx;
	color: #8C8C8C;
	background: #F6F7F9;
	border-radius: 8rpx;
	padding: 0 10rpx 0 20rpx;
	// padding-right: 0;
}

.cu-form-group picker::after {
	right: 0;
	line-height: normal;
	bottom: auto;
	top: 50%;
	transform: translateY(-50%);
}

.header-cus {
	position: relative;
	padding-left: 15rpx;
	font-size: 28rpx;
	color: #8C8C8C;
	margin-top: 20rpx;
	padding: 0 0 0 30rpx;
	margin-bottom: 20rpx;

	&::before {
		content: "";
		width: 6rpx;
		height: 24rpx;
		background: #8C8C8C;
		border-radius: 8rpx;
		position: absolute;
		left: 20rpx;
		top: 50%;
		transform: translateY(-50%);
	}
}

.cus-item {
	position: relative;

	.key {
		width: 100rpx;
	}

	.val {}
}

.btn-warp {
	position: absolute;
	right: 10rpx;
	top: 50%;
	transform: translateY(-50%);
	display: flex;
	align-items: center;

	.mini-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 68rpx;
		height: 34rpx;
		border-radius: 6rpx;
		color: white;
		border: none;
		font-size: 28rpx;
		margin-left: 10rpx;
	}

}

.reduce-btn {
	background: #f29100;
}

.plus-btn {
	background: #19be6b;
}

.confirm-btn {
	background: #19be6b;
}

.cancel-btn {
	background: #909399;
}

.confirm-btn-warp {
	display: flex;
	align-items: center;
	margin-top: 10rpx;
	padding: 0 30rpx;

	.mini-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 49%;
		height: 78rpx;
		background: #19be6b;
		border-radius: 14rpx;
		color: white;
		border: none;
		font-size: 32rpx;
		margin: 10rpx auto 0;
	}

	.cancel-btn {
		background: #909399;
	}
}

.bor-bottom {
	border-bottom: 2rpx dashed #e4e4e4;
}
</style>