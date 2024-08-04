import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export const columns = computed<TableColumnData[]>(() => [
    {
      title: '姓名',
      dataIndex: 'name',
      slotName: 'name',
      align:"center",
      width:120,
    },
    {
      title: '类型',
      dataIndex: 'type',
      slotName: 'type',
      align:"center",
      width:120,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      fixed: 'right',
      align:"center",
    },
  ]);
