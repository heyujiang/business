<template>
  <div class="banner">
    <div class="banner-inner">
      <a-carousel class="carousel" animation-name="fade" :auto-play="{interval:3000,hoverToPause:true}">
        <a-carousel-item v-for="item in carouselItem" :key="item.title">
          <div :key="item.title" class="carousel-item">
            <div class="carousel-title">{{ item.title }}</div>
            <div class="carousel-sub-title">{{ item.des }}</div>
            <img class="carousel-image" :src="item.image" />
          </div>
        </a-carousel-item>
      </a-carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted,ref } from 'vue';
  //api
  // import { getlogininfo } from '@/api/user';
  //组件挂载完成后执行的函数
  interface LoginInfo{
    title:string;
    des:string;
    image:string;
  }
  const carouselItem=ref<LoginInfo []>([
    {
      title:"京杭能源发展有限公司",
      des:"京杭能源有限公司成立于2020年12月1日，重点布局新能源产业链上下游，积极发展海上风电、陆上风电、光伏发电、抽水蓄能、储能等电站的开发、投资、并购重组等业务同时，投资与新能源业务关联度高、具有优势互补和战略协同效应的相关产业，基本形成了风电、太阳能、战略投资等相互支撑、协同发展的业务布局。",
      image:"../../../../src/assets/images/city.jpg"
    },{
      title:"京杭能源有限公司",
      des:"京杭能源牢牢把握“低碳经济，绿色发展”方向，立足新发展阶段、贯彻新发展理念、构建新发展格局，高度重视新能源的发展，不断创新新能源发电技术，充分探索新能源发电开发新模式，加强新能源发电数字化智能化建设，以新能源的快速发展引领企业高质量发展，用责任与实干践行新能源企业的使命和担当，为落实我国能源安全新战略、实现“碳达峰”“碳中和”目标做出更大贡献",
      image:"../../../../src/assets/images/yunnan.jpg"
    }
  ])
  // onMounted(async()=>{
  //   carouselItem.value = await getlogininfo({});
  // })
</script>

<style lang="less" scoped>
  .banner {
    display: flex;
    align-items: center;
    justify-content: center;

    &-inner {
      flex: 1;
      height: 100%;
    }
  }

  .carousel {
    height: 100%;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    &-title {
      color: var(--color-fill-1);
      font-weight: 500;
      font-size: 25px;
      line-height: 28px;
    }

    &-sub-title {
      margin-top: 8px;
      color: var(--color-text-3);
      font-size: 14px;
      line-height: 22px;
      padding: 0px 15px;
    }

    &-image {
      width: 400px;
      margin-top: 30px;
    }
  }
</style>
