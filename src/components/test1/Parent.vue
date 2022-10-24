<template>
  <div>
    <p>这是父组件的数据{{ msg }}</p>
    <br />
    <JojoA></JojoA>
    <JojoB @Nautilus1="getMsg"></JojoB>
  </div>
</template>

<script>
import JojoA from './JojoA'
import JojoB from './JojoB'

export default {
  name: 'Parent',
  data() {
    return {
      msg: 0
    }
  },
  methods: {
    getMsg(val) {
      this.msg = val
    }
  },
  components: {
    JojoA,
    JojoB
  }
}
</script>

<style></style>
