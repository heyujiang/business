<template>
  <a-card class="general-card" :title="$t('userInfo.title.myProject')">
    <template #extra>
      <a-link @click="viewProject">{{ $t('userInfo.showMore') }}</a-link>
    </template>
    <a-row :gutter="16">
      <a-col
        v-for="(project, index) in projectList"
        :key="index"
        :xs="12"
        :sm="12"
        :md="12"
        :lg="12"
        :xl="6"
        :xxl="6"
        class="my-project-item"
      >
        <a-card class="project-card" @click="viewDetail(project.id)">
          <a-skeleton v-if="loading" :loading="loading" :animation="true">
            <a-skeleton-line :rows="4" />
          </a-skeleton>
          <a-space v-else direction="vertical" fill>
            <a-typography-title class="project-card-title" :heading="5" :ellipsis="{rows:1}">{{ project.name }}</a-typography-title>
            <div class="project-card-state">
              <a-tag>
                <template #icon>
                  <icon-tag v-if="project.state == 1" size="14" style="color: #0055d1; "/>
                  <icon-clock-circle v-else-if="project.state == 2" size="14" style="color: #f6c200;  " />
                  <icon-check-circle v-else-if="project.state == 3" size="14" style="color: #00bb00; "/>
                </template>
                <span v-if="project.state == '1'" style="color: #0055d1; ">
                    {{'未开始'}}
               </span>
                <span v-else-if ="project.state == '2'" style="color: #f6c200; " >
                    {{'进行中'}}
               </span>
                <span v-else-if ="project.state == '3'" style="color: #00bb00;">
                    {{'已完成'}}
               </span>
              </a-tag>
            </div>
            <div class="project-card-desc">
              <a-typography-text :ellipsis="{rows:3}">
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
  import { queryMyProjectList, MyProjectRecord } from '@/api/user-center';
  import useRequest from '@/hooks/request';
  import router from "@/router";

  const defaultValue = Array(6).fill({} as MyProjectRecord);
  const { loading, response: projectList } = useRequest<MyProjectRecord[]>(
    queryMyProjectList,
    defaultValue
  );

  const viewProject = ()=>{
    router.push({
      path:"/project/project"
    });
  }

  const viewDetail = (projectId:number)=>{
    router.push({
      path: "/project/detail",
      query: {
        id:projectId,
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

  .project-card{
    padding: 10px;

    &-desc{
      line-height: 20px;
      min-height: 70px;
    }

    &-createdat {
      float: right;
    }
  }

  .project-card:hover{
    -webkit-transform: translateY(-8px);
    transform: translateY(-8px);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
</style>
