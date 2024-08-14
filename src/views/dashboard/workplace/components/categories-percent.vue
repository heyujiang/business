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
      <Chart height="310px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';
  import {getPersonCapacity, PersonCapacityItem} from "@/api/dashboard/workplace";
  import {computed, ref} from "vue";
  import {useAppStore} from "@/store";
  import {string} from "vue-types";
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

  const color = ref<string[]>(['#3D72F6' ,"#3cf44b","#ef4545","#683aae",
    "#efcecb","#cc9208","#03ea54","#f6c200",
    "#32f3aa","rgba(16,89,22,0.92)"])
  const focusColor = ref<string[]>([ 'rgba(61,114,246,0.5)' ,"rgba(60,244,75,0.5)","rgba(239,69,69,0.5)","rgba(104,58,174,0.5)",
    "rgba(239,206,203,0.5)","rgba(204,146,8,0.5)","rgba(3,234,84,0.5)","rgba(246,194,0,0.5)",
    "rgba(50,243,170,0.5)","rgba(16,89,22,0.5)"])

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
        left: 'center',
        data: persons.value,
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        textStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
        itemStyle: {
          borderWidth: 0,
        },
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
              text: totalCap.value.toFixed(2),
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
</script>

<style scoped lang="less"></style>
