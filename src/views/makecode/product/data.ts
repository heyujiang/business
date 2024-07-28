import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
export const columns = computed<TableColumnData[]>(() => [
     {
       title:  'ID',
       dataIndex: 'id',
       width: 76,
       align:'left',
     },
     {
       title:  '标题1',
       dataIndex: 'title',
       align:'center',
       width: 200,
     },
     {
       title:  '价格',
       dataIndex: 'price',
       align:'left',
     },
     {
       title:  '库存',
       dataIndex: 'num',
       align:'left',
     },
     {
       title:  '上传时间',
       dataIndex: 'createtime',
       slotName: 'createtime',
       align:'left',
     },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      fixed: 'right',
      width: 100,
      align:"center"
    },
  ]);
