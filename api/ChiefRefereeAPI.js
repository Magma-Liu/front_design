export default {
    deleteMatch(match_id) {
        const url = '/chiefReferee/deleteMatch';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    match_id: match_id
                },
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    updateMatch(match_id, referee_id, team1_id, team2_id) {
        const url = '/chiefReferee/updateMatch';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    match_id: match_id,
                    referee_id: referee_id,
                    team1_id: team1_id,
                    team2_id: team2_id
                },
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    addRefereeToEvent(eventID, referee_id) {
        const url = '/chiefReferee/addRefereeToEvent';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    eventID: eventID,
                    referee_id: referee_id
                },
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },


    fetchRefereesInEvent(eventID) {
        const url = '/chiefReferee/getRefereeInEvent';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    eventID: eventID
                },
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    removeRefereeFromEvent(eventID, memberId) {
        const url = '/chiefReferee/removeRefereeFromEvent';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    eventID: eventID,
                    memberId: memberId
                },
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    deleteJudge(id) {
        const url = '/chiefReferee/deleteJudge';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    id: id
                },
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    addJudge(newJudge) {
        const url = '/chiefReferee/addJudge';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: newJudge,
                header: {
                    'Content-Type': 'application/json' // 确保发送的是JSON格式
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    // 更新裁判长信息
    updateJudge(newJudge) {
        const url = '/chiefReferee/updateJudge';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: newJudge,
                header: {
                    'Content-Type': 'application/json' // 确保发送的是JSON格式
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    fetchJudges() {
        const url = `/referees/all`;
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


    fetchAllChiefs() {
        const url = `/chiefReferee/all`;
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

    fetchChiefRefereeInfo(id) {
        const url = `/getChiefRefereeInfo`;
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    id: id
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },


    // 根据裁判长ID获取管理的活动列表
    fetchActivitiesByReferee(token) {
        const url = `/activitys/byChiefReferee`;
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    token: token
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },



    // 安排或随机排列所有比赛
    scheduleAllMatches(activityId) {
        const url = `/matches/schedule/${activityId}`;
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },


    // 获取队伍加入活动的申请
    fetchApplications(eventID) {
        const url = `/teams/applicationsInEvent`;
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'GET',
                data: {
                    activityId: eventID
                },
                header: {
                    "Content-Type": "application/json"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });

    },

    // 批准队伍加入活动的申请
    approveTeamApplication(activityId, teamId) {
        const url = `/teams/approve/${activityId}/${teamId}`;
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    // 拒绝队伍加入活动的申请
    rejectTeamApplication(activityId, teamId) {
        const url = `/teams/reject/${activityId}/${teamId}`;
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    }
}
