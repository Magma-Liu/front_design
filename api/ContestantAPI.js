export default {
    // 申请成为领队
    applyLeader(token) {
        return new Promise((resolve, reject) => {
            const url = '/contestant/apply-leader'; // 后端登录接口URL
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    token: token
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => {
                    if (res.code == 0) {
                        resolve(res); // 成功时返回成功信息
                    } else {
                        reject(res); // 失败时返回错误信息
                    }
                },
            });
        });
    },

    // 获取所有参赛选手的信息
    fetchContestants() {
        return new Promise((resolve, reject) => {
            const url = '/contestant/all'; // 后端登录接口URL
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'GET',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => {
                    resolve(res.data);
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    },


    checkIfLeader(token) {
        const url = '/contestant/check-leader'; // 接口URL
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
                success: (res) => {
                    if (res.code == 0) {
                        resolve(res.data);
                    } else {
                        resolve(res);
                    }
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    },

    // 创建团队功能的封装
    createTeam(teamName, introduction, token) {
        const url = '/contestant/createTeam'; // 接口URL
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    teamName: teamName,
                    introduction: introduction,
                    token: token
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => {
                    resolve(res.data);
                },
                fail: (error) => {
                    reject(error); // 请求失败时返回错误信息
                }
            });
        });
    },


    // 获取用户信息: 通过id
    fetchProfileInfo(id) {
        return new Promise((resolve, reject) => {
            const url = '/contestant/getInfo'; // 后端登录接口URL
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    id: id
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => {
                    resolve(res.data);
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    },


    // 根据token获取我管理的团队信息, 返回包含团队信息的列表
    fetchMyTeams(token) {
        return new Promise((resolve, reject) => {
            const url = '/contestant/fetchMyTeams';
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'GET',
                data: {
                    token: token
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => {
                    resolve(res.data);
                },
                fail: (error) => {
                    reject(error);
                }
            });
        });
    },

    // 删除指定队伍的成员
    removeMember(teamId, memberId) {
        return new Promise((resolve, reject) => {
            const url = '/contestant/removeMember';
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'DELETE',
                data: {
                    teamId: teamId,
                    contestantId: memberId
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => {
                    resolve(res.data);
                },
                fail: (error) => {
                    reject(error);
                }
            });
        });
    },

    // 添加成员到指定队伍
    addMember(teamId, contestantId) {
        return new Promise((resolve, reject) => {
            const url = '/contestant/addMember';
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    teamId: teamId,
                    contestantId: contestantId
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => {
                    resolve(res.data);
                },
                fail: (error) => {
                    reject(error);
                }
            });
        });
    },

    // 根据teamId删除队伍
    deleteTeam(teamId) {
        return new Promise((resolve, reject) => {
            const url = '/contestant/deleteTeam';
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'DELETE',
                data: {
                    teamId: teamId
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => {
                    resolve(res.data);
                },
                fail: (error) => {
                    reject(error);
                }
            });
        });
    },

    // 获取指定队伍的成员信息
    fetchMembers(teamId) {
        return new Promise((resolve, reject) => {
            const url = '/contestant/fetchMembers';
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'GET',
                data: {
                    teamId: teamId
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => {
                    resolve(res.data);
                },
                fail: (error) => {
                    reject(error);
                }
            });
        });
    },

    // 根据id获取队伍信息
    fetchTeamInfo(teamId) {
        const url = `/contestant/team/info/${teamId}`;
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'GET',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },
};