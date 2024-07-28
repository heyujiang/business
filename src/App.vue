<template>
  <a-config-provider :locale="locale">
    <router-view v-if="isRouter"/>
    <global-setting />
  </a-config-provider>
</template>

<script lang="ts" setup>
  import { computed ,nextTick, provide, ref} from 'vue';
  import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
  import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
  import GlobalSetting from '@/components/global-setting/index.vue';
  import useLocale from '@/hooks/locale';

  const { currentLocale } = useLocale();
  const locale = computed(() => {
    switch (currentLocale.value) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return enUS;
    }
  });
  document.title=window?.globalConfig.AppTitle
  //刷新
  const isRouter = ref(true)
  const reload = () => {
    isRouter.value = false 
    nextTick(() => {isRouter.value = true})
  }
  provide("reload", reload)
</script>
<style lang="less">

// =================================
// ==============scrollbar==========
// =================================

::-webkit-scrollbar {
  width: 10px;
  height: 8px;
}

// ::-webkit-scrollbar-track {
//   background: transparent;
// }

::-webkit-scrollbar-track {
  background-color: rgb(0 0 0 / 5%);
}
::-webkit-scrollbar-thumb {
  // background: rgba(0, 0, 0, 0.6);
  background-color: rgb(144 147 153 / 30%);
  // background-color: rgba(144, 147, 153, 0.3);
  border-radius: 2px;
  box-shadow: inset 0 0 6px rgb(0 0 0 / 20%);
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-neutral-6);
}
</style>
