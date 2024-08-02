<template>
  <div class="container">
    <Breadcrumb :items="['menu.user', 'menu.user.info']" />
    <ProjectProcess state="2"/>
    <ProjectBase/>
    <ProjectNode/>
    <a-grid :cols="24" :colGap="20" :rowGap="20">
      <a-grid-item :span="12">
        <ProjectPerson/>
      </a-grid-item>
      <a-grid-item :span="12">
        <ProjectContact/>
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script lang="ts" setup>
  import {ref , computed} from "vue";
  import { getProjectInfo} from '@/api/project/project';
  import ProjectProcess from './components/project-progress.vue';
  import ProjectBase from './components/project-base.vue';
  import ProjectNode from './components/project-node.vue';
  import ProjectPerson from './components/project-person.vue';
  import ProjectContact from './components/project-contact.vue';
  import { useRoute } from 'vue-router'
  import type {TableColumnData} from "@arco-design/web-vue/es/table/interface";


  const route = useRoute()
  const projectId = route.query.id

  console.log(projectId)



</script>

<script lang="ts">
  export default {
    name: 'Info',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .content {
    display: flex;

    &-left {
      flex: 1;
      margin-right: 16px;
      overflow: hidden;

      :deep(.arco-tabs-nav-tab) {
        margin-left: 16px;
      }
    }

    &-right {
      width: 30%;
    }
  }
</style>
