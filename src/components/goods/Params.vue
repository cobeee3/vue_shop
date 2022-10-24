<template>
  <div>
    <BcrumbT>
      <template v-slot:title1>商品管理</template>
      <template v-slot:title2>参数列表</template>
    </BcrumbT>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon closable></el-alert>
      <el-row :gutter="10" class="cat_opt">
        <el-col :span="6">
          <span>选择商品分类：</span>
          <!-- 级联选择框-->
          <el-cascader
            expand-trigger="hover"
            :options="cateList"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <!-- 动态参数 -->
        <el-tab-pane :label="titleText" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>

          <el-table :data="manyTableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tag动态标签 -->
                <el-tag
                  :key="tag"
                  v-for="tag in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数 -->
        <el-tab-pane :label="titleText" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <el-table :data="onlyTableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tag动态标签 -->
                <el-tag
                  :key="tag"
                  v-for="tag in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="resetAddForm">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="resetEditForm">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ParamsC',
  data() {
    return {
      cateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      activeName: 'many',
      attrList: [],
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addForm: {},
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入动态参数', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入动态参数', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败，亲！')
      this.cateList = res.data
    },
    handleChange() {
      this.getParamsData()
    },
    handleTabClick() {
      this.getParamsData()
    },
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return false
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      console.log(res.data)
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log('==============')
      console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error('获取分类参数列表失败，亲！')
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          if (res.meta.status !== 201) return this.$message.error('获取分类列表失败，亲！')
          this.$message.success('成功添加参数！')
          this.getParamsData()
          this.addDialogVisible = false
        }
      })
    },
    resetAddForm() {
      this.$refs.addFormRef.resetFields()
      this.addDialogVisible = false
    },
    // 编辑对话框函数
    async showEditDialog(attrid) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrid}`, {
        params: { attr_sel: this.activeName }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败！')
      }

      this.editForm = res.data
      this.editDialogVisible = true
    },
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
          )

          if (res.meta.status !== 200) {
            return this.$message.error('修改参数失败！')
          }

          this.$message.success('修改参数成功！')
          this.getParamsData()
          this.editDialogVisible = false
        }
      })
    },
    resetEditForm() {
      this.$refs.editFormRef.resetFields()
    },
    removeParams(attrid) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrid}`)

          if (res.meta.status !== 200) {
            return this.$message.error('删除参数失败！')
          }

          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getParamsData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })

      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }

      this.$message.success('修改参数项成功！')
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose(tag, row) {
      row.attr_vals.splice(tag, 1)
      this.saveAttrVals(row)
    }
  },

  computed: {
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      } else {
        return null
      }
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态参数'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.input-new-tag {
  width: 130px;
}
</style>
