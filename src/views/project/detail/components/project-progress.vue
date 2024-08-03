<template>
  <a-card
      class="general-card"
      title="项目进度"
      :header-style="{ paddingBottom: '18px' }"
      :body-style="{ paddingBottom: '12px' }"
  >

    <a-steps class="project-step" :current="unref(cur)" label-placement="vertical">
      <a-step>待开始</a-step>
      <a-step>进行中</a-step>
      <a-step v-if="unref(state)==4" status="error">项目终止</a-step>
      <a-step v-else >项目结束</a-step>
    </a-steps>
  </a-card>
</template>

<script lang="ts" setup>
  import {computed, ref , unref} from "vue"

  const props = defineProps({
   state: {
     type: Number,
     default() {
       return 0;
     },
   },
  });

  const state = computed(() => {
    return props.state
  });

  const cur = computed(() => {
    switch(props.state){
      case 1:
        return 1
      case 2:
        return 2
      case 3:
        return 3
      case 4:
        return 3
    }
  });

  console.log(cur.value);
  console.log(state.value);

</script>
<style scoped lang="less">
.general-card {
  margin-bottom: 20px;
  padding: 0 20px;
  .project-step {
    height: 100px;
    padding: 20px 50px;
  }
}
</style>
