<template>
    <div>
        <div class="dictionarytype-search-panel">
            <el-row>
                <el-col :span="12">
                    <el-input v-model="search_word" class="handle-input"
                              @keyup.enter.native="handleSearch" suffix-icon="el-icon-search" placeholder="输入类型">
                    </el-input>
                </el-col>
                <el-col :span="12" align="right">
                    <el-dropdown @command="handleTypeCommand" trigger="click">
                          <span class="el-dropdown-link">
<!--                              操作<i class="el-icon-arrow-down"></i>-->
                              <i class="el-icon-more"></i>
                          </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="handleRefresh">刷新</el-dropdown-item>
                            <el-dropdown-item :command="handleNew">新建</el-dropdown-item>
                            <el-dropdown-item :command="handleEdit">编辑</el-dropdown-item>
                            <el-dropdown-item :command="handleDelete">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </div>
        <div class="table-data">

            <div>
                <el-tag type="primary" class="info-tag" size="large" style="width: 100%">
                    <i class="el-icon-info"></i>
                    <span>当前选中：{{currentSelectNode.text}}</span>
                </el-tag>
                <el-tree ref="tree"
                         :data="tableData"
                         :props="defaultProps"
                         @node-click="handleNodeClick"
                         :highlight-current="true"
                         class="type-tree"
                ></el-tree>
            </div>

            <!--  对话框  -->
            <div>
                <el-dialog
                        title="编辑字典类型"
                        :visible.sync="dialogVisible"
                        width="30%"
                        :show-close="showClose"
                        @closed="resetForm('dictionarytypeForm')">
                    <el-form ref="dictionarytypeForm" :model="editDictionaryTypeForm"
                             :rules="rules" label-width="80px">
                        <el-form-item label="编码" :label-width="formLabelWidth" show-message
                                      prop="code">
                            <el-input v-model="editDictionaryTypeForm.code"
                            autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="字典类型名称" :label-width="formLabelWidth" show-message
                                      prop="text">
                            <el-input v-model="editDictionaryTypeForm.text"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="状态" :label-width="formLabelWidth" show-message
                                      prop="status">
                            <el-input v-model="editDictionaryTypeForm.status"
                                      autocomplete="off"></el-input>
                        </el-form-item>

                    </el-form>
                    <span slot="footer" class="dialog-footer">
                <el-button @click="toggleEditDialog">取 消</el-button>
                <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
             </span>
                </el-dialog>

                <el-dialog
                        title="新建字典类型"
                        :visible.sync="newDialogVisible"
                        width="30%"
                        :show-close="showClose"
                        @closed="resetForm('newDictionaryTypeForm')">
                    <el-form ref="newDictionaryTypeForm" :model="newDictionaryTypeForm" :rules="rules"
                             label-width="80px" size="small">

                        <el-form-item label="编码" :label-width="formLabelWidth" show-message
                                      prop="code">
                            <el-input v-model="newDictionaryTypeForm.code"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="字典类型名称" :label-width="formLabelWidth" show-message
                                      prop="text">
                            <el-input v-model="newDictionaryTypeForm.text"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="状态" :label-width="formLabelWidth" show-message
                                      prop="status">
                            <el-input v-model="newDictionaryTypeForm.status"
                                      autocomplete="off"></el-input>
                        </el-form-item>

                    </el-form>
                    <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('newDictionaryTypeForm')">清 空</el-button>
                <el-button @click="toggleNewDialog">取 消</el-button>
                <el-button type="primary" @click="handleNewConfirm">确 定</el-button>
             </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    import bus from '../../../components/common/bus.js'

    export default {
        name: "DictionaryType",
        data() {
            return {
                buttonPerms: {
                    save: ['system:dictionarytype:save'],
                    edit: ['system:dictionarytype:edit'],
                    delete: ['system:dictionarytype:delete'],
                    batchDelete: ['system:dictionarytype:batchDelete'],
                    operateCol: ['system:dictionarytype:edit', 'system:dictionarytype:delete']
                },
                loading: false,
                tableData: [],  //表格数据
                pageData: {     //分页数据
                    currPage: 1,
                    pageSize: 20,
                    totalPage: 0
                },
                search_word: '',
                dialogVisible: false, //信息查看对话框
                newDialogVisible: false, //新建对话框
                showClose: false,  //对话框右上角x图标
                formLabelWidth: '120px',
                deleteDictionaryTypeIds: [],
                newDictionaryTypeForm: {
                    id: '',
                    code: '',
                    status: '',
                    text: ''
                },
                editDictionaryTypeForm: {
                    id: '',
                    code: '',
                    status: '',
                    text: ''
                },
                rules: {
                    code: {required: true, trigger: 'blur', message: '请输入编码'},
                    text:{required: true, trigger: 'blur', message: '请输入字典类型名称'}

                },
                defaultProps: {
                    label: "text"
                },
                searchCondition: {},
                currentSelectNode: ''
            }
        },
        created() {
            this.refreshTableData();
        },
        methods: {
            handleCurrentChange: function (curr) {
                this.listParams.currPage = curr
                this.refreshTableData()
            },
            handleSizeChange: function (size) {
                this.listParams.pageSize = size
                this.refreshTableData()
            },
            toggleNewDialog: function () {
                this.newDialogVisible = !this.newDialogVisible
            },
            toggleEditDialog: function () {
                this.dialogVisible = !this.dialogVisible
            },
            refreshTableData: function (condition) {
                this.loading = true;
                if (!condition) {
                    condition = {}
                }
                this.$axios.post(this.$Api.dictionaryType.listAll, condition).then(
                    result => {
                        if (result.data.code === 200) {
                            this.tableData = result.data.msg;
                            bus.$emit("refreshTypeData", this.tableData)  //刷新item的类型下拉菜单
                            this.loading = false;
                        }
                        // console.log(result.data)
                    }
                ).catch(
                    error => {
                        this.$message.error("获取数据错误")
                    }
                );
            },
            handleRefresh: function () {
                this.refreshTableData()
            },
            handleEdit: function () {
                let node = this.$refs.tree.getCurrentNode();
                let data = {};
                if (node) {
                    data = {id: node.id};
                    this.$axios.post(this.$Api.dictionaryType.find, data).then(
                        result => {
                            if (result.data.code === 200) {
                                // this.editUserForm = result.data.msg
                                // console.log(result)
                                for (let f in this.editDictionaryTypeForm) {
                                    this.editDictionaryTypeForm[f] = result.data.msg[f]
                                }
                                this.toggleEditDialog()
                            } else {
                                this.$message.error(result.data.msg)
                            }
                        }
                    ).catch(
                        error => {
                            this.$message.error("获取数据错误")
                        }
                    );
                } else {
                    this.$message.warning("请选择字典类型")
                }
            },
            handleNew: function () {
                this.newDialogVisible = !this.newDialogVisible
            },
            handleEditConfirm: function () {
                this.$refs['dictionarytypeForm'].validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.dictionaryType.update, this.editDictionaryTypeForm).then(
                            result => {
                                if (result.data.code === 200) {
                                    this.$message.success(result.data.msg)
                                    this.toggleEditDialog()   //关闭对话框
                                    this.refreshTableData() //刷新表格
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
                this.$refs['newDictionaryTypeForm'].validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.dictionaryType.save, this.newDictionaryTypeForm).then(
                            result => {
                                if (result.data.code === 200) {
                                    this.$message.success(result.data.msg)
                                    this.toggleNewDialog()   //关闭对话框
                                    this.refreshTableData() //刷新表格
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
            handleDelete: function () {
                let node = this.$refs.tree.getCurrentNode();
                let data = {};
                if (node) {
                    data = {id: node.id};
                    this.$confirm("确定删除吗？").then(
                        y => {
                            this.$axios.post(this.$Api.dictionaryType.delete, data).then(
                                result => {
                                    if (result.data.code === 200) {
                                        this.$message.success(result.data.msg)
                                        this.refreshTableData() //刷新表格

                                        bus.$emit("itemTableRefresh")//通知item表格刷新
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
                } else {
                    this.$message.warning("请选择字典类型")
                }
            },
            batchDelete: function () {
                if (this.deleteDictionaryTypeIds.length !== 0) {
                    this.$confirm("确定删除吗？").then(
                        y => {
                            this.$axios.post(this.$Api.dictionaryType.deleteBatch, {"deleteDictionaryTypeIds": this.deleteDictionaryTypeIds}).then(
                                result => {
                                    if (result.data.code === 200) {
                                        this.$message.success(result.data.msg)
                                        this.refreshTableData() //刷新表格
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
                if (this.search_word) {
                    this.searchCondition = {text: this.search_word}  //模糊查询
                    this.refreshTableData(this.searchCondition);
                }
            },
            handleSelectionChange: function (selection) {
                this.deleteDictionaryTypeIds = []
                for (let item in selection) {
                    this.deleteDictionaryTypeIds[item] = selection[item].id
                }
            },
            resetForm: function (formName) {
                this.$refs[formName].resetFields();
            },
            handleNodeClick: function (data, node, tree) {
                bus.$emit("treeNodeClick", data);
                this.currentSelectNode = data
            },
            handleTypeCommand: function (command) {
                command();
            }
        }
    }
</script>

<style scoped>
    .dictionarytype-search-panel {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 200px;
        display: inline-block;
        margin-right: 20px;
    }

    .el-dropdown-link {
        cursor: pointer;
        font-size: 24px;
    }

    .info-tag * {
        margin: 0 5px;
        font-size: 14px;
    }

    .info-tag {
        margin: 10px 0;
    }

</style>
