<template>
    <div class="project-table-container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-document"></i> 项目管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="project-search-panel">
            <el-row>
                <el-col :span="6">
                    <el-input v-model="search_word" placeholder="" class="handle-input"
                              @keyup.enter.native="handleSearch"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                </el-col>
                <el-col :span="4" :offset="14" align="right">
                    <el-button type="primary" icon="el-icon-plus" @click="handleNew" v-has-perm="buttonPerms.save">新建
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="batchDelete"
                               v-has-perm="buttonPerms.batchDelete">批量删除
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <div class="table-data">
            <el-table
                    v-loading="loading"
                    ref="multipleTable"
                    :data="tableData"
                    border
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>

                <el-table-column
                        sortable
                        resizable
                        prop="proId"
                        label="项目号"
                        fit>
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleManage(scope.$index, scope.row)">
                            {{scope.row.proId}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="proName"
                        label="项目名称"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="proMgr"
                        label="项目经理"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="customerName"
                        label="客户名称"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="proDebugger"
                        label="调试人员"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="proDrawingId"
                        label="图纸档案号"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="deviceId"
                        label="设备编号"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="deviceName"
                        label="设备名称"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="deviceComment"
                        label="设备描述"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="deviceDesigner"
                        label="设计人"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="deviceProduceDate"
                        label="出厂日期"
                        fit>
                </el-table-column>
                <!--                <el-table-column-->
                <!--                        sortable-->
                <!--                        resizable-->
                <!--                        prop="proAddr"-->
                <!--                        label="场站地址"-->
                <!--                        fit>-->
                <!--                </el-table-column>-->
                <!--                <el-table-column-->
                <!--                        sortable-->
                <!--                        resizable-->
                <!--                        prop="toMonitorCenter"-->
                <!--                        label="是否上传监控中心"-->
                <!--                        fit>-->
                <!--                </el-table-column>-->

                <el-table-column label="操作" resizable v-if="this.$_has(buttonPerms.operateCol)" align="center">
                    <template slot-scope="scope">
<!--                                                <el-button-->
<!--                                                        size="mini"-->
<!--                                                        type="primary"-->
<!--                                                        @click="handleEdit(scope.$index, scope.row)" v-has-perm="buttonPerms.edit">编辑-->
<!--                                                </el-button>-->
<!--                        <el-button-->
<!--                                size="mini"-->
<!--                                type="primary"-->
<!--                                @click="handleManage(scope.$index, scope.row)" v-has-perm="buttonPerms.edit">管理-->
<!--                        </el-button>-->
                        <br>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)" v-has-perm="buttonPerms.delete">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :page-sizes="[1,10,20,50,100]"
                    :current-page.sync="pageData.currPage"
                    :page-size="pageData.pageSize"
                    :total="pageData.totalPage"
                    layout="sizes,total, prev, pager, next"
                    align="right">
            </el-pagination>
            <!-- ---------------------------对话框------------------------------- -->

        </div>
        <!--编辑-->
        <el-dialog
                title="编辑项目"
                :visible.sync="dialogVisible"
                width="40%"
                :show-close="showClose"
                @closed="resetForm('projectForm')"
                v-if="!update"
        >


            <el-form ref="projectForm" :model="editProjectForm" :rules="rules" label-position="right"
                     label-width="80px" size="small">
                <el-tabs>
                    <!--tab pane 1-->
                    <el-tab-pane label="基本信息">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="项目号" :label-width="formLabelWidth" show-message
                                              prop="proId">
                                    <el-input v-model="editProjectForm.proId"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="项目名称" :label-width="formLabelWidth" show-message
                                              prop="proName">
                                    <el-input v-model="editProjectForm.proName"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="项目经理" :label-width="formLabelWidth" show-message
                                              prop="proMgr">
                                    <el-input v-model="editProjectForm.proMgr"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="客户名称" :label-width="formLabelWidth" show-message
                                              prop="customerName">
                                    <el-input v-model="editProjectForm.customerName"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="调试人员" :label-width="formLabelWidth" show-message
                                              prop="proDebugger">
                                    <el-input v-model="editProjectForm.proDebugger"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="图纸档案号" :label-width="formLabelWidth" show-message
                                              prop="proDrawingId">
                                    <el-input v-model="editProjectForm.proDrawingId"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="设备编号" :label-width="formLabelWidth" show-message
                                              prop="deviceId">
                                    <el-input v-model="editProjectForm.deviceId"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设备名称" :label-width="formLabelWidth" show-message
                                              prop="deviceName">
                                    <el-input v-model="editProjectForm.deviceName"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="设备描述" :label-width="formLabelWidth" show-message
                                              prop="deviceComment">
                                    <el-input v-model="editProjectForm.deviceComment"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设计人" :label-width="formLabelWidth" show-message
                                              prop="deviceDesigner">
                                    <el-input v-model="editProjectForm.deviceDesigner"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-form-item label="出厂日期" :label-width="formLabelWidth" show-message
                                      prop="deviceProduceDate">
                            <el-date-picker
                                    v-model="editProjectForm.deviceProduceDate"
                                    type="date"
                                    :editable="false"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-tab-pane>


                    <!--tab pane 2-->
                    <el-tab-pane label="地址">

                        <div class="addr-map">
                            <g-d-map v-if="!update"
                                     :show-address="true"
                                     :on-click="editMapClick"
                                     :on-get-address="editGetAddress"
                                     v-model="editProjectForm.proAddr"
                                     :coordinate="[editProjectForm.proLng,editProjectForm.proLat]"
                            ></g-d-map>
                        </div>
                        <br>
                        <el-col :span="10">
                            <el-form-item label="经度" :label-width="formLabelWidth" show-message
                                          prop="proLng">
                                <el-input v-model="editProjectForm.proLng"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" :offset="4">
                            <el-form-item label="纬度" :label-width="formLabelWidth" show-message
                                          prop="proLat">
                                <el-input v-model="editProjectForm.proLat"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-form-item label="场站地址" :label-width="formLabelWidth" show-message
                                      prop="proAddr">
                            <el-input v-model="editProjectForm.proAddr"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="监控中心">
                        <el-form-item label="是否上传监控中心" label-width="140px" show-message
                                      prop="toMonitorCenter">
                            <el-switch
                                    v-model="editProjectForm.toMonitorCenter"
                                    active-text="是"
                                    inactive-text="否"
                                    :active-value="1"
                                    :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                        <transition name="el-zoom-in-top">
                            <div v-if="editProjectForm.toMonitorCenter">
                                <el-card shadow="never" class="device-card" :body-style="{padding:'0px'}">
                                    <div slot="header">
                                        <span>通讯设备</span>
                                        <el-button style="float: right; padding: 3px 0" type="text"
                                                   @click="addDevice(editProjectForm)">
                                            <i class="el-icon-plus"></i>
                                            <span>添加设备</span>
                                        </el-button>
                                    </div>

                                    <div class="device-item">
                                        <el-form class="deviceForm" ref="deviceForm" inline
                                                 v-for="(obj,index) in editProjectForm.projectDeviceDOs"
                                                 :key="index" size="mini">
                                            <el-card class="device-item-card" shadow="never">
                                                <div slot="header">
                                                    <span>设备{{index+1}}</span>
                                                    <el-button type="text" size="mini"
                                                               @click="handleDeleteDevice(editProjectForm,obj)"
                                                               style="float: right; padding: 3px 0">删除
                                                    </el-button>
                                                </div>
                                                <el-form-item label="设备类型">
                                                    <el-select v-model="obj.deviceType" placeholder="请选择类型">
                                                        <el-option v-for="(item,index) in dic_deviceTypes"
                                                                   :key="index"
                                                                   :label="item.text"
                                                                   :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>

                                                <el-form-item label="序列号">
                                                    <el-input v-model="obj.deviceSerial"></el-input>
                                                </el-form-item>

                                                <el-form-item label="密码（通讯模块）">
                                                    <el-input v-model="obj.devicePassword"></el-input>
                                                </el-form-item>

                                                <el-form-item label="调试账号">
                                                    <el-input v-model="obj.deviceDebugUser"></el-input>
                                                </el-form-item>

                                                <el-form-item label="密码（调试账号）">
                                                    <el-input v-model="obj.deviceDebugPassword"></el-input>
                                                </el-form-item>

                                                <el-form-item label="手机卡号">
                                                    <el-input v-model="obj.deviceMobile"></el-input>
                                                </el-form-item>

                                                <el-form-item label="开通时间">
                                                    <el-date-picker
                                                            v-model="obj.deviceApplyTime"
                                                            type="date"
                                                            :editable="false"
                                                            value-format="yyyy-MM-dd HH:mm:ss"
                                                            placeholder="选择日期">
                                                    </el-date-picker>
                                                </el-form-item>
                                            </el-card>
                                        </el-form>
                                    </div>
                                </el-card>
                            </div>
                        </transition>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="toggleEditDialog">取 消</el-button>
                <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
             </span>
        </el-dialog>

        <!--新建-->
        <el-dialog
                title="新建项目"
                :visible.sync="newDialogVisible"
                width="40%"
                :show-close="showClose"
                @closed="resetForm('newProjectForm')">

            <el-form ref="newProjectForm" :model="newProjectForm" :rules="rules" label-position="right"
                     label-width="80px" size="small">
                <el-tabs>
                    <!--tab pane 1-->
                    <el-tab-pane label="基本信息">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="项目号" :label-width="formLabelWidth" show-message
                                              prop="proId">
                                    <el-input v-model="newProjectForm.proId"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="项目名称" :label-width="formLabelWidth" show-message
                                              prop="proName">
                                    <el-input v-model="newProjectForm.proName"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="项目经理" :label-width="formLabelWidth" show-message
                                              prop="proMgr">
                                    <el-input v-model="newProjectForm.proMgr"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="客户名称" :label-width="formLabelWidth" show-message
                                              prop="customerName">
                                    <el-input v-model="newProjectForm.customerName"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="调试人员" :label-width="formLabelWidth" show-message
                                              prop="proDebugger">
                                    <el-input v-model="newProjectForm.proDebugger"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="图纸档案号" :label-width="formLabelWidth" show-message
                                              prop="proDrawingId">
                                    <el-input v-model="newProjectForm.proDrawingId"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="设备编号" :label-width="formLabelWidth" show-message
                                              prop="deviceId">
                                    <el-input v-model="newProjectForm.deviceId"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设备名称" :label-width="formLabelWidth" show-message
                                              prop="deviceName">
                                    <el-input v-model="newProjectForm.deviceName"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="设备描述" :label-width="formLabelWidth" show-message
                                              prop="deviceComment">
                                    <el-input v-model="newProjectForm.deviceComment"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设计人" :label-width="formLabelWidth" show-message
                                              prop="deviceDesigner">
                                    <el-input v-model="newProjectForm.deviceDesigner"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-form-item label="出厂日期" :label-width="formLabelWidth" show-message
                                      prop="deviceProduceDate">
                            <el-date-picker
                                    v-model="newProjectForm.deviceProduceDate"
                                    type="date"
                                    :editable="false"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-tab-pane>


                    <!--tab pane 2-->
                    <el-tab-pane label="地址">

                        <div class="addr-map">
                            <g-d-map v-if="!update" :on-click="newMapClick"
                                     :on-get-address="newGetAddress"
                                     :show-address="true"
                                     v-model="newProjectForm.proAddr"
                                     @geolocationComplete="geolocationComplete"

                            ></g-d-map>
                        </div>
                        <br>
                        <el-col :span="10">
                            <el-form-item label="经度" :label-width="formLabelWidth" show-message
                                          prop="proLng">
                                <el-input v-model="newProjectForm.proLng"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" :offset="4">
                            <el-form-item label="纬度" :label-width="formLabelWidth" show-message
                                          prop="proLat">
                                <el-input v-model="newProjectForm.proLat"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-form-item label="场站地址" :label-width="formLabelWidth" show-message
                                      prop="proAddr">
                            <el-input v-model="newProjectForm.proAddr"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <!--tab pane 3-->
                    <el-tab-pane label="监控中心">
                        <el-form-item label="是否上传监控中心" label-width="140px" show-message
                                      prop="toMonitorCenter">
                            <el-switch
                                    v-model="newProjectForm.toMonitorCenter"
                                    active-text="是"
                                    inactive-text="否"
                                    :active-value="1"
                                    :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                        <transition name="el-zoom-in-top">
                            <div v-if="newProjectForm.toMonitorCenter">
                                <el-card shadow="never" class="device-card" :body-style="{padding:'0px'}">
                                    <div slot="header">
                                        <span>通讯设备</span>
                                        <el-button style="float: right; padding: 3px 0" type="text"
                                                   @click="addDevice(newProjectForm)">
                                            <i class="el-icon-plus"></i>
                                            <span>添加设备</span>
                                        </el-button>
                                    </div>

                                    <div class="device-item">
                                        <el-form class="deviceForm" ref="deviceForm" inline
                                                 v-for="(obj,index) in newProjectForm.projectDeviceDOs"
                                                 :key="index" size="mini">
                                            <el-card class="device-item-card" shadow="never">
                                                <div slot="header">
                                                    <span>设备{{index+1}}</span>
                                                    <el-button type="text" size="mini"
                                                               @click="handleDeleteDevice(newProjectForm,obj)"
                                                               style="float: right; padding: 3px 0">删除
                                                    </el-button>
                                                </div>
                                                <el-form-item label="设备类型">
                                                    <el-select v-model="obj.deviceType" placeholder="请选择类型">
                                                        <el-option v-for="(item,index) in dic_deviceTypes"
                                                                   :key="index"
                                                                   :label="item.text"
                                                                   :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>

                                                <el-form-item label="序列号">
                                                    <el-input v-model="obj.deviceSerial"></el-input>
                                                </el-form-item>

                                                <el-form-item label="密码（通讯模块）">
                                                    <el-input v-model="obj.devicePassword"></el-input>
                                                </el-form-item>

                                                <el-form-item label="调试账号">
                                                    <el-input v-model="obj.deviceDebugUser"></el-input>
                                                </el-form-item>

                                                <el-form-item label="密码（调试账号）">
                                                    <el-input v-model="obj.deviceDebugPassword"></el-input>
                                                </el-form-item>

                                                <el-form-item label="手机卡号">
                                                    <el-input v-model="obj.deviceMobile"></el-input>
                                                </el-form-item>

                                                <el-form-item label="开通时间">
                                                    <el-date-picker
                                                            v-model="obj.deviceApplyTime"
                                                            type="date"
                                                            :editable="false"
                                                            value-format="yyyy-MM-dd HH:mm:ss"
                                                            placeholder="选择日期">
                                                    </el-date-picker>
                                                </el-form-item>
                                            </el-card>
                                        </el-form>
                                    </div>
                                </el-card>
                            </div>
                        </transition>
                    </el-tab-pane>
                </el-tabs>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('newProjectForm')">清 空</el-button>
                <el-button @click="toggleNewDialog">取 消</el-button>
                <el-button type="primary" @click="handleNewConfirm">确 定</el-button>
             </span>
        </el-dialog>
        <!--        {{editProjectForm}}-->
    </div>
