<template>
  <div class="infos-container" ref="projectContainer">
    <div v-if="projectList.length > 0" id="pro-card-container">
      <div class="infos-container-item" v-for="(project,i) in projectList" :key="i" :id="'p-infos-'+i">
        <a-card class='project-card' :header-style="{border: 'none'}" >
          <template #title>
            <a-typography-title
                class="project-card-title"
                style="font-size: 15px; cursor: pointer;color: #4daaff;font-weight: bold"
                :heading="5"
                :ellipsis="{rows:1}" >
              <span @click="viewDetail(project.basic.id)">{{ project.basic.name }}</span>
            </a-typography-title>
          </template>

          <a-row :gutter="16" >
            <a-col :span="24" style="margin-bottom: 20px">
              <ProjectNodes :nodes="project.nodes" @gen="genParentsGen"/>
            </a-col>

            <a-col :span="24" style="margin-bottom: 20px">
              <ProjectRecord :record="project.records" @gen="genParentsGen"/>
            </a-col>

            <a-col :span="24" style="margin-bottom: 20px">
              <ProjectAttached :attached="project.attached" @gen="genParentsGen"/>
            </a-col>
          </a-row>
        </a-card>
      </div>
    </div>
    <a-result v-else status="404">
      <template #subtitle>
        暂无项目进展
      </template>
    </a-result>
  </div>
</template>

<script lang="ts" setup>
import router from "@/router";
import {defineEmits, defineProps, nextTick, onMounted, ref, withDefaults} from "vue";
import ProjectNodes from './project-nodes.vue';
import ProjectRecord from './project-record.vue';
import ProjectAttached from './project-attached.vue';
import {ReportResponseData} from "@/api/report";

withDefaults(
    defineProps<{
      projectList: ReportResponseData[];
    }>(),
    {}
);

const emits = defineEmits<{
  (e: 'gen'): void;
}>();


const projectContainer = ref()

// onMounted(async ()=>{
//   await nextTick(()=>{
//     projectContainer.value.onclick = async ()=>{
//       await nextTick(()=>{
//         emits("gen")
//       })
//     }
//   })
// })

const genParentsGen = () => {
  emits("gen")
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
  box-sizing: border-box;
}
.infos-container{
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
}
.infos-container-item{
  padding-top: 20px;
  box-sizing: border-box;
}
.project-card {
  padding: 5px;
  border-radius: 10px;
  box-sizing: border-box;
}

</style>
