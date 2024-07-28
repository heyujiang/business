import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
export const columns = computed<TableColumnData[]>(() => [
     {
       title:  '上传时间',
       dataIndex: 'createtime',
       slotName: 'createtime',
       align:'left',
     },
     {
       title:  'ID',
       dataIndex: 'id',
       width: 76,
       align:'left',
     },
     {
       title:  '名称',
       dataIndex: 'name',
       align:'left',
     },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      align:"center"
    },
  ]);
