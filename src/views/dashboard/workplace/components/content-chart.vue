<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: 0 }"
      :body-style="{
        paddingTop: '20px',
      }"
      title="员工数据"
    >
      <template #extra>
        <a-range-picker
            style="width: 250px;"
            v-model="searchForm.timeRange"
            value-format="timestamp"
            format="YYYY-MM-DD"
            @change="dateChange"
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
      </template>
      <div v-if="loading" style="height: 289px;width: 100%;text-align: center;line-height: 289px"><a-spin></a-spin></div>
      <Chart v-else height="289px" :option="chartOption" @click="clickChart"/>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import {onMounted, ref} from 'vue';
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';
  import {getUserData, UserDataParams} from "@/api/dashboard/workplace";
  import router from "@/router";
  import dayjs from "dayjs";
  import {CalendarValue} from "@arco-design/web-vue/es/date-picker/interface";

  const searchForm = ref<UserDataParams>({
    timeRange:[dayjs().startOf('day').add(-6, 'day').valueOf(),dayjs().startOf('day').add(1,'day').valueOf()]
  })


  const { loading, setLoading } = useLoading(true);
  const xAxis = ref<string[]>([]);
  const seriesProject = ref<number[]>([]);
  const seriesRecord = ref<number[]>([]);
  const seriesAttached = ref<number[]>([]);

  const { chartOption } = useChartOption(() => {
    return {
      legend: {
        data: ["项目", "记录", "文件"]
      },
      color:["#42b0f8","#f8af05","#7ed587"],
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      tooltip:{
        trigger:"item"
      },
      xAxis: {
        type: "category",
        data: xAxis.value
      },
      yAxis: {
        type: "value"
      },
      series: [{
        name: "项目",
        type: "bar",
        data: seriesProject.value,
        barMaxWidth:30,
        barMinWidth:10,
        tooltip:{
          position:'top',
        }
      }, {
        name: "记录",
        type: "bar",
        data:  seriesRecord.value,
        barMaxWidth:30,
        barMinWidth:10,
        tooltip:{
          position:'top',
        }
      }, {
        name: "文件",
        type: "bar",
        data:  seriesAttached.value,
        barMaxWidth:30,
        barMinWidth:10,
        tooltip:{
          position:'top',
        }
      }]
    };
  })

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUserData(searchForm.value);
      xAxis.value  = data.usernames
      seriesProject.value = data.projectCounts
      seriesRecord.value = data.recordCounts
      seriesAttached.value =data.attachedCounts
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  onMounted(()=>{
    fetchData();
  })

  const clickChart = (params:any)=>{
    if(params.seriesName == '项目'){
      router.push({
        path:'/project/project',
        query:{
          name : params.name
        }
      })
    }else if(params.seriesName == '记录'){
      router.push({
        path:'/project/project_ing',
        query:{
          name : params.name
        }
      })
    }

  }

  const dateChange = (value: (CalendarValue | undefined)[] | undefined, date: (Date | undefined)[] | undefined, dateString: (string | undefined)[] | undefined) => {
    searchForm.value.timeRange = value?.map(Number)
    fetchData()
  }
</script>

<style scoped lang="less"></style>
