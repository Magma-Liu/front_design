<template>
    <view class="container">
        <view class="team-info" @click="goToTeamManagement">
            <text>队伍名称: {{ team.name }}</text>
            <!-- 提供查看选项，点击后进入队伍管理页面 -->
            <text>查看</text>
        </view>
        <button @click="submitSignUpForm">提交报名表</button>
    </view>
</template>

<script>
import ActivityAPI from '../../api/ActivityAPI';
export default {
    data() {
        return {
            team: {}, // 队伍信息
            activityId: '',
            id: uni.getStorageSync('id'),
        };
    },
    onLoad(options) {
        this.activityId = options.id;
    },
    onShow() {
        this.fetchTeamInfo(this.id);
    },
    methods: {
        fetchTeamInfo(id) {
            ActivityAPI.fetchTeamInfo(id)
                .then(data => {
                    this.team = data;
                })
                .catch(error => {
                    uni.showToast({
                        title: error,
                        icon: 'none',
                    });
                });
        },
        goToTeamManagement() {
            uni.navigateTo({ url: `/pages/contestant/manageTeam` });
        },
        submitSignUpForm(teamId, activityId) {
            ActivityAPI.submitSignUpForm(teamId, activityId)
                .then(() => {
                    uni.showToast({
                        title: '报名成功',
                        icon: 'success',
                    })
                    uni.navigateTo({ url: '/pages/home/home' });
                }).catch(error => {
                    uni.showToast({
                        title: error,
                        icon: 'none',
                    })
                });
        },
    },
};
</script>

<style>
/* 在这里添加CSS样式 */
.team-info {
    padding: 10px;
    border-bottom: 1px solid #eee;
}
</style>
