<template>
  <a-card
      class="general-card"
      title="项目节点进度"
      :header-style="{ paddingBottom: '18px' }"
      :body-style="{ paddingBottom: '12px' }"
  >
    <a-steps class="project-step-top" type="arrow"  style="margin-bottom: 30px">
      <a-step status="finish" >踏勘前准备工作</a-step>
      <a-step status="wait">踏勘时准备工作</a-step>
      <a-step status="process">踏勘后测算工作</a-step>
      <a-step status="wait">项目备案工作</a-step>
      <a-step >项目批复文件</a-step>
      <a-step >获得开工许可</a-step>

    </a-steps>

    <a-grid cols="6">
      <a-grid-item v-for=" i in 6" style="padding-left: 20px; ">
        <a-steps class="project-step-second"  direction="vertical" >
            <a-step status="finish">
              基本信息收集
              <template #description>
                <a-space direction="vertical" >
                  <a-link type="text" style="color: #92a4b5">
                    查看更多>>
                  </a-link>
                </a-space>
              </template>
            </a-step>
            <a-step status="finish">与资源/政府等沟通
              <template #description>
                <a-space direction="vertical">
                  <a-link type="text" style="color: #92a4b5">查看更多>>
                  </a-link>
                </a-space>
              </template>
            </a-step>
            <a-step status="process">宏观选址
              <template #description>
                <a-space direction="vertical">
                  <a-link type="text" style="color: #92a4b5">查看更多>>
                  </a-link>
                </a-space>
              </template>
            </a-step>
            <a-step status="wait">场站地形地貌
              <template #description>
                <a-space direction="vertical">
                  <a-link type="text" style="color: #92a4b5">查看更多>>
                  </a-link>
                </a-space>
              </template>
            </a-step>
            <a-step>场站坐标
              <template #description>
                <a-space direction="vertical">
                  <a-link type="text" style="color: #92a4b5">查看更多>>
                  </a-link>
                </a-space>
              </template>
            </a-step>
            <a-step>项目已结束：终止
              <template #description>
                <a-space direction="vertical">
                  <a-link type="text" style="color: #92a4b5">查看更多>>
                  </a-link>
                </a-space>
              </template>
            </a-step>
        </a-steps>
      </a-grid-item>
    </a-grid>
  </a-card>
</template>

<script lang="ts" setup>

</script>
<style scoped lang="less">
.general-card {
  margin-bottom: 20px;
  padding: 0 20px;
}
</style>
