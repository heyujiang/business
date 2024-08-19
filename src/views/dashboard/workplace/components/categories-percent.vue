<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{
        padding: '20px',
      }"
    >
      <template #title>
          负责人项目
      </template>
      <Chart height="310px" :option="chartOption" @click="viewProject"/>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';
  import * as echarts from 'echarts'
  import {getPersonCapacity, PersonCapacityItem} from "@/api/dashboard/workplace";
  import {computed, ref} from "vue";
  import {useAppStore} from "@/store";
  import {string} from "vue-types";
  import router from "@/router";
  import doc from "@/components/gfeditor/emain/ot/doc";
  const { loading } = useLoading();

  const capList = ref<PersonCapacityItem[]>([])
  const fetchData = async () => {
    try {
      capList.value = await getPersonCapacity()
      tidyData()
    }catch (err){
      console.log(err)
    }

  }
  fetchData()

  const persons = ref<string[]>([])
  const seriesData = ref<object[]>([])

  const appStore = useAppStore();
  const isDarkTheme = computed(() => {
    return appStore.theme === 'dark';
  });

  const color = ref<string[]>(['#f36405' ,"#f7c606","#7ed587","#3fc3b8",
    "#427ff7","#f8af05","#9467fc","#42b0f8","#e95350",
    "#f7c606","rgb(243,100,5)"])
  const focusColor = ref<string[]>([ 'rgb(126,213,135)' ,"rgb(63,196,185)","rgba(239,69,69,0.5)","rgb(66,127,247)",
    "rgb(84,136,239)","rgba(204,146,8,0.5)","rgb(243,100,5)","rgb(247,198,6)",
    "rgb(63,196,185)","rgb(84,136,239)"])

  const totalCap = ref<number>(0)

  function tidyData(){
    console.log(capList.value)
    capList.value.forEach((item,index)=>{
      totalCap.value += item.capacity
      persons.value.push(item.username)
      seriesData.value.push({
        value: [item.capacity],
        name: item.username,
        itemStyle: {
          color: isDarkTheme ? color.value[index%color.value.length] : focusColor.value[index%focusColor.value.length] ,
        },
      })
    })
  }

  const { chartOption } = useChartOption((isDark) => {
    // echarts support https://echarts.apache.org/zh/theme-builder.html
    // It's not used here
    return {
      legend: {
        data: persons.value,
        icon: 'circle',
        itemWidth: 8,
        textStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
        itemStyle: {
          borderWidth: 0,
        },
        width:'100%',
        height:'100%',
        left: 0,
        type:'scroll',
      },
      tooltip: {
        show: true,
        trigger: 'item',
      },

      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: '40%',
            style: {
              text: '总容量',
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#4E5969',
              fontSize: 14,
            },
          },
          {
            type: 'text',
            left: 'center',
            top: '50%',
            style: {
              text: totalCap.value.toFixed(2)+"MW",
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#1D2129',
              fontSize: 16,
              fontWeight: 500,
            },
          },
        ],
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          label: {
            formatter: '{d}%',
            fontSize: 14,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
          },
          itemStyle: {
            borderColor: isDark ? '#232324' : '#fff',
            borderWidth: 1,
          },
          data: seriesData.value,
        },
      ],
    };

  });

  const viewProject = (params:string) => {
    router.push({
      path: "/project/project",
      query: {
        name: params.name,
      }
    });
  }
</script>

<style scoped lang="less"></style>
