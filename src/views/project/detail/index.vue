<template>
  <div class="container">
    <Breadcrumb :items="['menu.project', 'menu.project.detail']" />
    <ProjectProcess :state="projectDetail.state"/>
    <ProjectBase :detail="projectDetail"/>
    <a-grid :cols="24" :colGap="20" :rowGap="20">
      <a-grid-item :span="8">
        <ProjectPerson :projectId="projectId"/>
      </a-grid-item>
      <a-grid-item :span="16">
        <ProjectContact :projectId="projectId"/>
      </a-grid-item>
    </a-grid>
    <ProjectNode :projectId="projectId"/>
  </div>
</template>

<script lang="ts" setup>
  import {ref , computed} from "vue";
  import {getProjectInfo} from '@/api/project/project';
  import ProjectProcess from './components/project-progress.vue';
  import ProjectBase from './components/project-base.vue';
  import ProjectNode from './components/project_node/index.vue';
  import ProjectPerson from './components/project_person/index.vue';
  import ProjectContact from './components/project_contact/index.vue';
  import { useRoute } from 'vue-router'
  import useLoading from "@/hooks/loading";
  import { Message } from '@arco-design/web-vue';

  const { loading, setLoading } = useLoading(true);



  interface baseDetail {
    id?:number,
    name?:number,
    state?:number,
    attr?:number,
  }

  const projectDetail = ref<baseDetail>({})

  const route = useRoute()
  const projectId = parseInt(<string>route.query.id)

  console.log(projectId)

  const fetchData = async () => {
    Message.loading({content:"加载中...",id:"upDetail",duration:2000})
    try {
      projectDetail.value = await getProjectInfo(projectId);
      console.log(projectDetail.value)
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      Message.clear("top");
    }
  };
  fetchData();


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
