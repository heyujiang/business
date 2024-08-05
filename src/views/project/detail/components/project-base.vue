<template>
  <a-card class="general-card" title="基础信息">
    <a-space direction="vertical">
      <a-descriptions :data="data" :align="{ label: 'right' }" table-layout="fixed" :column="3" bordered>
        <template #value="{value ,index, data}">
          <a-rate v-if="data.label == '项目等级'" :count="data.value" :default-value="data.value" readonly/>
          <div v-else>{{value}}</div>
        </template>
      </a-descriptions>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { attrMap , typeMap } from "@/views/project/data";

const props = defineProps({
  detail: {
    type: Object,
    default() {
      return 0;
    },
  },
});

const data = computed(() => {
  return  [{
    label: '项目名称',
    value: props.detail.name,
  },{
    label: '项目等级',
    value: props.detail.star,
  }, {
    label: '项目属性',
    value: attrMap.get(props.detail.attr),
  }, {
    label: '项目类型',
    value: typeMap.get(props.detail.type),
  }, {
    label: '容量-MW',
    value: props.detail.capacity,
  }, {
    label: '面积-亩',
    value: props.detail.area
  }, {
    label: '项目地址',
    value: props.detail.address
  },{
    label: '土地性质',
    value: props.detail.properties
  }, {
    label: '开始时间',
    value: props.detail.beginTime,
  }, {
    label: '电网接入情况',
    value: props.detail.connect,
  }, {
    label: '投资协议',
    value: props.detail.investmentAgreement,
  }, {
    label: '商务条件',
    value: props.detail.businessCondition,
  }, {
    label: '简介',
    value: props.detail.description,
  }];
});

console.log(data);

</script>
<style scoped lang="less">
.general-card {
  margin-bottom: 20px;
  padding: 0 20px;}
</style>
