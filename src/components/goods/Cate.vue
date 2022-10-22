<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- ZKTable TreeTable -->
      <tree-table
        class="TreeTable"
        :data="cateList"
        :show-index="true"
        border
        :show-row-hover="true"
        :expand-type="false"
        :columns="columns"
        :selection-type="false"
      >
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" style="color: lightgreen" class="el-icon-success"></i>
          <i v-else style="color: red" class="el-icon-error"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" size="mini" type="success">二级</el-tag>
          <el-tag type="warning" v-else size="mini">三级</el-tag>
        </template>

        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- El-table -->
      <!-- <el-table :data="cateList" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>

        <el-table-column prop="cat_name" label="分类名称" width="width"></el-table-column>

        <el-table-column prop="prop" label="是否有效" width="width"></el-table-column>

        <el-table-column prop="prop" label="排序" width="width"></el-table-column>

        <el-table-column prop="prop" label="操作" width="330">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </el-table-column>
      </el-table> -->

      <!-- 分页器 -->
      <!--         @size-change="handleSizeChange"-->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%"  @close="addCateDialogClosed">
      <el-form
        :model="addCateDialogForm"
        :rules="addCateDialogRules"
        ref="addDialogRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateDialogForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类">
          <el-cascader
            clearable
            change-on-select
            expand-trigger="hover"
            :props="cascaderProps"
            :options="parentCateList"
            v-model="selectedKeys"
            @change="parentCateChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CateC',
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      addCateDialogForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateDialogRules: {
        cat_name: [
          { required: true, message: '请输入分类名称！', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    handleCurrentChange(pages) {
      this.queryInfo.pagenum = pages
      this.getCateList()
    },
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败，亲！')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    addCate() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取父级分类失败，亲！')
      this.parentCateList = res.data
    },
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        this.addCateDialogForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateDialogForm.cat_level = this.selectedKeys.length
      }
    },
    addCate2() {
      this.$refs.addDialogRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('categories', this.addCateDialogForm)
          console.log(res)
          if (res.meta.status !== 201) return this.$message.error('添加分类失败，亲！')
          this.$message.success('添加分类成功')
          this.getCateList()
          this.addCateDialogVisible = false
        }
      })
    },
    addCateDialogClosed() {
      this.$refs.addDialogRef.resetFields()
      this.selectedKeys = []
      this.addCateDialogForm.cat_level = 0
      this.addCateDialogForm.cat_pid = 0
    }
  }
}
</script>

<style>
.TreeTable {
  margin-top: 15px;
}
/* 这个是视频没有提及的 */
.el-cascader-menu {
  height: 350px;
}
</style>
