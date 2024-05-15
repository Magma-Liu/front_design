<template>
    <cu-custom bgColor="bg-gradual-blue" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">负责的活动</block>
    </cu-custom>
    <div v-for="(activity, index) in activities" :key="index" @click="goToActivityDetail(index)">
        <div class="cu-card article" :class="isCard ? 'no-card' : ''">
            <div class="cu-item" style="padding-bottom: 0;">
                <div class="header">{{ activity.name }}</div>
                <div class="content">
                    <img v-if="index % 3 == 0" :src="getImageUrl(4)" mode="aspectFill">
                    <img v-if="index % 3 == 1" :src="getImageUrl(5)" mode="aspectFill">
                    <img v-if="index % 3 == 2" :src="getImageUrl(6)" mode="aspectFill">
                    <div class="desc">
                        <div class="text-sm-dec">活动描述:{{ activity.introduction }}</div>
                        <view class="bottom">
                            <div class="text-sm-name">场馆名称:{{ activity.venue_name }}</div>
                            <div class="text-sm-time">活动时间:{{ activity.activity_time }}</div>
                        </view>
                    </div>
                </div>
                <button class="btn" @click.stop="goToMatch(index)">管理比分</button>
            </div>
        </div>
    </div>
</template>

<script>
import ActivityAPI from '../../api/ActivityAPI';
import RefereeAPI from '../../api/RefereeAPI';
export default {
    data() {
        return {
            cover: '@/static/imgs/logo.jpg',
            activities: [], // 活动列表
        };
    },
    onLoad() {
        this.fetchActivities();
    },
    methods: {
        getImageUrl(image) {
            return `${getApp().globalData.baseUrl}/images/${image}.jpeg`;
        },
        fetchActivities() {
            RefereeAPI.fetchActivitiesByReferee(uni.getStorageSync('token'))
                .then(data => {
                    const venuePromises = data.data.map(activity => {
                        if (activity.venue_id) {
                            return ActivityAPI.fetchVenuesByID(activity.venue_id)
                                .then(venueData => {
                                    activity.venue_name = venueData.data.name; // 假设返回的场地信息中有 name
                                    activity.venue_address = venueData.data
                                        .address; // 假设返回的场地信息中有 address
                                    activity.venue_area_count = venueData.data
                                        .area_count; // 假设返回的场地信息中有 area_count
                                    activity.match_types = JSON.parse(activity.match_types);
                                    return activity; // 返回更新后的活动对象
                                })
                                .catch(error => {
                                    console.error('Failed to fetch venue details', error);
                                    return activity;
                                });
                        }
                        return Promise.resolve(activity);
                    });
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

        goToActivityDetail(index) {
            uni.navigateTo({
                url: `/pages/activities/detail?id=` + this.activities[index].event_id
            });
        },

        goToMatch(index) {
            uni.navigateTo({
                url: `/pages/referee/manageScore?isReferee=true&event=` + JSON.stringify(this.activities[index])
            });
        },

    },
};
</script>

<style lang="scss">
.content {
    margin-top: 20rpx;
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

.btn {
    width: auto;
}
</style>