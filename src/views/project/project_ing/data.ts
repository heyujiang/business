import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export const columns = computed<TableColumnData[]>(() => [
    {
      title: '项目名称',
      dataIndex: 'name',
      slotName: 'name',
      align:"center",
      fixed: 'left',
    },
    {
      title: '负责人',
      dataIndex: 'username',
      slotName: 'username',
      align:"center"
    },
    {
      title: '节点名称',
      dataIndex: 'node_name',
      slotName: 'node_name',
      align:"center"
    },

    {
      title: '属性',
      dataIndex: 'attr',
      slotName: 'attr',
      align:"center"
    },
    {
      title: '类型',
      dataIndex: 'type',
      slotName: 'type',
      align:"center"
    },

    {
      title: '容量大小',
      dataIndex: 'capacity',
      slotName: 'capacity',
      align:"center"
    },

    {
      title: '完成状态',
      dataIndex: 'state',
      slotName: 'state',
      align:"center"
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      slotName: 'beginTime',
      align:"center"
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      slotName: 'createdAt',
      align:"center"
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      fixed: 'right',
      align:"center"
    },
  ]);
