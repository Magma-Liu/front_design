export default {
    deleteActivity(id) {
        const url = `/events/delete/${id}`;
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'DELETE',
                header: {
                    "Content-Type": "application/json"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    // 更新活动信息
    updateActivityInfo(activity) {
        const url = '/events/update';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: activity,
                header: {
                    "Content-Type": "application/json"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },


    // 获取所有活动列表
    fetchActivities() {
        const url = '/events/all';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'GET',
                header: {
                    "Content-Type": "application/json"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    // 获取场地信息
    fetchVenuesByID(id) {
        const url = `/contestant/fetchVenues/${id}`;
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'GET',
                header: {
                    "Content-Type": "application/json"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    // 获取对应活动id的活动详情信息
    fetchActivityDetail(id) {
        const url = `/events/detail/${id}`;
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'GET',
                header: {
                    "Content-Type": "application/json"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    // 根据领队id获取队伍信息 
    fetchTeamInfo(id) {
        const url = `/teams/${id}`;
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'GET',
                header: {
                    "Content-Type": "application/json"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    // 提交报名表单, teamId为队伍id, activityId为活动id，队伍申请加入该活动
    submitSignUpForm(teamId, activityId) {
        const url = '/events/apply';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    teamId: teamId,
                    eventId: activityId
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    // 获取活动下的比赛列表
    fetchMatchList(eventId) {
        const url = `/events/matches/${eventId}`;
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'GET',
                header: {
                    "Content-Type": "application/json"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },
}