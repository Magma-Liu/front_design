<template>
    <cu-custom bgColor="bg-gradual-blue" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">非本队选手列表</block>
    </cu-custom>
    <view>
        <scroll-view scroll-y class="indexes" :scroll-into-view="'indexes-' + listCurID"
            :style="[{ height: 'calc(100vh - 50px)' }]" :scroll-with-animation="true" :enable-back-to-top="true">
            <block v-for="(group, groupIndex) in list" :key="'group' + groupIndex">
                <view class="padding">{{ group.initial }}</view>
                <view v-for="(item, index) in group.players" :key="item.contestant_id">
                    <view class="cu-list menu-avatar no-padding">
                        <view class="cu-item">
                            <view class="cu-avatar round lg">{{ item.name[0] }}</view>
                            <view class="content">
                                <view class="text-grey">{{ item.name }}</view>
                                <view class="flex solid-bottom padding justify-between">
                                    <view class="text-gray text-sm">{{ item.phone }}</view>
                                    <button class="cu-btn round sm shadow line-blue"
                                        @click="addMember(teamId, item.contestant_id)">添加</button>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </block>
        </scroll-view>
        <view class="indexBar" :style="[{ height: 'calc(100vh - 50px)' }]">
            <view class="indexBar-box" @touchstart="tStart" @touchend="tEnd" @touchmove.stop="tMove">
                <view class="indexBar-item" v-for="group in list" :key="group.initial">
                    {{ group.initial }}
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import ContestantAPI from '../../api/ContestantAPI';
import { getSpell } from 'jian-pinyin';
export default {
    data() {
        return {
            StatusBar: this.StatusBar,
            CustomBar: this.CustomBar,
            hidden: true,
            listCurID: '',
            list: [],
            listCur: '',
            teamId: '',
        };
    },
    onLoad(param) {
        let temp = JSON.parse(param.list);
        if (temp) {
            this.list = temp;
        }
        this.teamId = param.teamId;
        this.fetchContestants();
    },
    onReady() {
        let that = this;
        //这两句大概知道什么意思，但是emmm,这个boxTop和barTop具体是什么数值，不是很理解
        uni.createSelectorQuery().select('.indexBar-box').boundingClientRect(function (res) {
            that.boxTop = res.top
        }).exec();
        uni.createSelectorQuery().select('.indexes').boundingClientRect(function (res) {
            that.barTop = res.top
        }).exec()
    },
    methods: {
        fetchContestants() {
            ContestantAPI.fetchContestants()
                .then(data => {
                    let sortedList;
                    // 对数组进行去重和排序
                    if (this.list.length === 0) {
                        sortedList = data.data.sort((a, b) => getSpell(a.name, null, '').localeCompare(getSpell(b.name, null, '')));
                    }
                    else
                        sortedList = data.data
                            .filter(dataItem => !this.list.some(listItem => listItem.contestant_id === dataItem.contestant_id))
                            .sort((a, b) => getSpell(a.name, null, '').localeCompare(getSpell(b.name, null, '')));

                    // 提取首字母并保留其他属性
                    this.list = sortedList.map(person => {
                        let initial = getSpell(person.name, null, '')[0].toUpperCase();
                        // 检查首字母是否为A-Z之间的字母，如果不是，则设置为'#'
                        if (!initial.match(/[A-Z]/)) {
                            initial = '#';
                        }
                        return {
                            ...person,
                            initial: initial
                        };
                    });

                    // 组织数据为首字母分组的结构，并排序确保'#'组在最后
                    this.list = this.list.reduce((acc, current) => {
                        const index = acc.findIndex(item => item.initial === current.initial);
                        if (index > -1) {
                            acc[index].players.push(current);
                        } else {
                            acc.push({ initial: current.initial, players: [current] });
                        }
                        return acc;
                    }, []).sort((a, b) => {
                        if (a.initial === '#') return 1;
                        if (b.initial === '#') return -1;
                        return a.initial.localeCompare(b.initial);
                    });

                })
                .catch(error => {
                    console.error('Error fetching contestants:', error);
                    uni.showToast({
                        title: String(error),
                        icon: 'none',
                    });
                });
        },


        // 根据teamId contestant_id 指定队员，最后添加成员
        addMember(teamId, contestant_id) {
            ContestantAPI.addMember(teamId, contestant_id).then((res) => {
                if (res.code === 0) {
                    this.removeContestantById(contestant_id);
                    uni.showToast({
                        title: '添加成功',
                        icon: 'success',
                    });
                }
                else {
                    uni.showToast({
                        title: '添加失败',
                        icon: 'none',
                    });
                }
            })
                .catch((error) => {
                    uni.showToast({
                        title: error,
                        icon: 'none',
                    });
                });
        },
        removeContestantById(value) {
            // 遍历外层列表
            this.list.forEach(group => {
                // 遍历每个组中的players数组
                for (let i = 0; i < group.players.length; i++) {
                    if (group.players[i].contestant_id === value) {
                        // 找到匹配的contestant_id，使用splice移除
                        group.players.splice(i, 1);
                        // 一旦找到并删除，跳出循环
                        break;
                    }
                }
            });
        },

        //获取文字信息
        getCur(e) {
            this.hidden = false;
            this.listCur = this.list[e.target.id].name;
        },
        setCur(e) {
            this.hidden = true;
            this.listCur = this.listCur
        },
        //滑动选择Item
        tMove(e) {
            let y = e.touches[0].clientY,
                offsettop = this.boxTop,
                that = this;
            //判断选择区域,只有在选择区才会生效
            if (y > offsettop) {
                // 这个num计算结果怎么就是字母列表的下标呢，我没想明白，望大佬指教
                let num = parseInt((y - offsettop) / 20);
                this.listCur = that.list[num].name
            };
        },

        //触发全部开始选择
        tStart() {
            this.hidden = false
        },
        //触发结束选择
        tEnd() {
            this.hidden = true;
            this.listCurID = this.listCur
        },
    }
}
</script>

<style>
page {
    padding-top: 100upx;
}

.indexes {
    position: relative;
}

.indexBar {
    position: fixed;
    right: 0px;
    bottom: 0px;
    padding: 20upx 20upx 20upx 60upx;
    display: flex;
    align-items: center;
}

.indexBar .indexBar-box {
    width: 40upx;
    height: auto;
    background: #fff;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
    border-radius: 10upx;
}

.indexBar-item {
    flex: 1;
    width: 40upx;
    height: 40upx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24upx;
    color: #888;
}

movable-view.indexBar-item {
    width: 40upx;
    height: 40upx;
    z-index: 9;
    position: relative;
}

movable-view.indexBar-item::before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 10upx;
    height: 20upx;
    width: 4upx;
    background-color: #f37b1d;
}

.indexToast {
    position: fixed;
    top: 0;
    right: 80upx;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    width: 100upx;
    height: 100upx;
    border-radius: 10upx;
    margin: auto;
    color: #fff;
    line-height: 100upx;
    text-align: center;
    font-size: 48upx;
}
</style>
