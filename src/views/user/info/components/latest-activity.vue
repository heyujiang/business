<template>
  <a-card class="general-card" :title="$t('userInfo.title.latestActivity')">
    <template #extra>
      <a-link @click="viewProject">{{ $t('userInfo.viewAll') }}</a-link>
    </template>
    <a-list :hoverable="true">
      <a-list-item
        v-for="(activity , index) in activityList"
        :key="activity.id"
        action-layout="horizontal"
      >
        <a-skeleton
          v-if="loading"
          :loading="loading"
          :animation="true"
          class="skeleton-item"
        >
          <a-row :gutter="6">
            <a-col :span="2">
              <a-skeleton-shape shape="circle" />
            </a-col>
            <a-col :span="22">
              <a-skeleton-line :widths="['40%', '100%']" :rows="2" />
            </a-col>
          </a-row>
        </a-skeleton>
        <a-list-item-meta v-else @click="viewDetail(activity.projectId)">
          <template #avatar>
            <a-avatar>
              {{ index + 1 }}
            </a-avatar>
          </template>

          <template #title>
            <span style="font-size: 15px;color: #4daaff; cursor:pointer">
              {{ activity.projectName }}
            </span>
            <span>
              -----({{ activity.nodeName }})
            </span>
            <span style="font-size: 14px;color: #8590A6">
            <a-typography-text type="secondary" :ellipsis="{rows:3}">
              {{ activity.overview }}
            </a-typography-text>
          </span>
            <a-typography-text>
              {{ activity.createdAt }}
            </a-typography-text>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { queryLatestActivity, LatestActivity } from '@/api/user-center';
  import useLoading from '@/hooks/loading';
  import router from "@/router";

  const { loading, setLoading } = useLoading(true);
  const activityList = ref<LatestActivity[]>(new Array(7).fill({}));
  const fetchData = async () => {
    try {
      const data = await queryLatestActivity();
      activityList.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();

  const viewProject = ()=>{
    router.push({
      path:"/project/project_ing"
    });
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
  .latest-activity {
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .general-card :deep(.arco-list-item) {
    padding-left: 0;
    //border-bottom: none;
    .arco-list-item-meta-content {
      flex: 1;
      //padding-bottom: 27px;
      //border-bottom: 1px solid var(--color-neutral-3);
    }
    .arco-list-item-meta-avatar {
      //padding-top: 27px;
    }
    .skeleton-item {
      margin-top: 10px;
      padding-bottom: 20px;
      //border-bottom: 1px solid var(--color-neutral-3);
    }
  }

</style>
