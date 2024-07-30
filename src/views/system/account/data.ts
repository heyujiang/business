import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export const columns = computed<TableColumnData[]>(() => [
    {
      title: '用户名',
      dataIndex: 'username',
      slotName: 'username',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      slotName: 'avatar',
      align:"center"
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      slotName: 'phoneNumber',
      align:"center"
    },
    // {
    //   title: '姓名（昵称）',
    //   dataIndex: 'name',
    //   slotName: 'name',
    // },
    {
      title: '邮箱',
      dataIndex: 'email',
      slotName: 'email',
    },
    {
      title: '状态',
      dataIndex: 'state',
      slotName: 'state',
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
      align:"center"
    },
  ]);
