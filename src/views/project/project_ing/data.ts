import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export const columns = computed<TableColumnData[]>(() => [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      slotName: 'change',
      align:"center",
      width:150,
    },
    {
      title: '节点',
      dataIndex: 'nodeName',
      slotName: 'nodeName',
      align:"center",
      width:100,
    },
    {
      title: '概览',
      dataIndex: 'overview',
      slotName: 'overview',
      align:"center",
      width:100,
    },

    {
      title: '提交人',
      dataIndex: 'username',
      slotName: 'username',
      align:"center",
      width:100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      slotName: 'createdAt',
      align:"center",
      width:100,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      align:"center",
      width:20,
      fixed:"right"
    },
  ]);
