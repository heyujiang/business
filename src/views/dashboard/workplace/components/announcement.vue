<template>
  <a-card
    class="general-card"
    :title="$t('workplace.announcement')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '15px 20px 13px 20px' }"
  >
    <template #extra>
      <a-link>{{ $t('workplace.viewMore') }}</a-link>
    </template>
    <div>
      <div v-for="(item, idx) in list" :key="idx" class="item">
        <a-tag :color="item.type" size="small">{{ item.label }}</a-tag>
        <span class="item-content">
          {{ item.content }}
        </span>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  const list = [
    {
      type: 'orangered',
      label: '尹冲',
      content: '获得开工许可/银行资金证明',
    },
    {
      type: 'cyan',
      label: '尹冲',
      content: '获得开工许可/银行资金证明',
    },
    {
      type: 'blue',
      label: '尹冲',
      content: '获得开工许可/银行资金证明',
    },
    {
      type: 'blue',
      label: '尹冲',
      content: '获得开工许可/银行资金证明',
    },
    {
      type: 'cyan',
      label: '尹冲',
      content: '获得开工许可/银行资金证明',
    },
  ];
</script>

<style scoped lang="less">
  .item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 24px;
    margin-bottom: 4px;
    .item-content {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: 4px;
      color: var(--color-text-2);
      text-decoration: none;
      font-size: 13px;
      cursor: pointer;
    }
  }
</style>
