<template>
  <div class="container">
    <Breadcrumb :items="['menu.user.info', 'menu.user.weekday']" />
    <a-card class="general-card onelineCard" style="margin-bottom: 10px">
      <a-row>
        <a-col :span="24">
          <a-space>
            <a-select style="width: 220px" v-if="userStore.isSystem || userStore.isSuper" :default-value="userStore.userId" v-model="searchForm.userId" :options="userOptions"  placeholder="用户" allow-clear/>
            <a-range-picker
                style="width: 250px;"
                v-model="searchForm.timeRange"
                value-format="timestamp"
                format="YYYY-MM-DD"
                :shortcuts="[
                    {
                      label: '当日',
                      value: () => [dayjs().startOf('day').toDate(),dayjs().startOf('day').add(1,'day').toDate()],
                    },
                    {
                      label: '近7天',
                      value: () => [dayjs().startOf('day').add(-6, 'day').toDate(), dayjs().startOf('day').add(1,'day').toDate()],
                    },
                    {
                      label: '近30天',
                      value: () => [dayjs().startOf('day').add(-29, 'day').toDate(),dayjs().startOf('day').add(1,'day').toDate()],
                    },
                  ]"/>
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>


    <div class="scroll-f">
      <div style="width: 380px;">
        <a-scrollbar :style="{height:unref(scrollHeight)}" style="width: 100%;background-color: var(--color-bg-2);overflow: auto;border-radius: 5px">
          <MyProject v-model:projectList="reportResp" v-model:currIndex="currProjectIndex" v-model:can-scroll="pInfoCanScroll"/>
        </a-scrollbar>
      </div>
      <div style="width: calc(100% - 390px);">
        <a-scrollbar
            :style="{height:unref(scrollHeight)}"
            style="width: 100%;background-color: var(--color-bg-2);overflow: auto;border-radius: 5px"
            @scrollend="infoScroll"
            id="p-infos"
        >
          <ProjectInfos v-model:projectList="reportResp" @gen="genHeight"/>
        </a-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import MyProject from './components/my-project.vue';
  import ProjectInfos from './components/project-infos.vue';
  import {computed, nextTick, onMounted, ref, unref, watch} from 'vue';
  import dayjs from 'dayjs';
  import { getUserOptions } from '@/api/user';
  import {Report, ReportResponseData, ReportSearch} from "@/api/report";
  import {useUserStore} from "@/store";
  import {Message} from "@arco-design/web-vue";

  const userStore = useUserStore();

  document.title="周报日报"
  const userOptions = ref<any[]>([]);
  const clientHeight = ref<number>(document.documentElement.clientHeight) //浏览器可视区域高度
  const scrollHeight = ref<string>('')
  const searchForm = ref<ReportSearch>({
    timeRange:[dayjs().startOf('day').add(-6, 'day').valueOf(),dayjs().startOf('day').add(1,'day').valueOf()]
  })
  const reportResp = ref<ReportResponseData[]>([])

  onMounted(() => {
    scrollHeight.value = clientHeight.value- 255 + 'px';
    window.onresize = function (){
      clientHeight.value = document.documentElement.clientHeight
    }

    fetchUserOptions()
    featUserReport()
  })

  const fetchUserOptions = async ()=>{
    userOptions.value = await getUserOptions();
  }

  watch(
      ()=>(clientHeight.value),
      (v) => {
        scrollHeight.value = clientHeight.value - 255 + 'px';
      },
      {}
  )

  const search = () => {
    featUserReport()
  }

  const featUserReport = async () => {
    try {
      Message.loading({content:"加载中",id:"upStatus"})
      reportResp.value = await Report(searchForm.value)
      Message.clear("top")
    }catch (error){
      console.log(error)
    }
  }

  watch(()=>reportResp.value,
      ()=>{
        nextTick(()=>{genHeight()})
        pInfoScrollTop.value = 0
      })

  const pInfoCardHeights = ref<number[]>([0])
  const genHeight = () => {
    pInfoCardHeights.value = [0]
    let cardNum = document.getElementById("pro-card-container")?.childElementCount || 0
    for (let i = 0 ; i< cardNum ; i++) {
      pInfoCardHeights.value.push(pInfoCardHeights.value[i] + (document.getElementById("p-infos-"+i)?.clientHeight || 0))
    }
    console.log(pInfoCardHeights)
    console.log(document.getElementById("pro-card-container")?.clientHeight)
  }

  const pInfoScrollTop = ref<number>(0)
  const pInfoCanScroll = ref<boolean>(true)

  const infoScroll = ()=> {
      pInfoScrollTop.value = document.getElementById("p-infos")?.scrollTop || 0
      console.log(pInfoScrollTop.value)
  }

  const currProjectIndex = ref<number>(0)
  watch(
      ()=>pInfoScrollTop.value,
      (val)=>{
        for(let i = 0 ; i < pInfoCardHeights.value.length ; i++ ){
          if(val < pInfoCardHeights.value[i]) {
            let idx = i > 0 ? i-1 : i
            if (currProjectIndex.value != idx) {
              currProjectIndex.value = idx
            }
            return
          }
        }
      })

</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
    height: 100%;
  }
  :deep(.general-card > .arco-card-header){
    padding: 10px 16px;
  }
  .scroll-f{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

</style>

