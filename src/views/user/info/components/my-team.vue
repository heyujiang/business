<template>
  <a-card
    class="general-card"
    :title="$t('userInfo.tab.title.team')"
    :header-style="{ paddingBottom: '18px' }"
    :body-style="{ paddingBottom: '12px' }"
  >
    <a-list :bordered="false">
      <a-list-item
        v-for="team in teamList"
        :key="team.id"
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
        <a-list-item-meta v-else :title="team.name">
          <template #avatar>
            <a-avatar>
            <span>用户名</span>
            </a-avatar>
          </template>
          <template >
           <icon-record></icon-record>
          <span>职位</span>
          </template>
          <template >
            <icon-phone></icon-phone>
            <span>联系方式</span>
          </template>
          <template #description> 共5人 </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
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
