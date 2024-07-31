<template>
  <a-card
      class="general-card"
      title="项目节点进度"
      :header-style="{ paddingBottom: '18px' }"
      :body-style="{ paddingBottom: '12px' }"
  >

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
