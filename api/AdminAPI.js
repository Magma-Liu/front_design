export default {
    fetchAdmins() {
        const url = '/admin/fetchAdmins';
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

    fetchAdminInfo(id) {
        const url = '/admin/info';
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


    // 添加管理员
    addAdmin(admin) {
        const url = '/admin/add';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: admin,
                header: {
                    'Content-Type': 'application/json'
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    // 获取领队申请信息，返回领队申请列表
    fetchApplications() {
        const url = '/admin/fetchApplications';
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

    // 通过领队申请
    approveApplication(contestant_id, admin_token) {
        const url = '/admin/approveApplication';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    contestant_id: contestant_id,
                    admin_token: admin_token
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    // 拒绝领队申请
    rejectApplication(contestant_id, admin_token) {
        const url = '/admin/rejectApplication';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    contestant_id: contestant_id,
                    admin_token: admin_token
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    // 获取所有的裁判长信息，返回裁判长列表
    fetchJudges() {
        const url = '/admin/fetchJudges';
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

    // 添加裁判长
    addJudge(name, phone, password) {
        const url = '/admin/addJudge';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    name: name,
                    phone: phone,
                    password: password
                },
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
        const url = '/admin/updateJudge';
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

    // 删除裁判长
    deleteJudge(id) {
        const url = '/admin/deleteJudge';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: { id: id },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    // 获取所有的场地信息
    fetchVenues() {
        const url = '/admin/fetchVenues';
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

    // 添加场地
    addVenue(newVenue) {
        const url = '/admin/addVenue';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data:
                    newVenue
                ,
                header: {
                    'Content-Type': 'application/json' // 确保发送的是JSON格式
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    // 更新场地信息
    updateVenue(id, newVenue) {
        const url = '/admin/updateVenue';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    venue_id: id,
                    name: newVenue.name,
                    address: newVenue.address,
                    area_count: newVenue.area_count
                },
                header: {
                    'Content-Type': 'application/json' // 确保发送的是JSON格式
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

    // 删除场地
    deleteVenue(id) {
        const url = '/admin/deleteVenue';
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: { id },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => resolve(res.data),
                fail: (error) => reject(error)
            });
        });
    },

};
