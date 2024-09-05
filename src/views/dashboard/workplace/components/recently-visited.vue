<template>
  <a-card
    class="general-card"
    :title="$t('workplace.recently.visited')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ paddingTop: '26px' }"
  >
  <div style="margin-bottom: -1rem">
      <a-row :gutter="8">
        <a-col v-for="link in links" :key="link.text" :span="8" class="wrapper">
          <router-link :to="link.alink" style="color: inherit;text-decoration: none;">
          <div class="icon">
            <component :is="link.icon" />
          </div>
          <a-typography-paragraph class="text">
            {{ $t(link.text) }}
          </a-typography-paragraph>
           </router-link>
        </a-col>
      </a-row>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  const links = [
    {
      // 新增项目
      text: 'menu.project.add',
      icon: 'icon-storage',
      alink:'project/addproject',
    },
    {
      //项目进度
      text: 'menu.schedule',
      icon: 'icon-file',
      alink:'project/project_ing',
    },
    {
      //我的项目
      text: 'userInfo.title.myProject',
      icon: 'icon-settings',
      alink:'user/info',
    },
  ];
</script>

<style lang="less" scoped>
  :deep(.arco-card-header-title) {
    line-height: inherit;
  }
</style>
