<script>
import { getCurrentInstance } from 'vue'

export default {
	globalData: {
		// baseUrl: 'http://localhost:8080',
		// baseUrl: 'http://10.26.61.210:8080',
		// baseUrl: 'http://cyril-liu.natapp1.cc',
		baseUrl: 'https://liucyril.mynatapp.cc',
	},
	onLaunch: function () {
		uni.getSystemInfo({
			success: function (e) {
				// 获取 appContext  上下文
				const { appContext } = getCurrentInstance()
				// #ifndef MP
				appContext.config.globalProperties.StatusBar = e.statusBarHeight;
				if (e.platform == 'android') {
					appContext.config.globalProperties.CustomBar = e.statusBarHeight + 50;
				} else {
					appContext.config.globalProperties.CustomBar = e.statusBarHeight + 45;
				};
				// #endif
				// #ifdef MP-WEIXIN
				appContext.config.globalProperties.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				appContext.config.globalProperties.Custom = custom;
				appContext.config.globalProperties.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
				// #endif        
				// #ifdef MP-ALIPAY
				appContext.config.globalProperties.StatusBar = e.statusBarHeight;
				appContext.config.globalProperties.CustomBar = e.statusBarHeight + e.titleBarHeight;
				// #endif
			}
		})
		console.log('App Launch')
	},

	onShow: function () {
		console.log('App Show');
	},
	onHide: function () {
		console.log('App Hide')
	}
}
</script>

<style>
@import "colorui/main.css";
@import "colorui/icon.css";
</style>
