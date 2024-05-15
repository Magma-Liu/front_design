<template>
    <cu-custom bgColor="bg-gradual-blue" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">裁判列表</block>
    </cu-custom>


    <view class="container">
        <view class="member-list">
            <view v-for="(member, index) in members" :key="index" class="member-item">
                <view class="flex solid-bottom padding justify-between">
                    <text class="text-grey">{{ member.name }}</text>
                    <button class="cu-btn round sm shadow line-red"
                        @click="removeRefereeFromEvent(this.eventID, member.referee_id)">删除</button>
                </view>
            </view>
        </view>
        <button @click="addRefereesInEvent('/pages/chief_referee/addList')">添加成员</button>

        <!-- <button @click="addMember(this.eventID, member.id)">添加成员</button> -->
    </view>
</template>

<script>
import ChiefRefereeAPI from '../../api/ChiefRefereeAPI';
export default {
    data() {
        return {
            members: [],
            eventID: '',
        };
    },
    onLoad: function (option) {
        this.eventID = option.eventID;
        this.fetchRefereesInEvent(this.eventID);
    },
    onShow: function () {
        this.fetchRefereesInEvent(this.eventID);
    },
    methods: {
        // 根据eventID 指定队伍，根据memberId 指定队员，最后删除成员
        removeRefereeFromEvent(eventID, memberId) {
            ChiefRefereeAPI.removeRefereeFromEvent(eventID, memberId).then(() => {
                this.fetchRefereesInEvent(eventID);
            })
                .catch((error) => {
                    uni.showToast({
                        title: error,
                        icon: 'none',
                    });
                });
        },
        // 根据eventID 获取队伍成员信息
        fetchRefereesInEvent(eventID) {
            ChiefRefereeAPI.fetchRefereesInEvent(eventID).then((res) => {
                this.members = res.data;
            })
                .catch((error) => {
                    uni.showToast({
                        title: error,
                        icon: 'none',
                    });
                });
        },
        addRefereesInEvent(page) {
            uni.navigateTo({ url: `${page}?list=` + JSON.stringify(this.members) + `&eventID=${this.eventID}` });
        },
    },
};
</script>
