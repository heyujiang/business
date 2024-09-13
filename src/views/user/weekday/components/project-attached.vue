<template>
  <a-collapse :default-active-key="['1']" @change="change">
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
        :data="attached">
      </a-table>
    </a-collapse-item>
  </a-collapse>
</template>
<script setup lang="ts">
import {ProjectAttachedTableColumns} from "@/views/user/weekday/data";
import {defineEmits, defineProps, withDefaults} from "vue";
import {reportAttached} from "@/api/report";

withDefaults(
    defineProps<{
      attached: reportAttached[];
    }>(),
    {}
);

const emits = defineEmits<{
  (e: 'gen'): void;
}>();

const change = ()=>{
  setTimeout(()=>{
    emits('gen')
  },500)
}


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