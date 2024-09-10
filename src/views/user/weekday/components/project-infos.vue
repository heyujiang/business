<template>
  <div class="infos-container">
    <div v-if="projectList.length > 0">
      <a-card class='project-card' v-for="(project,i) in projectList" :key="i"  :id="['infos_'+i]" :header-style="{border: 'none'}" >
        <template #title>
          <a-typography-title class="project-card-title" style="font-size: 15px; cursor: pointer;color: #4daaff;font-weight: bold"
                              :heading="5" :ellipsis="{rows:1}"  @click="viewDetail(project.basic.id)">{{ project.basic.name }}
          </a-typography-title>
        </template>

        <a-row :gutter="16" >
          <a-col :span="24" style="margin-bottom: 20px">
            <ProjectNodes :nodes="project.nodes"/>
          </a-col>

          <a-col :span="24" style="margin-bottom: 20px">
            <ProjectRecord :record="project.records"/>
          </a-col>

          <a-col :span="24" style="margin-bottom: 20px">
            <ProjectAttached :attached="project.attached"/>
          </a-col>
        </a-row>
      </a-card>
    </div>
    <a-result v-else status="404">
      <template #subtitle>
        暂无项目进展
      </template>
    </a-result>
  </div>

</template>

<script lang="ts" setup>
import {MyProjectRecord, queryMyProjectList} from '@/api/user-center';
import useRequest from '@/hooks/request';
import router from "@/router";
import {defineProps, ref, unref, withDefaults} from "vue";
import {string} from "vue-types";
import ProjectNodes from './project-nodes.vue';
import ProjectRecord from './project-record.vue';
import ProjectAttached from './project-attached.vue';
import ProjectTotal from "@/views/user/weekday/components/project-total.vue";
import {ReportResponseData} from "@/api/report";

withDefaults(
    defineProps<{
      projectList: ReportResponseData[];
    }>(),
    {}
);

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
const viewDetail = (projectId: number) => {
  router.push({
    path: "/project/detail",
    query: {
      id: projectId,
    }
  });
}

</script>

<style scoped lang="less">
:deep(.arco-card-body) {
  min-height: 128px;
  padding: 20px;
}

.infos-container{
  padding: 20px;
}

.project-card {
  margin-bottom: 20px;
  padding: 5px;
  border-radius: 10px;
}

</style>
