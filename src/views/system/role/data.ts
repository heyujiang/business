import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export const columns = computed<TableColumnData[]>(() => [
    {
      title: '角色名称',
      dataIndex: 'title',
      slotName: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      align:"center"
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      slotName: 'createdAt',
      align:"center"
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      align:"center"
    },
  ]);
  export interface TreeItem  {
    id?: number;
    pid?: number;
    title?: string;
  }