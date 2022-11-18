<template>
    <div>
        <div class="dictionaryItem-search-panel">
            <el-row>
                <el-col :span="6">
                    <el-input v-model="search_word" placeholder="" class="handle-input"
                              @keyup.enter.native="handleSearch"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                </el-col>
                <el-col :span="4" :offset="14" align="right">
                    <el-dropdown @command="handleItemCommand" trigger="click">
                          <span class="el-dropdown-link">
                              <i class="el-icon-more"></i>
                          </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="handleRefresh">刷新</el-dropdown-item>
                            <el-dropdown-item :command="handleNew">新建</el-dropdown-item>
                            <el-dropdown-item :command="batchDelete">批量删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
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
                        label="类型"
                        fit>
                    <template slot-scope="scope">
                        {{scope.row.type.text}}
                    </template>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="text"
                        label="字典内容"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="value"
                        label="值"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="sort"
                        label="序号"
                        fit>
                </el-table-column>

                <el-table-column label="操作" resizable v-if="this.$_has(buttonPerms.operateCol)">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="primary"
                                @click="handleEdit(scope.$index, scope.row)" v-has-perm="buttonPerms.edit">编辑
                        </el-button>
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

            <div>
                <el-dialog
                        title="编辑数据字典"
                        :visible.sync="dialogVisible"
                        width="30%"
                        :show-close="showClose"
                        @closed="resetForm('dictionaryItemForm')">
                    <el-form ref="dictionaryItemForm" :model="editDictionaryItemForm"
                             :rules="rules" label-width="80px">

                        <el-form-item label="序号" :label-width="formLabelWidth" show-message
                                      prop="sort">
                            <el-input v-model="editDictionaryItemForm.sort"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="字典内容" :label-width="formLabelWidth" show-message
                                      prop="text">
                            <el-input v-model="editDictionaryItemForm.text"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="值" :label-width="formLabelWidth" show-message
                                      prop="value">
                            <el-input v-model="editDictionaryItemForm.value"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="类型" :label-width="formLabelWidth" show-message
                                      prop="typeId">
                            <!--                            <el-input v-model="editDictionaryItemForm.typeId"-->
                            <!--                                      autocomplete="off"></el-input>-->
                            <el-select v-model="editDictionaryItemForm.typeId" filterable placeholder="请选择">
                                <el-option
                                        v-for="item in selectOptions"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="toggleEditDialog">取 消</el-button>
                        <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
                     </span>
                </el-dialog>

                <el-dialog
                        title="新建数据字典"
                        :visible.sync="newDialogVisible"
                        width="30%"
                        :show-close="showClose"
                        @closed="resetForm('newDictionaryItemForm')">
                    <el-form ref="newDictionaryItemForm" :model="newDictionaryItemForm" :rules="rules"
                             label-width="80px" size="small">

                        <el-form-item label="序号" :label-width="formLabelWidth" show-message
                                      prop="sort">
                            <el-input v-model="newDictionaryItemForm.sort"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="字典内容" :label-width="formLabelWidth" show-message
                                      prop="text">
                            <el-input v-model="newDictionaryItemForm.text"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="值" :label-width="formLabelWidth" show-message
                                      prop="value">
                            <el-input v-model="newDictionaryItemForm.value"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="类型" :label-width="formLabelWidth" show-message
                                      prop="typeId">
                            <!--                            <el-input v-model="newDictionaryItemForm.typeId"-->
                            <!--                                      autocomplete="off"></el-input>-->
                            <el-select v-model="newDictionaryItemForm.typeId" filterable placeholder="请选择">
                                <el-option
                                        v-for="item in selectOptions"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="resetForm('newDictionaryItemForm')">清 空</el-button>
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
        name: "DictionaryItem",
        data() {
            return {
                buttonPerms: {
                    save: ['system:dictionaryItem:save'],
                    edit: ['system:dictionaryItem:edit'],
                    delete: ['system:dictionaryItem:delete'],
                    batchDelete: ['system:dictionaryItem:batchDelete'],
                    operateCol: ['system:dictionaryItem:edit', 'system:dictionaryItem:delete']
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
                deleteDictionaryItemIds: [],
                listParams: {
                    currPage: 1,
                    pageSize: 20,
                    entity: {},
                },
                newDictionaryItemForm: {
                    id: '',
                    sort: '',
                    text: '',
                    value: '',
                    typeId: ''
                },
                editDictionaryItemForm: {
                    id: '',
                    sort: '',
                    text: '',
                    value: '',
                    typeId: ''
                },
                rules: {
                    text: {required: true, trigger: 'blur', message: '请输入字典名称'},
                    value: {required: true, trigger: 'blur', message: '请输入字典值'},
                    typeId: {required: true, trigger: 'blur', message: '请选择字典类型'}
                },
                selectOptions: []
            }
        },
        created() {
            this.refreshTableData(this.listParams);
            bus.$on("treeNodeClick", msg => {   //点击类型时，刷新右侧表格
                this.handleTreeNodeClick(msg)
            });
            bus.$on("itemTableRefresh", () => {     //删除类型时，同时刷新数据表
                this.refreshTableData(this.listParams)
            });
            bus.$on("refreshTypeData", (msg) => {   //下拉菜单数据监听
                this.selectOptions = msg
            });
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
                this.$axios.post(this.$Api.dictionaryItem.listItemsWithType, listParams).then(
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
                // console.log(id)
                let data = {
                    id: id
                }
                this.$axios.post(this.$Api.dictionaryItem.find, data).then(
                    result => {
                        if (result.data.code === 200) {
                            // this.editUserForm = result.data.msg
                            // console.log(result)
                            for (let f in this.editDictionaryItemForm) {
                                this.editDictionaryItemForm[f] = result.data.msg[f]
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
            },
            handleNew: function () {
                this.newDialogVisible = !this.newDialogVisible
            },
            handleEditConfirm: function () {
                this.$refs['dictionaryItemForm'].validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.dictionaryItem.update, this.editDictionaryItemForm).then(
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
                this.$refs['newDictionaryItemForm'].validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.dictionaryItem.save, this.newDictionaryItemForm).then(
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
                        this.$axios.post(this.$Api.dictionaryItem.delete, {"id": row.id}).then(
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
                if (this.deleteDictionaryItemIds.length !== 0) {
                    this.$confirm("确定删除吗？").then(
                        y => {
                            this.$axios.post(this.$Api.dictionaryItem.deleteBatch, {"deleteDictionaryItemIds": this.deleteDictionaryItemIds}).then(
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
                this.deleteDictionaryItemIds = []
                for (let item in selection) {
                    this.deleteDictionaryItemIds[item] = selection[item].id
                }
            },
            resetForm: function (formName) {
                this.$refs[formName].resetFields();
            },
            handleTreeNodeClick: function (msg) {
                let id = msg.id;
                this.listParams.entity = {typeId: id};
                this.refreshTableData(this.listParams)
            },
            handleItemCommand: function (command) {
                command();
            },
            handleRefresh: function () {
                this.refreshTableData(this.listParams);
            }
        }
    }
</script>

<style scoped>
    .dictionaryItem-search-panel {
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
</style>
