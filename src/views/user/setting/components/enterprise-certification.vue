<template>
  <a-card
    class="general-card"
    :title="$t('userSetting.certification.title.enterprise')"
    :header-style="{ padding: '0px 20px 16px 20px' }"
  >
    <template #extra>
      <a-link>{{ $t('userSetting.certification.extra.enterprise') }}</a-link>
    </template>
    <!-- <a-descriptions
      class="card-content"
      :data="renderData"
      :column="3"
      align="right"
      layout="inline-horizontal"
      :label-style="{ fontWeight: 'normal' }"
      :value-style="{
        width: '200px',
        paddingLeft: '8px',
        textAlign: 'left',
      }"
    >
      <template #label="{ label }">{{ $t(label) }} :</template>
      <template #value="{ value, data }">
        <a-tag
          v-if="data.label === 'userSetting.certification.label.status'"
          color="green"
          size="small"
        >
          已认证9
        </a-tag>
        <span v-else>{{ value }}</span>
      </template>
    </a-descriptions> -->
  </a-card>
</template>

<script lang="ts" setup>
  import { PropType, computed } from 'vue';
  import { EnterpriseCertificationModel } from '@/api/user-center';
  import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

  const props = defineProps({
    userData: {
      type: Object,
      required: true,
    },
  });
  const renderData = computed(() => {
    const udata = props.userData;
      console.log("userData:",udata?.company)
    return [
      {
        label: '状态',
        value: udata?.status,
      },
      {
        label: '昵称',
        value: udata?.nickname,
      },
      {
        label: '账号ID',
        value: udata?.id,
      },
      {
        label: '邮箱',
        value: udata?.email,
      },
      {
        label: '注册时间',
        value: udata?.createtime,
      },
    ] as DescData[];
  });
</script>

<style scoped lang="less">
  .card-content {
    width: 100%;
    padding: 20px;
    background-color: rgb(var(--gray-1));
  }
  .item-label {
    min-width: 98px;
    text-align: right;
    color: var(--color-text-8);
    &:after {
      content: ':';
    }
  }
</style>
