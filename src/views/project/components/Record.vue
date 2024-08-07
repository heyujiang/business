<template>
  <a-drawer
      :width="800"
      :visible="visible.valueOf()"
      placement="right"
      @ok="handleOk"
      @cancel="handleCancel"
      unmountOnClose
  >
    <template #title>
      节点记录列表
    </template>
    <a-table :columns="columns" :data="recordItems" :pagination="false">
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
  </a-drawer>
</template>
<script lang="ts" setup>
import {withDefaults, defineProps, ref, defineEmits, watch, computed} from 'vue';

import {  getProjectRecordByNode} from '@/api/project/project';
import type {TableColumnData} from "@arco-design/web-vue/es/table/interface";

interface attachedSearch {
  recordId?: number;
  nodeId?: number;
  projectId?:number,
}

const props = withDefaults(
    defineProps<{
      visible: Boolean;
      search: attachedSearch;
    }>(),
    {}
);

const emits = defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (e: 'update:recordId', val: number): void;
}>();

watch(() => ({...props.search}), () => fetchRecord())

const handleOk = () => {
  emits('update:visible',false)
};
const handleCancel = () => {
  emits('update:visible',false)
}


const recordItems = ref<any>([])

const fetchRecord = async () => {
  console.log(props.search)
  recordItems.value = await getProjectRecordByNode(props.search)
  console.log(recordItems.value)
}
fetchRecord()


const columns = computed<TableColumnData[]>(() => [
  {
    title: '项目名称',
    dataIndex: 'projectName',
    slotName: 'projectName',
    align:"center",
    width:100,
  },
  {
    title: '节点',
    dataIndex: 'nodeName',
    slotName: 'nodeName',
    align:"center",
    width:80,
    minWidth:50,
  },
  {
    title: '概览',
    dataIndex: 'overview',
    slotName: 'overview',
    align:"left",
    width:100,
  },
  {
    title: '状态',
    dataIndex: 'state',
    slotName: 'state',
    align:"center",
    width:50,
  },
  {
    title: '提交人',
    dataIndex: 'username',
    slotName: 'username',
    align:"center",
    width:50,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    slotName: 'createdAt',
    align:"center",
    width:80,
  }
]);
</script>
