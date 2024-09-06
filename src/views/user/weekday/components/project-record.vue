<template>
  <a-collapse :default-active-key="['1']">
    <a-collapse-item  key="1">
      <template #header>
        <span style="font-weight: bolder">提交记录</span>
      </template>
      <a-table
          row-key="id"
          :bordered="{wrapper:false,headerCell:true}"
          stripe
          :pagination="false"
          :columns="ProjectRecordTableColumns"
          :data="record">
        <template #state="{ record }">
          <span v-if="record.state == 1"  style="color: #00bb00;">
            已完成
          </span>
          <span v-else-if="record.state == 2"  style="color: #f6c200; ">
            进行中
          </span>
        </template>

        <template #overview="{record}">
          <a-tooltip :content="record.overview">
            <a-typography-paragraph spacing="close" :ellipsis="{css:true}">
              {{ record.overview }}
            </a-typography-paragraph>
          </a-tooltip>
        </template>
      </a-table>
    </a-collapse-item>
  </a-collapse>
</template>
<script setup lang="ts">
import {ProjectRecordTableColumns} from "@/views/user/weekday/data";
import {defineProps, withDefaults} from "vue";
import {reportRecord} from "@/api/report";

withDefaults(
    defineProps<{
      record: reportRecord[];
    }>(),
    {}
);

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