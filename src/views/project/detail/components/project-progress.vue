<template>
  <a-card
      class="general-card"
      title="项目进度"
      :header-style="{ paddingBottom: '18px' }"
      :body-style="{ paddingBottom: '12px' }"
  >
<!--    <a-steps class="project-step" :current="3"  label-placement="vertical">-->
<!--      <a-step description="项目还未开始">待开始</a-step>-->
<!--      <a-step description="项目正在进行中">进行中</a-step>-->
<!--      <a-step description="项目已结束：完成">已完成</a-step>-->
<!--    </a-steps>-->

    <a-steps class="project-step" :current="current" label-placement="vertical">
      <a-step description="项目还未开始">待开始</a-step>
      <a-step description="项目正在进行中">进行中</a-step>
      <a-step :status="state == 4 ? 'error' : ''">
        项目终止
        <template #description>
          项目已结束：{{ }}
        </template>
      </a-step>
    </a-steps>
  </a-card>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue"
  const props = defineProps({
   state: {
     type: Number,
     default() {
       return 0;
     },
   },
  })

console.log("state:",props.state)
  const current = ref(1);
  const curVal = (state:number)=>{
    switch (state) {
      case 1:
        current.value = 1
        break;
      case 2:
        current.value = 2
        break;
      case 3:
        current.value = 3
        break;
      case 4:
        current.value = 3
        break;
    }
    console.log(current.value)
  }

  curVal(props.state)

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
