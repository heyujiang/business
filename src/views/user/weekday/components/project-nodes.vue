<template>
    <a-collapse class="general-collapse" :default-active-key="['1']">
      <a-collapse-item key="1">
        <template #header>
            <span style="font-weight: bolder">项目节点</span>
          <span style="margin-left: 900px;">   
            <a-space size="large">
            <a-badge status="success" text="已完成" />
            <a-badge status="processing" text="当前完成" />
            <a-badge status="normal" text="未完成" />
            </a-space>
          </span>
        </template>
        <a-grid
            :cols="nodeColNum"
            :colGap="12"
            :rowGap="16"
            v-for="(node,i) in nodes"
            :key="i"
            :collapsed="collapsed[i]"
            class="node-row"
        >
          <a-grid-item class="node-item node-item-first" @click="collapsed[i] = !collapsed[i]">
            <div class="text-overflow">{{ node.name }}</div>
          </a-grid-item>
         
          <a-grid-item
              :class="[' node-item' , 'node-item-child', child.state == 1 ? 'node-item-progress' : (child.state == 2 ? 'node-item-finish' : '')]"
              v-for="(child,cIndex) in node.children"
              :key="cIndex"
              :offset="cIndex != 0 && cIndex % (nodeColNum - 1) == 0  ? 1 : 0"
          >
          <a-tooltip :content="child.name" background-color="#1d1d1d">
           <div class="text-overflow">{{ child.name }}</div> 
          </a-tooltip>
          </a-grid-item>
        </a-grid>
      </a-collapse-item>
    </a-collapse>
</template>
<script setup lang="ts">
import {defineProps, ref, withDefaults} from "vue";
import {reportNode} from "@/api/report";
const collapsed = ref<boolean[]>([]);
const nodeColNum = ref<number>(11)

withDefaults(
    defineProps<{
      nodes: reportNode[];
    }>(),
    {}
);

const colors = [
      'orangered',
      'orange',
      'gold',
      'lime',
      'green',
      'cyan',
      'blue',
      'arcoblue',
      'purple',
      'pinkpurple',
      'magenta',
      'gray'
    ];

</script>

<style scoped lang="less">
  :deep(.arco-collapse-item-content) {
    background-color: var(--color-bg-2);
  }
  .node-row{
    margin-bottom: 16px;
  }
  .node-item{
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    cursor: pointer;
  }
  .node-item-first{
    color: var(--color-white);
    background-color: var(--color-primary-light-4);
  }
  .node-item-child{
    text-align: center;
    border: 1px solid var(--color-primary-light-4);
    border-radius: 8%;
  }
  .node-item-progress{
    background-color: #87d387;
  }
  .node-item-finish{
    color: #f6c200;
  }

  
.text-overflow {
  white-space: nowrap; /* 保持文字在一行，防止换行 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 使用省略号表示文字被截断 */
  // display: 'inline-block',
}

</style>