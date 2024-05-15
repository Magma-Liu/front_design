<template>
    <view>
        <!-- 底部操作条：背景颜色、对应图标、字体颜色，可自定义 -->
        <view class="cu-bar tabbar bg-white foot">
            <!-- 首页 -->
            <view class="action" :class="PageCur == 'home' ? 'text-green' : 'text-gray'" data-cur="home"
                @click="goTo('/pages/home/home')">
                <view class="cuIcon-homefill"></view> 活动
            </view>
            <!-- 我的 -->
            <view class="action" :class="PageCur == 'mine' ? 'text-green' : 'text-gray'" data-cur="mine"
                @click="goTo('/pages/home/info')">
                <view class="cuIcon-my">
                </view>
                我的
            </view>
        </view>
    </view>
</template>

<script>
export default {
    methods: {
        goTo(page) {
            // 根据传入的page跳转到不同的页面
            uni.switchTab({ url: `${page}` });
        }
    }
}
</script>
