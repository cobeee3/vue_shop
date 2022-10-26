<template>
  <div>
    <BcrumbT>
      <template v-slot:title1>数据统计</template>
      <template v-slot:title2>数据报表</template>
    </BcrumbT>
    <el-card>
      <div id="main" style="width: 750px; height: 400px" ref="eCharts_report"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  name: 'ReportC',
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    const myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取数据报表失败！')
    }

    this.$message.success('获取数据报表成功！')
    const result = _.merge(res.data, this.options)
    myChart.setOption(result)
  }
}
</script>

<style></style>
