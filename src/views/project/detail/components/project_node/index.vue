<template>
  <a-card
      class="general-card"
      title="项目节点进度"
  >
    <a-grid :cols="projectNodes.length" :colGap="10" :wrap="false">
     <a-grid-item v-for="(projectNode , index) in projectNodes" style="padding: 10px 0 " :key="index">
         <a-card class="node-card" :style="{ borderTop: `2px solid ${projectNode.state == 1 ? '#0055d1' : (projectNode.state == 2 ? '#f6c200' :  (projectNode.state == 3 ? '#00bb00' : '#0055d1')) }`}" :header-style="{ border:'none' , fontWeight:'bolder'}">
            <template #title>
              {{ projectNode.name }}
            </template>
           <a-progress :percent="projectNode.progress"/>
         </a-card>

         <a-card  class="son-node-card" v-for="(sonNode , sonIndex) in projectNode.children" :key="sonIndex" :header-style="{ border:'none' }">
           <template #title>
             <a-tag>
               <template #icon>
                 <icon-tag v-if="sonNode.state == 1" size="14" style="color: #0055d1; "/>
                 <icon-clock-circle v-else-if="sonNode.state == 2" size="14" style="color: #f6c200;  " />
                 <icon-check-circle v-else-if="sonNode.state == 3" size="14" style="color: #00bb00; "/>
               </template>
               <span v-if="sonNode.state == '1'" style="color: #0055d1; ">
                    {{'未开始'}}
               </span>
               <span v-else-if ="sonNode.state == '2'" style="color: #f6c200; " >
                    {{'进行中'}}
               </span>
               <span v-else-if ="sonNode.state == '3'" style="color: #00bb00;">
                    {{'已完成'}}
               </span>
             </a-tag>
           </template>
          <p style="font-weight: bold">{{ sonNode.name }}</p>
           <template #actions>
             <span class="icon-hover" @click="viewRecord(sonNode.nodeId)"> <icon-computer /> {{ sonNode.recordTotal }} </span>
             <span class="icon-hover" @click="viewAttached(sonNode.nodeId)"> <icon-file /> {{ sonNode.attachedTotal }} </span>
           </template>
         </a-card>
     </a-grid-item>
    </a-grid>
  </a-card>
<!--  <div style="width: 100%;height: 30px;background-color: #fff;margin-bottom: 20px;margin-top: -10px;border-radius: 0 0 4px 4px" ></div>-->
  <Attached v-model:visible="visible" :search="{projectId:projectId,nodeId:aNodeId}" :showUpload="false"/>
  <Record v-model:visible="recordVisible" :search="{projectId:projectId,nodeId:aNodeId}"/>
</template>

<script lang="ts" setup>
import {computed, ref , unref} from "vue"
import {getProjectNodes} from '@/api/project/project';
import Attached from '../../../components/Attached.vue'
import Record from '../../../components/Record.vue';


const props = defineProps({
  projectId: {
    type: Number,
    default() {
      return 0;
    },
  },
});

const projectId = computed(() => {
  return props.projectId
});

const projectNodes = ref<any[]>([])
const fetchNodes = async () => {
  try {
    projectNodes.value = await getProjectNodes(projectId.value);
    console.log(projectNodes.value)
  } catch (err) {
    // you can report use errorHandler or other
  }
};
fetchNodes();

const visible = ref(false)
const recordVisible = ref(false)
const aNodeId = ref<number>(0)

const viewAttached = async (nodeId: number) => {
  visible.value = true
  aNodeId.value = nodeId
}
const viewRecord = async (nodeId: number) => {
  recordVisible.value = true
  aNodeId.value = nodeId
}

</script>
<style scoped lang="less">
.general-card {
  padding: 0 20px;
}
.node-card{
  margin-bottom: 10px;
  border-radius: 3px ;
  background-color: var(--color-neutral-1);
}
.son-node-card{
  margin-bottom: 10px ;
  border-radius: 3px ;
}
.son-node-card:hover{
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
