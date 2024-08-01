<template>
  <a-card class="general-card" title="基础信息">
    <a-space direction="vertical">
      <a-descriptions :data="data" :align="{ label: 'right' }" table-layout="fixed" :column="3" bordered>
        <template #value="{value , index , data}">
          <a-rate v-if="data.label == '星级'" :count="3" :default-value="value" readonly/>
          <div v-else>{{value}}</div>
        </template>
        <template #title></template>
      </a-descriptions>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>

const data = [{
    label: '项目名',
    value: '萧山电厂储能项目',
  },{
    label: '星级',
    value: 1,
  }, {
    label: '属性',
    value: '集中式',
  }, {
    label: '类型',
    value: '储能'
  }, {
    label: '容量-MW',
    value: '9888.90',
  }, {
    label: '面积-亩',
    value: '389.92'
  }, {
  label: '项目地址',
  value: 'Yingdu Building, Zhichun Road, Beijing'
},{
    label: '土地性质',
    value: '商业'
  }, {
    label: '开始时间',
    value: '2024-8-20',
  }, {
    label: '电网接入情况',
    value: '已经接入'
  }, {
  label: '投资协议',
  value: '自有资金'
}, {
  label: '商务条件',
  value: '无'
}, {
  label: '简介',
  value: '简介简介简'
}, {
  label: '简介',
  value: '简介简介简'
}];


</script>
<style scoped lang="less">
.general-card {
  margin-bottom: 20px;
  padding: 0 20px;}
</style>
