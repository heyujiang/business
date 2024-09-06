<template>
    <a-collapse class="general-collapse" :default-active-key="['1']">
      <a-collapse-item key="1">
        <template #header>
          <span style="font-weight: bolder">项目节点</span>
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
            <a-space>
              <icon-caret-down v-if="collapsed[i]" size="20"/><icon-caret-up v-else size="20"/><span>{{ node.name }}</span>
            </a-space>
          </a-grid-item>

          <a-grid-item
              :class="[' node-item' , 'node-item-child', child.state == 1 ? 'node-item-progress' : (child.state == 2 ? 'node-item-finish' : '')]"
              v-for="(child,cIndex) in node.children"
              :key="cIndex"
              :offset="cIndex != 0 && cIndex % (nodeColNum - 1) == 0  ? 1 : 0"
          >
            {{ child.name }}
          </a-grid-item>
        </a-grid>


      </a-collapse-item>
    </a-collapse>
</template>
<script setup lang="ts">
import {defineProps, ref, withDefaults} from "vue";
import {reportNode} from "@/api/report";
const collapsed = ref<boolean[]>([]);
const nodeColNum = ref<number>(6)

withDefaults(
    defineProps<{
      nodes: reportNode[];
    }>(),
    {}
);
</script>

<style scoped lang="less">
  :deep(.arco-collapse-item-content) {
    background-color: var(--color-bg-2);
  }
  .node-row{
    margin-bottom: 16px;
  }
  .node-item{
    height: 48px;
    line-height: 48px;
    padding: 0 10px;
  }
  .node-item-first{
    color: var(--color-white);
    background-color: var(--color-primary-light-4);
  }
  .node-item-child{
    text-align: center;
    border: 1px solid var(--color-primary-light-4);
  }
  .node-item-progress{
    color: #00bb00;
  }
  .node-item-finish{
    color: #f6c200;
  }

</style>