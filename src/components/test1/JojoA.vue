<template>
  <div>
    这是A组件
    <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bus from './eventBus'
export default {
  name: 'AC',
  data() {
    return {
      dialogVisible: false,
      val: 8864
    }
  },
  mounted() {
    bus.$on('jojo', (val) => {
      this.dialogVisible = val
    })
  }
}
</script>

<style></style>
