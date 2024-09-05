import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
export const ProjectNodeTableColumns = computed<TableColumnData[]>(() => [
    {
        title: '节点',
        dataIndex: 'name',
        slotName: 'name',
        align:"left",
        fixed:"left",
        width:200,
    },
    {
        title: '状态',
        dataIndex: 'state',
        slotName: 'state',
        align:"center",
    },
    {
        title: '最后修改时间',
        dataIndex: 'updatedAt',
        slotName: 'updatedAt',
        align:"center"
    },
    {
        title: '完成时间',
        dataIndex: 'completedAt',
        slotName: 'completedAt',
        align:"center"
    }
]);

export const ProjectRecordTableColumns = computed<TableColumnData[]>(() => [
    {
        title: '节点',
        dataIndex: 'nodeName',
        slotName: 'nodeName',
        align:"center",
        width:80,
        minWidth:50,
    },
    {
        title: '概览',
        dataIndex: 'overview',
        slotName: 'overview',
        align:"left",
        width:100,
    },
    {
        title: '状态',
        dataIndex: 'state',
        slotName: 'state',
        align:"center",
        width:50,
    },
    {
        title: '提交时间',
        dataIndex: 'createdAt',
        slotName: 'createdAt',
        align:"center",
        width:80,
    },
    {
        title: '修改时间',
        dataIndex: 'updatedAt',
        slotName: 'updatedAt',
        align:"center",
        width:80,
    },
]);

export const ProjectAttachedTableColumns = computed<TableColumnData[]>(() => [
    {
        title: '文件',
        dataIndex: 'name',
        slotName: 'name',
        align:"center",
    },
    {
        title: '大小',
        dataIndex: 'size',
        slotName: 'size',
        align:"center",
    },
    {
        title: '上传时间',
        dataIndex: 'uploadAt',
        slotName: 'uploadAt',
        align:"center"
    }
]);

