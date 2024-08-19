<template>
  <a-card
    class="general-card"
    :title="$t('userInfo.tab.title.team')"
    :header-style="{ paddingBottom: '18px' }"
    :body-style="{ paddingBottom: '12px' }"
  >
    <template #extra>
      <span v-show="teamList.length > 0" style="color: var(--color-neutral-6)"> 共{{ teamList.length }}人 </span>
    </template>
    <a-list :bordered="false">
      <a-list-item
        v-for="(team,id) in teamList"
        :key="id"
        action-layout="horizontal"
      >
        <a-skeleton v-if="loading" :loading="loading" :animation="true">
          <a-row :gutter="6">
            <a-col :span="6">
              <a-skeleton-shape shape="circle" />
            </a-col>
            <a-col :span="16">
              <a-skeleton-line :widths="['100%', '40%']" :rows="2" />
            </a-col>
          </a-row>
        </a-skeleton>
        <a-list-item-meta v-else>
          <template #avatar>
            <a-avatar>
              <img :src="team.avatar" alt="">
            </a-avatar>
          </template>
          <template #title>
            <a-space>
              <icon-user></icon-user>
              <span>{{ team.username }}</span>
            </a-space>
          </template>
          <template #description>
            <a-space>
              <icon-phone></icon-phone>
              <span>{{ team.phoneNumber }}</span>
            </a-space>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script lang="ts" setup>
  import { queryMyTeamList, TeamRecord } from '@/api/user-center';
  import useRequest from '@/hooks/request';

  const defaultValue: TeamRecord[] = new Array(4).fill({});
  const { loading, response: teamList } = useRequest<TeamRecord[]>(
    queryMyTeamList,
    defaultValue
  );
</script>

<style scoped lang="less">
  .general-card {
    height: 356px;
    .arco-list-item {
      height: 72px;
      padding-left: 0;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--color-neutral-3);
      &:last-child {
        border-bottom: none;
      }
      .arco-list-item-meta {
        padding: 0;
      }
    }
  }
</style>
