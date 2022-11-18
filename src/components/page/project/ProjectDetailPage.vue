<template>
    <div class="project-detail">
        <el-card class="project-detail-card">
            <el-page-header @back="goBack" content="项目信息">
            </el-page-header>


            <el-tabs class="detail-tabs" key="detail-tabs" @tab-click="tabClick">
                <el-tab-pane label="基础信息">
                    <div class="project-info-header">
                        <el-row>
                            <el-col :span="12">
                                <div class="project-name">
                                    <span>{{obj.proName}}</span>
                                </div>
                            </el-col>
                            <el-col :span="12" align="right">
                                <div class="project-edit-btn">
                                    <el-button type="primary" @click="toggleEditDialog">修改</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>


                    <div class="project-info-content">
                        <!--            {{obj}}-->
                        <table>
                            <tr>
                                <td>项目号:</td>
                                <td>{{obj.proId}}</td>
                            </tr>
                            <tr>
                                <td>项目经理:</td>
                                <td>{{obj.proMgr}}</td>
                            </tr>
                            <tr>
                                <td>客户名称:</td>
                                <td>{{obj.customerName}}</td>
                            </tr>
                            <tr>
                                <td>调试人员:</td>
                                <td>{{obj.proDebugger}}</td>
                            </tr>
                            <tr>
                                <td>图纸档案号:</td>
                                <td>{{obj.proDrawingId}}</td>
                            </tr>
                            <tr>
                                <td>设备编号:</td>
                                <td>{{obj.deviceId}}</td>
                            </tr>
                            <tr>
                                <td>设备名称:</td>
                                <td>{{obj.deviceName}}</td>
                            </tr>
                            <tr>
                                <td>设备描述:</td>
                                <td>{{obj.deviceComment}}</td>
                            </tr>
                            <tr>
                                <td>设计人:</td>
                                <td>{{obj.deviceDesigner}}</td>
                            </tr>
                            <tr>
                                <td>出厂日期:</td>
                                <td>{{obj.deviceProduceDate}}</td>
                            </tr>
                            <tr>
                                <td>场站地址:</td>
                                <td>{{obj.proAddr}}</td>
                            </tr>
                        </table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="地理位置">
                    <div class="project-info-map">
                        <g-d-map v-if="!detailMapUpdate" :container-id="detailContainerID" :clickable="false" :show-search-component="false"
                                 :coordinate="[obj.proLng,obj.proLat]"></g-d-map>
                    </div>
                </el-tab-pane>
            </el-tabs>

        </el-card>

        <!--编辑-->
        <el-dialog
                title="编辑项目"
                :visible.sync="dialogVisible"
                width="40%"
                :show-close="showClose"
                @closed="resetForm('projectForm')"
                v-if="!update"
        >
            <el-form ref="projectForm" :model="editProjectForm" label-position="right"
                     label-width="80px" size="small">
                <el-tabs class="form-tabs" key="form-tabs">
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
                                     :container-id="editMapContainerID"
                                     :show-address="true"
                                     :on-click="editMapClick"
                                     :on-get-address="editGetAddress"
                                     :coordinate="[editProjectForm.proLng,editProjectForm.proLat]"
                                     v-model="editProjectForm.proAddr"
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
    </div>

</template>

<script>

    import GDMap from "../../common/AMap";

    export default {
        name: "ProjectDetailPage",
        components: {
            GDMap
        },
        data() {
            return {
                dialogVisible: false,
                formLabelWidth: '100px',
                detailMapUpdate: false,
                update: false,
                dic_deviceTypes: [],
                showClose: false,
                detailContainerID: "detail-map-container",
                editMapContainerID: "edit-map-container",
                id: '',
                obj: {}, //显示基础信息
                editProjectForm: { //修改时使用
                    id: '',
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
            }
        },
        methods: {
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
            resetForm: function (formName) {
                this.$refs[formName].resetFields();
                //刷新对话框中的地图
                this.update = true;
                this.$nextTick(() => {
                    this.update = false;
                });
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
            toggleEditDialog: function () {
                this.dialogVisible = !this.dialogVisible
            },
            findProjectDetail: function () {
                this.$axios.post(this.$Api.project.find, {id: this.id}).then(
                    result => {
                        if (result.data.code === 200) {
                            this.obj = {...(result.data.msg)};
                            for (let f in this.editProjectForm) {
                                this.editProjectForm[f] = result.data.msg[f]
                            }
                        } else {
                            this.$message.error(result.data.msg);
                        }
                    }
                ).catch(
                    error => {
                        this.$message.error('出现未知错误，查询失败！')
                    }
                );
            },
            goBack: function () {
                this.$router.push("/project/manage");
            },
            tabClick: function (obj) {
                if (obj.index === '1') {
                    this.detailMapUpdate = true;
                    this.$nextTick(() => {
                        this.detailMapUpdate = false;
                    });
                }
            }
        },
        created() {
            this.getDic_deviceTypes();
            this.id = this.$route.query.id;
            this.findProjectDetail();
        }
    }
</script>

<style lang="scss" scoped>
    .project-detail-card {
        width: 98%;
        margin: 0 auto;
    }

    .addr-map {
        width: 100%;
        height: 400px;
        display: inline-block;
    }

    .project-name {
        width: 100%;
        height: 100%;
        font-size: 20px;
        padding-left: 3%;
    }

    .project-info-header {
        padding: 0 0 1%;
        border-bottom: 1px solid #dcdee3;
    }

    .project-edit-btn {
        width: 100%;
        height: 100%;
        padding-right: 3%;
    }

    .project-info-content {
        padding: 1% 1% 0;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        color: rgba(0, 0, 0, 0.6);

        td {
            padding: 5px 10px 5px 0;
        }
    }

    .project-info-map {
        width: 100%;
        height: 600px;
    }
</style>
