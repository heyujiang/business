<template>
  <a-card
      class="general-card"
      title="项目节点进度"
      :header-style="{ paddingBottom: '18px' }"
      :body-style="{ paddingBottom: '12px' }"
  >
    <a-steps class="project-step-top" type="arrow" small style="margin-bottom: 30px">
      <a-step status="finish">finish</a-step>
      <a-step status="wait">wait</a-step>
      <a-step status="process">process</a-step>
      <a-step status="error">error</a-step>
      <a-step >进行中</a-step>
      <a-step >项目已结束：终止</a-step>
    </a-steps>

    <a-grid cols="6">
      <a-grid-item v-for=" i in 6" style="padding-left: 20px ;">
        <a-steps class="project-step-second"  direction="vertical">
            <a-step status="finish">finish
              <template #description>
                <a-space direction="vertical">
                  <a-button type="text" style="color: #666">记录
                    <template #icon>
                      <IconEye/>
                    </template>
                  </a-button>
                  <a-space>
                    <a-tag size="small" >
                      <template #icon>
                        <icon-tag></icon-tag>
                      </template>
                      记录 3
                    </a-tag>
                    <a-tag size="small" >
                      <template #icon>
                        <icon-tag></icon-tag>
                      </template>
                      附件 3
                    </a-tag>
                  </a-space>
                </a-space>
              </template>
            </a-step>
            <a-step status="wait">wait
              <template #description>
                <a-space direction="vertical">
                  <a-button type="text">记录</a-button>
                  <a-space>
                    <a-tag size="small" >
                      <template #icon>
                        <icon-tag></icon-tag>
                      </template>
                      记录 3
                    </a-tag>
                    <a-tag size="small" >
                      <template #icon>
                        <icon-tag></icon-tag>
                      </template>
                      附件 3
                    </a-tag>
                  </a-space>
                </a-space>
              </template>
            </a-step>
            <a-step status="process">process
              <template #description>
                <a-space direction="vertical">
                  <a-button type="text">记录</a-button>
                  <a-space>
                    <a-tag size="small" >
                      <template #icon>
                        <icon-tag></icon-tag>
                      </template>
                      记录 3
                    </a-tag>
                    <a-tag size="small" >
                      <template #icon>
                        <icon-tag></icon-tag>
                      </template>
                      附件 3
                    </a-tag>
                  </a-space>
                </a-space>
              </template>
            </a-step>
            <a-step status="error">error
              <template #description>
                <a-space direction="vertical">
                  <a-button type="text">记录</a-button>
                  <a-space>
                    <a-tag size="small" >
                      <template #icon>
                        <icon-tag></icon-tag>
                      </template>
                      记录 3
                    </a-tag>
                    <a-tag size="small" >
                      <template #icon>
                        <icon-tag></icon-tag>
                      </template>
                      附件 3
                    </a-tag>
                  </a-space>
                </a-space>
              </template>
            </a-step>
            <a-step>进行中
              <template #description>
                <a-space direction="vertical">
                  <a-button type="text">记录</a-button>
                  <a-space>
                    <a-tag size="small" >
                      <template #icon>
                        <icon-tag></icon-tag>
                      </template>
                      记录 3
                    </a-tag>
                    <a-tag size="small" >
                      <template #icon>
                        <icon-tag></icon-tag>
                      </template>
                      附件 3
                    </a-tag>
                  </a-space>
                </a-space>
              </template>
            </a-step>
            <a-step>项目已结束：终止
              <template #description>
                <a-space direction="vertical">
                  <a-button type="text">记录</a-button>
                  <a-space>
                    <a-tag size="small" >
                      <template #icon>
                        <icon-tag></icon-tag>
                      </template>
                      记录 3
                    </a-tag>
                    <a-tag size="small" >
                      <template #icon>
                        <icon-tag></icon-tag>
                      </template>
                      附件 3
                    </a-tag>
                  </a-space>
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
