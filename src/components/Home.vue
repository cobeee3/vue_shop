<template>
  <div>
<el-button type="primary" @click="logout">退出</el-button>
</div>
</template>

<script>
export default {
  name: 'HomeC',
  methods: {
    logout() {
      sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}

</script>

<style>

</style>
