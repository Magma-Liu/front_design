<template>
    <cu-custom bgColor="bg-gradual-blue" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">队员信息</block>
    </cu-custom>


    <view class="container">
        <view class="member-list">
            <view v-for="(member, index) in members" :key="index" class="member-item">
                <view class="flex solid-bottom padding justify-between">
                    <text class="text-grey">{{ member.name }}</text>
                    <button class="cu-btn round sm shadow line-red"
                        @click="removeMember(this.teamId, member.contestant_id)">删除</button>
                </view>
            </view>
        </view>
        <button @click="addMembers('/pages/contestant/addList')">添加成员</button>

        <!-- <button @click="addMember(this.teamId, member.id)">添加成员</button> -->
        <button @click="deleteTeam(this.teamId)">删除队伍</button>
    </view>
</template>

<script>
import ContestantAPI from '../../api/ContestantAPI';
export default {
    data() {
        return {
            members: [],
            teamId: '',
        };
    },
    onLoad: function (option) {
        this.teamId = option.teamId;
        this.fetchMembers(this.teamId);
    },
    onShow: function () {
        this.fetchMembers(this.teamId);
    },
    methods: {
        // 根据teamId 指定队伍，根据memberId 指定队员，最后删除成员
        removeMember(teamId, memberId) {
            ContestantAPI.removeMember(teamId, memberId).then(() => {
                this.fetchMembers(teamId);
            })
                .catch((error) => {
                    uni.showToast({
                        title: error,
                        icon: 'none',
                    });
                });
        },
        // 根据teamId 删除队伍
        deleteTeam(teamId) {
            ContestantAPI.deleteTeam(teamId).then(() => {
                uni.navigateBack();
            })
                .catch((error) => {
                    uni.showToast({
                        title: error,
                        icon: 'none',
                    });
                });
        },
        // 根据teamId 获取队伍成员信息
        fetchMembers(teamId) {
            ContestantAPI.fetchMembers(teamId).then((res) => {
                this.members = res.data;
            })
                .catch((error) => {
                    uni.showToast({
                        title: error,
                        icon: 'none',
                    });
                });
        },
        addMembers(page) {
            uni.navigateTo({ url: `${page}?list=` + JSON.stringify(this.members) + `&teamId=${this.teamId}` });
        },
    },
};
</script>
