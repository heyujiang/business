<template>
  <div class="container" >
    <Breadcrumb :items="[route.matched[0].meta.locale, route.meta.locale]" />
    <a-card class="general-card onelineCard" style="height: calc(100% - 50px);">
      <div class="flexbox">
        <div class="menu">
          <div class="btn">
          </div>
          <div class="tablebox">
            <a-table :data="nenudata" row-key="id" @row-click="handleClickMenu" :selected-keys="selectedKeys" :scrollbar="true" :pagination="false" :bordered="{wrapper: true, cell: true}" >
              <template #columns>
                    <a-table-column title="" :width="50" data-index="id"></a-table-column>
                    <a-table-column  title="配置名称" data-index="title">
                      <template #cell="{ record }">
                         <div class="titlebox">
                          <div class="text">{{ record.title }}</div>
                          <div class="icon"><icon-right /></div>
                         </div>
                      </template>
                    </a-table-column>
                  </template>
            </a-table>
          </div>
        </div>
      <div class="content">
        <email-config v-if="selectedKeys[0]==1"></email-config>
        <attachment-config v-if="selectedKeys[0]==2"></attachment-config>
      </div>
    </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import {  ref, onMounted } from 'vue';
  //api
  import {   menuItem} from '@/api/datacenter/configuration';
  import { useRoute } from 'vue-router'
  import EmailConfig from './components/EmailConfig.vue';
  import AttachmentConfig from './components/AttachmentConfig.vue';
  const route = useRoute();
  const nenudata=ref([
    {
      id:1,
      title:"配置邮箱"
    },
    {
      id:2,
      title:"配置附件地址"
    }
  ])

  //选择菜单数据
  const Menuitem=ref<menuItem>()
  const selectedKeys=ref<number []>([1])
  const handleClickMenu=(TableData:any)=>{
    selectedKeys.value=[TableData.id]
    Menuitem.value=TableData
  }
  //组件挂载完成后执行的函数
  onMounted(()=>{
  })
</script>

<script lang="ts">
  export default {
    name: 'configuration',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
    height: 100%;
    .flexbox{
      display: flex;
      justify-content: space-between; // 替代原先的space-between布局方式
       height: 100%;
       .menu{
          width: 230px;
          margin-right: 10px;
          background-color: var(--color-neutral-1);
          .btn{
            text-align: center;
          }
        .tablebox{
           //分类标题背景色
           :deep(.arco-table-th){
              background-color: var(--color-neutral-3);
            }
            :deep(.arco-table-tr-checked .arco-table-td){
              color: rgb(var(--primary-6));
            }
          .titlebox{
            cursor: pointer;
            display: flex;
            .text{
              flex: 1;
            }
          }
        }
       }
       .content{
        flex: 1;
        min-width: 400px;
        background-color: var(--color-neutral-1);
        padding: 10px;
        min-height: 650px;
        .contentcard{
          overflow: hidden;
        }
       }
    }
  }
  :deep(.arco-btn-size-medium){
    padding: 0 10px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
  :deep(.general-card > .arco-card-header){
    padding: 10px 16px;
  }
  .iconbtn{
    user-select: none;
    cursor: pointer;
    opacity: .8;
    &:hover{
      opacity: 1;
    }
  }
  .frombtn{
    width: 100%;
    text-align: center;
  }
</style>
