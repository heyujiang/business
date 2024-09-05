<template>
    <a-collapse class="general-collapse" :default-active-key="['1']">
      <a-collapse-item key="1">
        <template #header>
          <span style="font-weight: bolder">项目节点</span>
        </template>
        <a-table
            row-key="id"
            :bordered="{wrapper:false,headerCell:true}"
            stripe
            :pagination="false"
            :columns="ProjectNodeTableColumns"
            :data="projectNodes">
        </a-table>
      </a-collapse-item>
    </a-collapse>
</template>
<script setup lang="ts">
import {ProjectNodeTableColumns} from "@/views/user/weekday/data";
const projectNodes = [{
  id:1,
  name:"节点A",
  state:1,
  uploadAt:'',
  completedAt:'',
  children:[{
    id:11,
    name:"节点A",
    state:1,
    uploadAt:'',
    completedAt:'',

  },{
    id:12,
    name:"节点B",
    size:233,
    uploadAt:'',
    completedAt:'',
  },{
    id:13,
    name:"节点C",
    size:233,
    uploadAt:'',
    completedAt:'',
  }]
},{
  id:2,
  name:"节点B",
  size:233,
  uploadAt:'',
  completedAt:'',
  children:[{
    id:21,
    name:"节点A",
    state:1,
    uploadAt:'',
    completedAt:'',

  },{
    id:22,
    name:"节点B",
    size:233,
    uploadAt:'',
    completedAt:'',
  },{
    id:23,
    name:"节点C",
    size:233,
    uploadAt:'',
    completedAt:'',
  }]
},{
  name:"节点C",
  size:233,
  uploadAt:'',
  completedAt:'',
}];

</script>

<style scoped lang="less">
  :deep(.arco-collapse-item-content) {
    background-color: var(--color-bg-2);
  }
  :deep(.arco-table-th) {
    font-weight: bold;
  }
  :deep(.arco-table-td) {
    border: none;
  }
</style>