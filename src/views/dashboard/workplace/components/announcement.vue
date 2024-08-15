<template>
  <a-card
    class="general-card"
    :title="$t('workplace.announcement')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '15px 20px 13px 20px' }"
  >
    <template #extra>
      <a-link @click="viewRecord(0)">{{ $t('workplace.viewMore') }}</a-link>
    </template>
    <div>
      <div v-for="(item, idx) in list" :key="idx" class="item" @click="viewRecord(item.id)">
        <a-tag :color="color[`${idx % color.length}`]" size="small">{{ item.username }}</a-tag>
        <span class="item-content">
         {{ item.nodeName }}---{{ item.projectName }}
        </span>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import {getLatestRecord, RecordItem} from "@/api/dashboard/workplace";
  import {ref} from "vue";
  import router from "@/router";

  const color = ref<string[]>([
    'red' , 'orangered' , 'orange' , 'gold' , 'lime' , 'green' , 'cyan' , 'blue' , 'purple' ,  'magenta'
  ])

  const list = ref<RecordItem[]>([])

  const fetchAnnouncement = async ()=>{
    list.value = await getLatestRecord()
  }

  fetchAnnouncement()

  const viewRecord = (id:number)=>{
    router.push({
      path:"/project/project_ing",
      query:{
        id:id
      }
    })
  }
</script>

<style scoped lang="less">
  .item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 24px;
    margin-bottom: 4px;
    .item-content {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: 4px;
      color: var(--color-text-2);
      text-decoration: none;
      font-size: 13px;
      cursor: pointer;
    }
  }
</style>
