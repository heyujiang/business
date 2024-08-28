<template>
  <a-card class="general-card" title="所有项目">
    <a-row :gutter="16">
      <a-col
          v-for="(project, index) in projectList"
          :key="index"
          :spn="24"
          class="my-project-item"
          :id="['project_'+index]"
      >
        <a-card :class="['project-card', (unref(activeProject) == index) ? 'project-card-active' : '']" @click="checkProject(index)">
          <a-space direction="vertical" fill>
            <a-typography-title class="project-card-title" style="font-size: 15px;color: #4daaff;font-weight: bold"
                                :heading="5" :ellipsis="{rows:1}">{{ project.name }}
            </a-typography-title>
            <div class="project-card-state">
              <a-tag>
                <template #icon>
                  <icon-tag v-if="project.state == 1" size="14" style="color: #0055d1; "/>
                  <icon-clock-circle v-else-if="project.state == 2" size="14" style="color: #f6c200;  "/>
                  <icon-check-circle v-else-if="project.state == 3" size="14" style="color: #00bb00; "/>
                </template>
                <span v-if="project.state == 1" style="color: #0055d1; ">
                    {{ '未开始' }}
               </span>
                <span v-else-if="project.state == 2" style="color: #f6c200; ">
                    {{ '进行中' }}
               </span>
                <span v-else-if="project.state == 3" style="color: #00bb00;">
                    {{ '已完成' }}
               </span>
              </a-tag>
              <span style="padding-left: 20px;"> <icon-star-fill v-for="i in project.star" :key="i"
                                                                 style="color: #f6c200" size="18"/></span>
              <span style="padding-left: 20px; font-size: 12px">
          <span v-if="project.type == 1"
                style="background-color: #30a4e4;  padding: 2px 10px; border-radius: 20px;color: #FFFFFF ">
              {{ '风电' }}
          </span>
                <span v-else-if="project.type == 2"
                      style="background-color: #1fbb6a;  padding: 2px 10px; border-radius: 20px;color: #FFFFFF ">
              {{ '光伏' }}
          </span>
                <span v-else-if="project.type == 3"
                      style="background-color: #00bbbb;  padding: 2px 10px;  border-radius: 20px;color: #FFFFFF ">
              {{ '储能' }}
          </span>
             </span>
            </div>

            <span style="color: #8590A6;font-size: 12px;margin-top:20px;">

          <span v-if="project.type == 1||project.type == 2">
           容量：{{project.capacity +' MW'}}
          </span>
          <span v-else-if="project.type == 3">
            容量： {{project.capacity +' Mwh'}}
          </span>
            </span>
            <div class="project-card-desc">
              <a-typography-text :ellipsis="{rows:2}">
                {{ project.description }}
              </a-typography-text>
            </div>
            <div class="project-card-createdat">
              <a-typography-text type="secondary">
                {{ project.createdAt }}
              </a-typography-text>
            </div>
          </a-space>
        </a-card>
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
  border: 1.5px solid; /* 设置边框宽度和样式 */
  border-color: #1fbb6a; /* 设置边框颜色为红色 */
}
.project-card-active {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border: 1.5px solid; /* 设置边框宽度和样式 */
  border-color: #1fbb6a; /* 设置边框颜色为红色 */
}
</style>
