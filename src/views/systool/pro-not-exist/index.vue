<template>
  <div class="content">
    <a-result class="result" status="warning" :subtitle="'项目不存在'"> </a-result>
    <div class="operation-row">
      <a-button key="back" type="primary" @click="back"> 首页 </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const back = () => {
    // warning： Go to the node that has the permission
    router.push({ path: '/home' });
  };
</script>

<style scoped lang="less">
  .content {
    // padding-top: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -95px;
    margin-top: -121px;
    text-align: center;
  }
</style>
