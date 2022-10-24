<template>
  <div>
    这是B组件
    <el-button type="primary" @click="AControlB">控制B组件打开A弹窗</el-button>
    <el-button type="primary" @click="BtoParent">控制B组件向父组件传数据</el-button>
  </div>
</template>

<script>
import bus from './eventBus'
export default {
  name: 'BC',
  data() {
    return {
      val: 8864
    }
  },
  methods: {
    AControlB() {
      bus.$emit('jojo', true)
    },
    BtoParent() {
      this.$emit('Nautilus1', this.val)
    }
  }
}
</script>

<style></style>
