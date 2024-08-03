<template>
  <a-card
      class="general-card"
      title="项目节点进度"
      :body-style="{ paddingBottom: '0px' , backgroundColor:'#f8fafa' }"
  >
    <a-grid :cols="6" :colGap="10" :wrap="false">
     <a-grid-item v-for="i in 6" style="padding: 20px 0">
         <a-card :bordered="false" style="margin-bottom: 10px ;border-radius: 3px ; border-top: 2px solid red" :header-style="{ borderTop:'1px solid red' , border:'none' }">
            <template #title>
              Top Node : {{i}}
            </template>
           <a-progress :percent="0.2"/>
         </a-card>

         <a-card :bordered="false" class="son-node-card"  v-for="ii in 6" style="margin-bottom: 10px ; border-radius: 3px ;" :header-style="{ border:'none' }">
           <template #title>
             <a-tag>
               <template #icon>
                 <icon-tag size="14"/>
                 <icon-clock-circle size="14"/>
                 <icon-check-circle size="14"/>
               </template>
               未开始
             </a-tag>
           </template>
           son node : {{ii}} son node : {{ii}} son node : {{ii}}
           <template #actions>
             <span class="icon-hover"> <icon-computer /> 23 </span>
             <span class="icon-hover"> <icon-file /> 26 </span>
           </template>
         </a-card>
     </a-grid-item>
    </a-grid>
  </a-card>
  <div style="width: 100%;height: 30px;background-color: #fff;margin-bottom: 20px;margin-top: -10px;border-radius: 0 0 4px 4px" ></div>
</template>

<script lang="ts" setup>
import {computed, ref , unref} from "vue"
import {getProjectNodes} from '@/api/project/project';

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

const fetchNodes = async () => {
  try {
    const data = await getProjectNodes(projectId.value);
    console.log(data)
  } catch (err) {
    // you can report use errorHandler or other
  }
};
fetchNodes();

</script>
<style scoped lang="less">
.general-card {
  padding: 0 20px;
}
.son-node-card:hover{
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
