<template>
  <a-card
      class="general-card"
      title="项目进度"
      :header-style="{ paddingBottom: '18px' }"
      :body-style="{ paddingBottom: '12px' }"
  >
    <a-steps class="project-step" :current="3"  label-placement="vertical">
      <a-step description="项目还未开始">待开始</a-step>
      <a-step description="项目正在进行中">进行中</a-step>
      <a-step description="项目已结束：完成">已完成</a-step>
    </a-steps>

    <a-steps class="project-step" :current="3" label-placement="vertical">
      <a-step description="项目还未开始">待开始</a-step>
      <a-step description="项目正在进行中">进行中</a-step>
      <a-step description="项目已结束：终止"  status="error">项目终止</a-step>
    </a-steps>
  </a-card>
</template>

<script lang="ts" setup>
import { queryMyTeamList, MyTeamRecord } from '@/api/user-center';
import useRequest from '@/hooks/request';

const defaultValue: MyTeamRecord[] = new Array(4).fill({});
const { loading, response: teamList } = useRequest<MyTeamRecord[]>(
    queryMyTeamList,
    defaultValue
);
</script>
<style scoped lang="less">
.general-card {
  margin-bottom: 20px;
  .project-step {
    height: 100px;
    padding: 20px 50px;
  }
}
</style>
