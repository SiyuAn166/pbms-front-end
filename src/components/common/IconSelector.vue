<template>
    <div class="icon-selector">
        <el-popover
                title="选择图标"
                trigger="click"
                v-model="visible"
        >

            <div class="search-pane">
                <el-input clearable placeholder="搜索" v-model="searchIcon" suffix-icon="el-icon-search" maxlength="36"
                          @input="search">
                </el-input>
            </div>
            <div class="icon-lib">
                <div class="icon-item" v-for="(ic,index) in icons" :key="index" @click="handleClickItem(ic)">
                    <i :class="ic" style="font-size: 30px"></i>
                    <span>{{ic}}</span>
                </div>
            </div>
            <el-input v-model="iconClass" slot="reference" placeholder="请选择图标" :suffix-icon="iconClass"
                      readonly></el-input>
        </el-popover>
    </div>
</template>

<script>
    import icons from '../../assets/ele-icons/ele-icons'

    export default {
        name: "IconSelector",
        props: {
            iconClass: {
                type: String
            }
        },
        // 使用model， 这儿2个属性，
        // prop属性说，我要将iconClass作为该组件被使用时（被父组件调用）v-model能取到的值，
        // event说，我emit ‘selectIcon’ 的时候，参数的值就是父组件v-model收到的值。
        model: {
            prop: 'iconClass',
            event: 'selectIcon'
        },
        data() {
            return {
                icons: icons.icons,
                searchIcon: '',
                visible: false
            }
        }
        ,
        methods: {
            fuzzyQuery: function (list, keyWord) {
                let reg = new RegExp(keyWord);
                let arr = [];
                for (let i = 0; i < list.length; i++) {
                    if (reg.test(list[i])) {
                        arr.push(list[i]);
                    }
                }
                return arr;
            }
            ,
            search: function () {
                let result = this.fuzzyQuery(icons.icons, this.searchIcon);
                this.icons = result;
            }
            ,
            handleClickItem: function (item) {
                this.$emit("selectIcon", item)
                this.visible = false;
            },

        }
    }
</script>

<style scoped>
    .icon-selector {
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    }

    .icon-lib {
        overflow-y: scroll;
        width: 810px;
        height: 300px;
        padding-top: 10px;
    }

    .icon-lib div {
        width: 120px;
        height: 60px;
        text-align: center;
        float: left;
        margin: 5px 5px;
        padding-top: 10px;
        cursor: pointer;
    }

    .icon-lib div:hover {
        color: #409EFF;
        transition: color 0.28s;
    }

    .icon-lib div * {
        display: block;
    }

    /* 滚动条 */
    ::-webkit-scrollbar-thumb:horizontal { /*水平滚动条的样式*/
        width: 4px;
        background-color: #CCCCCC;
        -webkit-border-radius: 50%;
    }

    ::-webkit-scrollbar-track-piece {
        background-color: #fff; /*滚动条的背景颜色*/
        -webkit-border-radius: 0; /*滚动条的圆角宽度*/
    }

    ::-webkit-scrollbar {
        width: 10px; /*滚动条的宽度*/
        height: 8px; /*滚动条的高度*/
    }

    ::-webkit-scrollbar-thumb:vertical { /*垂直滚动条的样式*/
        height: 50px;
        background-color: #999;
        -webkit-border-radius: 20%;
        outline: 2px solid #fff;
        outline-offset: -2px;
        border: 2px solid #fff;
    }

    ::-webkit-scrollbar-thumb:hover { /*滚动条的hover样式*/
        height: 50px;
        background-color: #9f9f9f;
        -webkit-border-radius: 20px;
    }

    .search-pane {
        width: 60%;
        margin: 0 auto 10px;
    }
</style>