</template>

<script>
    import GDMap from "../../common/AMap"

    export default {
        name: "ProjectPage",
        components: {
            GDMap
        },
        data() {
            return {
                buttonPerms: {
                    save: ['project:manage:save'],
                    edit: ['project:manage:edit'],
                    delete: ['project:manage:delete'],
                    batchDelete: ['project:manage:batchDelete'],
                    operateCol: ['project:manage:edit', 'project:manage:delete']
                },
                loading: false,
                update: false,  //刷新组件使用 初始设置v-if="!update"
                tableData: [],  //表格数据
                pageData:
                    {     //分页数据
                        currPage: 1,
                        pageSize: 20,
                        totalPage: 0
                    }
                ,
                search_word: '',
                dialogVisible: false, //信息查看对话框
                newDialogVisible: false, //新建对话框
                showClose: false,  //对话框右上角x图标
                formLabelWidth: '100px',
                deleteProjectIds: [],
                listParams:
                    {
                        currPage: 1,
                        pageSize: 20,
                        entity: {}
                    }
                ,
                newProjectForm: {
                    proId: '',
                    proName: '',
                    proMgr: '',
                    customerName: '',
                    proDebugger: '',
                    proDrawingId: '',
                    deviceId: '',
                    deviceName: '',
                    deviceComment: '',
                    deviceDesigner: '',
                    deviceProduceDate: '',
                    proLng: '',
                    proLat: '',
                    proAddr: '',
                    proProvince: '',
                    proCity: '',
                    proDistrict: '',
                    proDetail: '',
                    toMonitorCenter: '',
                    projectDeviceDOs: []
                }
                ,
                editProjectForm: {
                    id: '',
                    proId:
                        '',
                    proName:
                        '',
                    proMgr:
                        '',
                    customerName:
                        '',
                    proDebugger:
                        '',
                    proDrawingId:
                        '',
                    deviceId:
                        '',
                    deviceName:
                        '',
                    deviceComment:
                        '',
                    deviceDesigner:
                        '',
                    deviceProduceDate:
                        '',
                    proLng:
                        '',
                    proLat:
                        '',
                    proAddr:
                        '',
                    proProvince:
                        '',
                    proCity:
                        '',
                    proDistrict:
                        '',
                    proDetail:
                        '',
                    toMonitorCenter:
                        '',
                    projectDeviceDOs:
                        []
                },
                rules: {},
                dic_deviceTypes: []
            }
        },
        created() {
            this.refreshTableData(this.listParams);
            this.getDic_deviceTypes();
        },
        methods: {
            handleCurrentChange: function (curr) {
                this.listParams.currPage = curr
                this.refreshTableData(this.listParams)
            },
            handleSizeChange: function (size) {
                this.listParams.pageSize = size
                this.refreshTableData(this.listParams)
            },
            toggleNewDialog: function () {
                this.newDialogVisible = !this.newDialogVisible
            },
            toggleEditDialog: function () {
                this.dialogVisible = !this.dialogVisible
            },
            refreshTableData: function (listParams) {
                this.loading = true;
                this.$axios.post(this.$Api.project.list, listParams).then(
                    result => {
                        if (result.data.code === 200) {
                            this.tableData = result.data.msg.records
                            this.pageData.currPage = result.data.msg.current
                            this.pageData.pageSize = result.data.msg.size
                            this.pageData.totalPage = result.data.msg.total

                            this.loading = false;
                        }
                        // console.log(result.data)
                    }
                ).catch(
                    error => {
                        this.$message.error("获取数据错误")
                    }
                )
            },
            handleEdit: function (index, row) {
                let id = row.id
                // console.log(roleId)
                let data = {
                    id: id
                }
                this.$axios.post(this.$Api.project.find, data).then(
                    result => {
                        if (result.data.code === 200) {
                            // this.editUserForm = result.data.msg
                            // console.log(result)
                            this.$nextTick(() => {
                                for (let f in this.editProjectForm) {
                                    this.editProjectForm[f] = result.data.msg[f]
                                }
                                this.toggleEditDialog()
                            });

                        } else {
                            this.$message.error(result.data.msg)
                        }
                    }
                ).catch(
                    error => {
                        this.$message.error("获取数据错误")
                    }
                );
            },
            handleNew: function () {
                this.newDialogVisible = !this.newDialogVisible
            },
            handleEditConfirm: function () {
                this.$refs['projectForm'].validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.project.update, this.editProjectForm).then(
                            result => {
                                if (result.data.code === 200) {
                                    this.$message.success(result.data.msg)
                                    this.toggleEditDialog()   //关闭对话框
                                    this.refreshTableData(this.listParams) //刷新表格
                                } else {
                                    this.$message.error(result.data.msg)
                                }
                            }
                        ).catch(
                            error => {
                                this.$message.error('出现未知错误，保存失败！')
                            }
                        );
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            handleNewConfirm: function () {
                this.$refs['newProjectForm'].validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.project.save, this.newProjectForm).then(
                            result => {
                                if (result.data.code === 200) {
                                    this.$message.success(result.data.msg)
                                    this.toggleNewDialog()   //关闭对话框
                                    this.refreshTableData(this.listParams) //刷新表格
                                } else {
                                    this.$message.error(result.data.msg)
                                }
                            }
                        ).catch(
                            error => {
                                this.$message.error('出现未知错误，保存失败！')
                            }
                        );
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            handleDelete: function (index, row) {
                this.$confirm("确定删除吗？").then(
                    y => {
                        this.$axios.post(this.$Api.project.delete, {"id": row.id, "proId": row.proId}).then(
                            result => {
                                if (result.data.code === 200) {
                                    this.$message.success(result.data.msg)
                                    this.refreshTableData(this.listParams) //刷新表格
                                } else {
                                    this.$message.error(result.data.msg)
                                }
                            }
                        ).catch(
                            error => {
                                this.$message.error('出现未知错误，删除失败！')
                            }
                        );
                    })
            },
            batchDelete: function () {
                if (this.deleteProjectIds.length !== 0) {
                    this.$confirm("确定删除吗？").then(
                        y => {
                            this.$axios.post(this.$Api.project.deleteBatch, {"deleteProjectIds": this.deleteProjectIds}).then(
                                result => {
                                    if (result.data.code === 200) {
                                        this.$message.success(result.data.msg)
                                        this.refreshTableData(this.listParams) //刷新表格
                                    } else {
                                        this.$message.error(result.data.msg)
                                    }
                                }
                            ).catch(
                                error => {
                                    this.$message.error('出现未知错误，删除失败！')
                                }
                            );
                        }
                    ).catch(
                        /*n => {
                            console.log(n+"取消操作")
                        }*/
                    )
                } else {
                    this.$message.error('请选择要删除的行！')
                }
            },
            handleSearch: function () {

            },
            handleSelectionChange: function (selection) {
                this.deleteProjectIds = []
                for (let item in selection) {
                    this.deleteProjectIds[item] = selection[item].id
                }
            },
            resetForm: function (formName) {
                this.$refs[formName].resetFields();
                //刷新对话框中的地图
                this.update = true;
                this.$nextTick(() => {
                    this.update = false;
                });

            },

            newMapClick: function (e) {
                let {lng, lat} = e.lnglat
                this.newProjectForm.proLng = lng;
                this.newProjectForm.proLat = lat;
            },
            editMapClick: function (e) {
                let {lng, lat} = e.lnglat
                this.editProjectForm.proLng = lng;
                this.editProjectForm.proLat = lat;
            },
            editGetAddress: function (result) {
                let {province, city, district, township, street, streetNumber} = result.addressComponent
                let detailArray = [township, street, streetNumber]
                this.editProjectForm.proProvince = province;
                this.editProjectForm.proCity = city;
                this.editProjectForm.proDistrict = district;
                this.editProjectForm.proDetail = detailArray.join("");
                // console.log(result)
                // console.log(result.formattedAddress);
                // console.log(province, city, district, township, street, streetNumber);
            },
            newGetAddress: function (result) {
                let {province, city, district, township, street, streetNumber} = result.addressComponent
                let detailArray = [township, street, streetNumber]
                this.newProjectForm.proProvince = province;
                this.newProjectForm.proCity = city;
                this.newProjectForm.proDistrict = district;
                this.newProjectForm.proDetail = detailArray.join("");
            },
            addDevice: function (form) {
                form.projectDeviceDOs.push(
                    {
                        proId: form.proId,
                        deviceType: '',
                        deviceSerial: '',
                        devicePassword: '',
                        deviceDebugUser: '',
                        deviceDebugPassword: '',
                        deviceMobile: '',
                        deviceApplyTime: ''
                    }
                );
            },
            handleDeleteDevice: function (form, device) {
                let index = form.projectDeviceDOs.indexOf(device);
                if (index !== -1) {
                    form.projectDeviceDOs.splice(index, 1); //移除项
                }
            },
            handleManage: function (index, row) {
                let id = row.id;
                this.$router.push("/project/detail?id=" + id);
            },
            getDic_deviceTypes() {
                let data = {
                    code: "DEVICE-TYPE"
                }
                this.$axios.post(this.$Api.dictionaryItem.listItemsByType, data).then(
                    res => {
                        let {msg, code} = res.data;
                        if (code === 200) {
                            this.dic_deviceTypes = msg;
                        } else {
                            this.$message.error("获取数据错误");
                        }
                    }
                ).catch(
                    err => {
                        console.log(err);
                        this.$message.error("获取数据错误");
                    }
                );
            },
            geolocationComplete: function (data) {
                let {lng, lat} = data
                this.newProjectForm.proLng = lng;
                this.newProjectForm.proLat = lat;
            }
        },
        watch: {
            'editProjectForm.toMonitorCenter': {
                handler(val) {
                    if (val === 0) {
                        this.editProjectForm.projectDeviceDOs = []
                    }
                },
                deep: true
            },
            'newProjectForm.toMonitorCenter': {
                handler(val) {
                    if (val === 0) {
                        this.newProjectForm.projectDeviceDOs = []
                    }
                },
                deep: true

            }
        }
    }
</script>

<style lang="scss" scoped>
    .project-search-panel {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 200px;
        display: inline-block;
        margin-right: 20px;
    }

    .el-form {
        padding-right: 10px;
    }

    .addr-map {
        width: 100%;
        height: 400px;
    }

    .deviceForm {
        width: 100%;

        .el-input, .el-select {
            width: 130px;
        }

        .device-item-card {
            width: 100%;
        }
    }

    .device-item {
        width: auto;
        max-height: 550px;
        overflow-y: auto;
    }

</style>
