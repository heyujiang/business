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
      title: '星级',
      dataIndex: 'star',
      slotName: 'star',
      align:"center",
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
      title: '进度',
      dataIndex: 'schedule',
      slotName: 'schedule',
      align:"center",
    },
    {
      title: '当前节点',
      dataIndex: 'nodeName',
      slotName: 'nodeName',
      align:"center",
      width:150,
    },
    {
      title: '容量大小',
      dataIndex: 'capacity',
      slotName: 'capacity',
      align:"center"
    },
    {
      title: '电网接入情况',
      dataIndex: 'connect',
      slotName: 'connect',
      align:"center"
    },
    {
      title: '投资协议',
      dataIndex: 'investmentAgreement',
      slotName: 'investmentAgreement',
      align:"center"
    },
    {
      title: '商务条件',
      dataIndex: 'businessCondition',
      slotName: 'businessCondition',
      align:"center"
    },
    {
      title: '土地性质',
      dataIndex: 'properties',
      slotName: 'properties',
      align:"center",
    },
    {
      title: '土地面积',
      dataIndex: 'area',
      slotName: 'area',
      align:"center"
    },
    {
      title: '状态',
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
      align:"center",
      width:180,
    },
  ]);
