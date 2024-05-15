<template>
    <cu-custom bgColor="bg-gradual-blue" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">超管信息</block>
    </cu-custom>
    <form>
        <view class="cu-form-group">
            <view class="title">姓名</view>
            <input v-model="newAdmin.name" placeholder="输入裁判长姓名" name="input" />
        </view>
        <view class="cu-form-group">
            <view class="title">手机号</view>
            <input v-model="newAdmin.phone" placeholder="输入手机号" name="input" />
        </view>
        <view class="cu-form-group">
            <view class="title">密码</view>
            <view class="pwd-input" style="position: relative;">
                <input :type="!showPassword ? 'password' : 'text'" v-model="newAdmin.password" placeholder="请输入密码" />
                <view class="icon-warp">
                    <uni-icons v-if="newAdmin.password" class="content-clear-icon"
                        :type="showPassword ? 'eye-slash-filled' : 'eye-filled'" :size="24" color="#c0c4cc"
                        @click="showPassword = !showPassword"></uni-icons>
                    <uni-icons v-if="newAdmin.password" class="content-clear-icon clear" type="clear" :size="24"
                        color="#c0c4cc" @click="newAdmin.password = '', showPassword = false"></uni-icons>
                </view>
            </view>
        </view>
        <button @click="uploadAdmin" class="cu-btn block line-orange lg">
            <text class="cuIcon-upload"></text> 添加超管
        </button>
    </form>

    <view class="admins-list">
        <view v-for="(admin, index) in admins" :key="index" class="admin-item">
            <view class="text-warp">
                <view class="text">
                    <view class="key"> 名称： </view>{{ admin.name }}
                </view>
                <view class="text">
                    <view class="key">
                        联系方式：
                    </view> {{ admin.phone }}
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import AdminAPI from '../../api/AdminAPI';
export default {
    data() {
        return {
            showPassword: false,
            admins: [],
            newAdmin: {
                name: '',
                phone: '',
                password: ''
            },
        };
    },
    onShow() {
        this.fetchAdmins();
    },
    methods: {
        fetchAdmins() {
            AdminAPI.fetchAdmins().then(data => {
                this.admins = data.data;
            }).catch(error => {
                uni.showToast({
                    title: error,
                    icon: 'none',
                });
            });
        },
        uploadAdmin() {
            AdminAPI.addAdmin(this.newAdmin).then((res) => {
                if (res.code === 0) {
                    this.fetchAdmins();
                    this.newAdmin = { name: '', phone: '', password: '' };
                    uni.showToast({
                        title: "添加成功",
                        icon: 'success',
                    });
                }
                else {
                    uni.showToast({
                        title: "添加失败",
                        icon: 'none',
                    });
                }
            }).catch(error => {
                uni.showToast({
                    title: error,
                    icon: 'none',
                });
            });
        },
    },
};
</script>

<style scoped lang="scss">
.pwd-input {
    flex: 1;
    display: flex;
    align-items: center;
}

.icon-warp {
    display: flex;
    align-items: center;
    margin-right: 20rpx;

    .clear {
        margin-right: 0;
    }
}

.cu-form-group {
    background: #F6F7F9;
    border-radius: 20rpx 20rpx 20rpx 20rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
}

.title {
    width: 126rpx;
}

.admins-list {
    padding: 20rpx 20rpx 0;
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}

.admin-item {
    background: #F6F7F9;
    border-radius: 20rpx 20rpx 20rpx 20rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.cu-btn {
    background: #19be6b;
    color: white;
    border-radius: 14rpx;
    font-size: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 78rpx;
    margin: 10rpx auto 0;
}

.text-warp {
    .text {
        display: flex;
        align-items: baseline;
        font-weight: 500;
        padding: 4rpx 0;

        .key {
            font-size: 28rpx;
            color: #8C8C8C;
            font-weight: normal;
        }
    }
}
</style>
