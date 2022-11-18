<template>
    <div class="dictionary-container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-document"></i> 字典管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="dictionary-main">
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-card class="dictionary-type-card" shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>字典类型</span>
                        </div>
                        <div class="dict-type">
                            <dictionary-type/>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="18">
                    <el-card class="dictionary-item-card" shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>数据字典</span>
                        </div>
                        <div class="dict-item">
                            <dictionary-item/>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import DictionaryType from './DictionaryType'
    import DictionaryItem from './DictionaryItem'

    export default {
        name: "DictionaryPage",
        components: {
            DictionaryType, DictionaryItem
        }
    }
</script>

<style lang="scss" scoped>
    .dictionary-main {
        width: 100%;
        height: 100%;
    }

    .dictionary-type-card, .dictionary-item-card {
        height: 720px;
        overflow-y: scroll;
    }

    .dictionary-type-card::-webkit-scrollbar, .dictionary-item-card::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    /*正常情况下滑块的样式*/

    .dictionary-type-card::-webkit-scrollbar-thumb, .dictionary-item-card::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, .05);
        border-radius: 10px;
        -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, .1);
    }

    /*鼠标悬浮在该类指向的控件上时滑块的样式*/

    .dictionary-type-card:hover::-webkit-scrollbar-thumb, .dictionary-item-card:hover::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, .2);
        border-radius: 10px;
        -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, .1);
    }

    /*鼠标悬浮在滑块上时滑块的样式*/

    .dictionary-type-card::-webkit-scrollbar-thumb:hover, .dictionary-item-card::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, .4);
        -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, .1);
    }

    /*正常时候的主干部分*/

    .dictionary-type-card::-webkit-scrollbar-track, .dictionary-item-card::-webkit-scrollbar-track {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
        background-color: white;
    }

    /*鼠标悬浮在滚动条上的主干部分*/

    .dictionary-type-card::-webkit-scrollbar-track:hover, .dictionary-item-card::-webkit-scrollbar-track:hover {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .4);
        background-color: rgba(0, 0, 0, .01);
    }


</style>
