import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export const columns = computed<TableColumnData[]>(() => [
    {
      title: '分组',
      dataIndex: 'groupname',
      width: 100,
    },
    {
      title: '接口名称',
      dataIndex: 'title',
      width: 210,
    },
    {
      title: '请求地址',
      dataIndex: 'url',
      width: 290,
    },
    {
      title: '请求方式',
      dataIndex: 'method',
      width: 100,
    },
    {
      title: 'token',
      dataIndex: 'istoken',
      slotName: 'istoken',
      width: 100,
      align:"center"
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      width: 100,
      align:"center"
      
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      slotName: 'createtime',
      width: 120,
      align:"center"
      
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
  //分组
  export const groupcolumns = computed<TableColumnData[]>(() => [
    {
      title: '分组名称',
      dataIndex: 'name',
    },
    {
      title: '接口类型',
      dataIndex: 'typename',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      align:"center"
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      align:"center"
    },
  ]);
  //类型
  export const typecolumns = computed<TableColumnData[]>(() => [
    {
      title: '类型名称',
      dataIndex: 'name',
    },
    {
      title: '请求服务器地址',
      dataIndex: 'rooturl',
    },
    {
      title: '加密验证字符串',
      dataIndex: 'verifyEncrypt',
      align:"center"
    },
    {
      title: '是否是本端',
      dataIndex: 'isself',
      slotName: 'isself',
      align:"center"
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      align:"center"
    },
  ]);