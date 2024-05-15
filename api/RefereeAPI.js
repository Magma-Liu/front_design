export default {

    // 根据裁判Token获取管理比赛所属的活动列表
    fetchActivitiesByReferee(token) {
        const url = `/referee/activitys`;
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

    updateScore(match_id, index, score) {
        const url = `/referee/scoreUpdate`;
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    match_id: match_id,
                    index: index,
                    score: score
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    // 根据裁判ID获取裁判信息
    fetchRefereeInfo(id) {
        const url = `/referee/info`;
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
}