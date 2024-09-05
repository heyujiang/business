<template>
  <a-collapse :default-active-key="['1']">
    <a-collapse-item key="1">
      <template #header>
        <span style="font-weight: bolder">附件</span>
      </template>
      <a-table
        row-key="id"
        :bordered="{wrapper:false,headerCell:true}"
        stripe
        :pagination="false"
        :columns="ProjectAttachedTableColumns"
        :data="projectAttached">
      </a-table>
    </a-collapse-item>
  </a-collapse>
</template>
<script setup lang="ts">
import {ProjectAttachedTableColumns} from "@/views/user/weekday/data";

const projectAttached = [{
    name:"附件A",
    size:233,
    uploadAt:'',
  },{
    name:"附件B",
    size:233,
    uploadAt:'',
  },{
    name:"附件C",
    size:233,
    uploadAt:'',
  }];
</script>

<style scoped lang="less">
  :deep(.arco-collapse-item-content) {
    background-color: var(--color-bg-2);
  }
  :deep(.arco-table-th) {
    font-weight: bold;
  }
  :deep(.arco-table-td) {
    border: none;
  }
</style>