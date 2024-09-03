<template>
  <a-card class='project-card' v-for="i in 6" :header-style="{border: 'none'}" >
    <template #title>
      项目A {{i}}
    </template>

    <a-row :gutter="16" >
      <a-col :span="24" style="margin-bottom: 20px;">
          <ProjectTotal/>
      </a-col>

      <a-col :span="24" style="margin-bottom: 20px">
        <ProjectNodes/>
      </a-col>

      <a-col :span="24" style="margin-bottom: 20px">
        <ProjectRecord/>
      </a-col>

      <a-col :span="24" style="margin-bottom: 20px">
        <ProjectAttached/>
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts" setup>
import {MyProjectRecord, queryMyProjectList} from '@/api/user-center';
import useRequest from '@/hooks/request';
import router from "@/router";
import {ref, unref} from "vue";
import {string} from "vue-types";
import ProjectNodes from './project-nodes.vue';
import ProjectRecord from './project-record.vue';
import ProjectAttached from './project-attached.vue';
import ProjectTotal from "@/views/user/weekday/components/project-total.vue";

const projectList = Array(6).fill({} as MyProjectRecord);
// const {loading, response: projectList} = useRequest<MyProjectRecord[]>(
//     queryMyProjectList,
//     defaultValue
// );

const activeProject = ref<number>(0)
const checkProject = (index:number) => {
  activeProject.value = index

  let target = document.getElementById('project_'+index)
  console.log(target)
  target?.scrollIntoView(
      {
        behavior: 'smooth',
        block: 'center',
      }
  )
}

</script>

<style scoped lang="less">
:deep(.arco-card-body) {
  min-height: 128px;
  padding: 20px;

}

.project-card {
  margin: 20px;
  padding: 5px;
  border-radius: 10px;
}

</style>
