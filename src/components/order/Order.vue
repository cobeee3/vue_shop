<template>
  <div>
    <BcrumbT>
      <template v-slot:title1>订单管理</template>
      <template v-slot:title2>订单列表</template>
    </BcrumbT>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号" width="80"></el-table-column>

        <el-table-column prop="order_number" label="订单编号" width="width"></el-table-column>

        <el-table-column prop="order_price" label="订单价格" width="80"></el-table-column>

        <el-table-column prop="pay_status" label="是否付款" width="80">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.pay_status === 0">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="is_send" label="是否发货" width="width"></el-table-column>

        <el-table-column prop="create_time" label="下单时间" width="width">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox(scope.row)"></el-button>
            <!-- @click="showProgressBox" // 物流接口有问题，暂时停用 -->
            <el-button type="success" size="mini" icon="el-icon-location" ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        center
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改地址dialog -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1" change-on-select></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流dialog -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <span>这是一段信息</span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  name: 'OrderC',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      orderList: {},
      total: 0,
      addressVisible: false,
      progressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      cityData,
      progressInfo: []
    }
  },

  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单数据列表失败！')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
      this.$message.success('获取订单数据列表成功！')
      console.log(this.orderList)
    },
    handleSizeChange(sizes) {
      this.queryInfo.pagesize = sizes
      this.getOrderList()
    },
    handleCurrentChange(pages) {
      this.queryInfo.pagenum = pages
      this.getOrderList()
    },
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    // 物流接口有问题，暂时停用
    async showProgressBox() {
      this.progressVisible = true

      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }

      this.$message.success('获取物流进度成功！')
      this.progressInfo = res.data

      console.log(this.progressInfo)
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>

<style>
.el-cascader {
  width: 100%;
}
</style>
