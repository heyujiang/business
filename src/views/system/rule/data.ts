import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export const columns = computed<TableColumnData[]>(() => [
    {
      title: '菜单名称',
      dataIndex: 'title',
      slotName: 'title',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      slotName: 'icon',
      align:"center"
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      slotName: 'permission',
    },
    {
      title: '组件',
      dataIndex: 'component',
      slotName: 'component',
    },
    {
      title: '排序',
      dataIndex: 'orderNo',
      slotName: 'orderNo',
      align:"center"
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      align:"center"
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      slotName: 'createtime',
      align:"center"
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      align:"center"
    },
  ]);