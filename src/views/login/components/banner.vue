<template>
  <div class="banner">
    <div class="banner-inner">
      <a-carousel class="carousel" animation-name="fade" :auto-play="{interval:5000,hoverToPause:true}">
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
      title:"title1",
      des:"des1",
      image:"..."
    },{
      title:"title2",
      des:"des2",
      image:"..."
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
      font-size: 20px;
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
      width: 320px;
      margin-top: 30px;
    }
  }
</style>
