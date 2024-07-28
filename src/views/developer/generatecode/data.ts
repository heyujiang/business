import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export const columns = computed<TableColumnData[]>(() => [
    {
      title: '表名称',
      dataIndex: 'tablename',
      width: 180,
    },
    {
      title: '表备注',
      dataIndex: 'comment',
      align:"center"
    },
    {
      title: '引擎',
      dataIndex: 'engine',
      align:"center"
    },
    {
      title: '编码',
      dataIndex: 'collation',
      align:"center"
    },
    {
      title: '记录数',
      dataIndex: 'table_rows',
      align:"center"
    },
    {
      title: '自增索引',
      dataIndex: 'auto_increment',
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
      title: '更新时间',
      dataIndex: 'updatetime',
      slotName: 'createtime',
      align:"center"
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createtime',
    //   slotName: 'createtime',
    //   align:"center"
    // },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      fixed: 'right',
      width: 180,
      align:"center"
    },
  ]);
  //生成代码-表单字段
  export const columnsfiles = computed<TableColumnData[]>(() => [
    {
      title: '选择',
      dataIndex: 'isform',
      slotName: 'isform',
      width: 60,
    },
    {
      title: '字段名称',
      dataIndex: 'name',
      slotName: 'name',
      width: 140,
    },
    {
      title: '字段',
      dataIndex: 'field',
      width: 120,
    },
    {
      title: '必填',
      dataIndex: 'required',
      slotName: 'required',
      width: 60,
    },
    {
      title: '表单类型',
      dataIndex: 'formtype',
      slotName: 'formtype',
      width: 140,
    },
    {
      title: '关联数据',
      dataIndex: 'datatable',
      slotName: 'datatable',
      width: 220,
    },
    {
      title: '关联显示字段',
      dataIndex: 'datatablename',
      slotName: 'datatablename',
      width: 160,
    },
  ]);
  //列表
  export const columnslist = computed<TableColumnData[]>(() => [
    {
      title: '选择',
      dataIndex: 'islist',
      slotName: 'islist',
      width: 60,
    },
    {
      title: '字段名称',
      dataIndex: 'name',
      slotName: 'name',
    },
    {
      title: '字段',
      dataIndex: 'field',
      width: 120,
    },
    {
      title: '排序',
      dataIndex: 'isorder',
      slotName: 'isorder',
      width: 60,
    },
    {
      title: '对齐方向',
      dataIndex: 'align',
      slotName: 'align',
      width: 136,
    },
    {
      title: '宽度',
      dataIndex: 'width',
      slotName: 'width',
    },
  ]);
  //搜索
  export const columnsseach = computed<TableColumnData[]>(() => [
    {
      title: '选择',
      dataIndex: 'issearch',
      slotName: 'issearch',
      width: 60,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 136,
    },
    {
      title: '查询方式',
      dataIndex: 'searchway',
      slotName: 'searchway',
      width: 130,
    },
    {
      title: '查询类型',
      dataIndex: 'searchtype',
      slotName: 'searchtype',
      width: 145,
    },
  ]);