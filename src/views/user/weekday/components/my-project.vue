<template>
    <a-card
        v-if="projectList.length > 0"
        :class="['project-card', (unref(activeProject) == index) ? 'project-card-active' : '']"
        @click="checkProject(index)"
        v-for="(project, index) in projectList"
        :key="index"
        :id="['project_'+index]"
        :hoverable="false"
    >
      <template #title>
        <a-typography-title class="project-card-title" style="font-size: 15px;color: #4daaff;font-weight: bold"
                            :heading="5" :ellipsis="{rows:1}">{{ project.basic.name }}
                          
        </a-typography-title>
      </template>
      <a-space direction="vertical" fill>
        <div class="project-card-state">
          <!-- <a-tag>
            <template #icon>
              <icon-tag v-if="project.basic.state == 1" size="14" style="color: #0055d1; "/>
              <icon-clock-circle v-else-if="project.basic.state == 2" size="14" style="color: #f6c200;  "/>
              <icon-check-circle v-else-if="project.basic.state == 3" size="14" style="color: #00bb00; "/>
            </template>
            <span v-if="project.basic.state == 1" style="color: #0055d1; ">
                {{ '未开始' }}
           </span>
            <span v-else-if="project.basic.state == 2" style="color: #f6c200; ">
                {{ '进行中' }}
           </span>
            <span v-else-if="project.basic.state == 3" style="color: #00bb00;">
                {{ '已完成' }}
           </span>
          </a-tag> -->
          <span style="padding-left: 10px; font-size: 12px">
            <a-space align="center" size="mini">
              <span v-if="project.basic.type == 1"
                    style="background-color: #30a4e4;  padding: 2px 10px; border-radius: 20px;color: #FFFFFF ">
                {{ '风电' }}
            </span>
                  <span v-else-if="project.basic.type == 2"
                        style="background-color: #1fbb6a;  padding: 2px 10px; border-radius: 20px;color: #FFFFFF ">
                {{ '光伏' }}
            </span>
                  <span v-else-if="project.basic.type == 3"
                        style="background-color: #00bbbb;  padding: 2px 10px;  border-radius: 20px;color: #FFFFFF ">
                {{ '储能' }}
            </span>
            </a-space>
         </span>
         <a-divider direction="vertical" />
         <span style="color: #8590A6;font-size: 12px;">
          <a-space align="center" size="mini">
        <span v-if="project.basic.type == 1||project.basic.type == 2">
        容量：{{project.basic.capacity +' MW'}}
        </span>
        <span v-else-if="project.basic.type == 3">
          容量： {{project.basic.capacity +' Mwh'}}
        </span>
        </a-space>
        </span>
        <a-divider direction="vertical" />
          <span style="padding-left: 20px;">
            <icon-star-fill
                v-for="i in project.basic.star"
                :key="i"
                style="color: #f6c200"
                size="18"/>
          </span>
        </div>

        <!-- <div class="project-card-desc">
          <a-typography-text :ellipsis="{rows:2}">
            {{ project.basic.description }}
          </a-typography-text>
        </div> -->
        <a-divider dashed/>
        <div>
          <ProjectTotal :total="{record:project.recordTotal,attached:project.attachedTotal}"/>
        </div>
        <div class="project-card-createdat">
          <a-typography-text type="secondary">
            {{ project.basic.createdAt }}
          </a-typography-text>
        </div>
      </a-space>
    </a-card>
    <a-result v-else status="404">
      <template #subtitle>
        暂无项目
      </template>
    </a-result>
</template>

<script lang="ts" setup>
import {defineProps, ref, unref, withDefaults} from "vue";
import {ReportResponseData} from "@/api/report";
import ProjectTotal from "@/views/user/weekday/components/project-total.vue";
import router from "@/router";

withDefaults(
    defineProps<{
      projectList: ReportResponseData[];
    }>(),
    {}
);

const activeProject = ref<number>(0)
const checkProject = (index:number) => {
  activeProject.value = index

  let targetInfos = document.getElementById('infos_'+index)
  console.log(targetInfos)
  targetInfos?.scrollIntoView(
      {
        behavior: 'smooth',
        block: 'start',
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
  padding-bottom: 0;
}

.my-project {
  &-item {
    margin-bottom: 16px;
  }
}
.project-card-title{
  cursor:pointer
}

.project-card {
  margin: 20px;
  padding: 5px;
  border-radius: 10px;

  &-desc {
    line-height: 20px;
    min-height: 50px;
  }

  &-createdat {
    float: right;
  }
}

.project-card:hover {
  -webkit-transform: translateY(-8px);
  transform: translateY(-8px);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.project-card-active {
  border: 1px #1fbb6a solid; /* 设置边框宽度和样式 */
}
</style>
