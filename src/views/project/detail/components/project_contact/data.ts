import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export const columns = computed<TableColumnData[]>(() => [
    {
      title: '联系人',
      dataIndex: 'name',
      slotName: 'name',
      align:"center",
      width:120,
    },
    {
      title: '联系人电话',
      dataIndex: 'phoneNumber',
      slotName: 'nodeName',
      align:"center",
      width:150,
    },
    {
      title: '类型',
      dataIndex: 'type',
      slotName: 'type',
      align:"center",
      width:120,
    },
    {
      title: '备注',
      dataIndex: 'description',
      slotName: 'description',
      align:"left",
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      fixed: 'right',
      align:"center",
    },
  ]);
