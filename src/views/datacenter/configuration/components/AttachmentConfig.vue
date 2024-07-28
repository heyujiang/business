<template>
   <a-card class="general-card contentcard" v-if="formData">
        <template #title>
          配置附件地址
        </template>
        <a-row :gutter="80">
          <a-col :span="18">
              <a-form-item
              label="附件请求路径前缀"
              field="keyvalue"
              extra="示例地址：https://youdomain.cn/common/uploadfile/get_image?url="
              >
              <a-input v-model="formData.keyvalue" placeholder="填写附件请求路径前缀" allow-clear/>
              </a-form-item>
          </a-col>
          <a-col :span="24">
              <a-form-item >
              <div class="frombtn">
                  <a-button type="primary" html-type="submit" style="width: 120px;" @click="submitEmail">保存</a-button>
              </div>
              </a-form-item>
          </a-col>
        </a-row>
    </a-card>
  </template>
  
  <script lang="ts" setup>
    import {  ref, onMounted } from 'vue';
    //api
    import { saveConfig,getConfig} from '@/api/datacenter/common_config';
    import { Message } from '@arco-design/web-vue';
  
    //数据配置
    const formData=ref({
      keyname:"",
      keyvalue:"",
    })
    //保存邮箱
    const submitEmail=async()=>{
      Message.loading({content:"保存中",id:"upStatus",duration:0})
      await saveConfig(formData.value);
      Message.success({content:"保存成功",id:"upStatus",duration:2000})
    }
    //组件挂载完成后执行的函数
    onMounted(()=>{
      InitData()
    })
    //加载数据
    const InitData=async()=>{
      const emaildata = await getConfig({keyname:"rooturl"});
      formData.value=Object.assign({},formData.value,emaildata)
    }
  </script>
  
  <style scoped lang="less">
  .contentcard{
        overflow: hidden;
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
  