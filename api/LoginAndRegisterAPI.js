export default {
    getRegister() {
        return new Promise((resolve, reject) => {
            const url = '/getRegister'; // 后端注册接口URL
            console.log(getApp().globalData.baseUrl + url);
            uni.request({
                url: getApp().globalData.baseUrl + url, // API基础路径
                method: 'GET',
                success: (res) => {
                    resolve(res.data); // 成功时返回后端传来的数据
                },
                fail: (error) => {
                    reject(error); // 请求失败时返回请求错误信息
                }
            });
        });
    },
    // 登录功能的封装
    login(phone, password, identity) {
        const url = '/login'; // 后端登录接口URL
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    phone: phone,
                    password: password,
                    identity: identity
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => {
                    if (res.data.code === 0) {
                        resolve(res.data); // 成功时返回后端传来的数据
                    } else {
                        reject('登录失败'); // 失败时返回错误信息
                    }
                },
                fail: (error) => {
                    reject(error); // 请求失败时返回请求错误信息
                }
            });
        });
    },

    // 注册功能的封装
    register(phone, password, name) {
        const url = '/register'; // 后端注册接口URL
        return new Promise((resolve, reject) => {
            uni.request({
                url: getApp().globalData.baseUrl + url, // API基础路径
                method: 'POST',
                data: {
                    phone: phone,
                    password: password,
                    name: name
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => {
                    if (res.data.code === 0) {
                        resolve(res.data); // 成功时返回后端传来的数据
                    } else {
                        reject('注册失败: ' + res.data.message); // 失败时返回错误信息
                    }
                },
                fail: (error) => {
                    reject('网络请求失败'); // 请求失败时返回错误信息
                }
            });
        });
    },

    // 获取用户信息: 通过token 
    fetchProfileInfo(token) {
        return new Promise((resolve, reject) => {
            const url = '/getInfo'; // 后端登录接口URL
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
                    resolve(res.data);
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    },

    // 更新用户信息: 更新用户
    updateProfile(token, name, password, phone) {
        return new Promise((resolve, reject) => {
            const url = '/updateProfile';
            uni.request({
                url: getApp().globalData.baseUrl + url,
                method: 'POST',
                data: {
                    token: token,
                    name: name,
                    password: password,
                    phone: phone
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
}
