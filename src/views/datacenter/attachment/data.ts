import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
export const columns = computed<TableColumnData[]>(() => [
     {
       title:  'ID',
       dataIndex: 'id',
       width: 76,
       align:'center'
     },
     {
       title:  '访问路径',
       dataIndex: 'url',
       align:'center'
     },
     {
       title:  '文件类型0=图片，1=文件夹,2=视频，3=音频',
       dataIndex: 'type',
       align:'center'
     },
     {
       title:  '文件名称',
       dataIndex: 'title',
       align:'center'
     },
     {
       title:  'mime类型',
       dataIndex: 'mimetype',
       align:'center'
     },
     {
       title:  '视频封面',
       dataIndex: 'cover_url',
       align:'center'
     },
     {
       title:  '上传时间',
       dataIndex: 'createtime',
       slotName: 'createtime',
       align:'center'
     },
     {
       title:  '附件',
       dataIndex: 'pid',
       align:'center'
     },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      align:"center"
    },
  ]);
