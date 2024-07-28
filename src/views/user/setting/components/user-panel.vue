<template>
  <a-card :bordered="false">
    <a-space :size="54">
      <a-upload
        :custom-request="customRequest"
        list-type="picture-card"
        :file-list="fileList"
        :show-upload-button="true"
        :show-file-list="false"
        :multiple="false"
        @change="uploadChange"
      >
        <template #upload-button>
          <a-avatar :size="100" class="info-avatar">
            <template #trigger-icon>
              <icon-camera />
            </template>
            <img v-if="fileList.length" :src="fileList[0].url" />
          </a-avatar>
        </template>
      </a-upload>
      <a-descriptions
        :data="renderData"
        :column="2"
        align="right"
        layout="inline-horizontal"
        :label-style="{
          width: '140px',
          fontWeight: 'normal',
          color: 'rgb(var(--gray-8))',
        }"
        :value-style="{
          width: '200px',
          paddingLeft: '8px',
          textAlign: 'left',
        }"
      >
        <template #label="{ label }">{{ $t(label) }} :</template>
        <template #value="{ value, data }">
          <a-tag
            v-if="data.label === 'userSetting.label.certification'"
            color="green"
            size="small"
          >
            已认证
          </a-tag>
          <span v-else-if="data.label=='userSetting.label.phone'">
            {{phoneFilter(value)}}
          </span>
          <span v-else>{{ value }}</span>
        </template>
      </a-descriptions>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
  import { PropType,ref,watch } from 'vue';
  import type {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';
  import { Message } from '@arco-design/web-vue';
  import dayjs from 'dayjs';
  import { useUserStore } from '@/store';
  import { userUploadApi } from '@/api/common';
  import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
  import { BasicInfoModel,saveInfo} from '@/api/user-center';
 const props = defineProps({
     formData: {
      type: Object as PropType<BasicInfoModel>,
      default: false,
    },
 });
  const userStore = useUserStore();
  const file = {
    uid: '-2',
    name: 'avatar.png',
    url: userStore.avatar,
  };
  const renderData =ref()
  watch(
      () => props.formData,
      () => {
        renderData.value = [
          {
            label: 'userSetting.label.name',
            value: userStore.name,
          },
          {
            label: 'userSetting.label.certification',
            value: 1,
          },
          {
            label: 'userSetting.label.accountId',
            value:  props.formData.id,
          },
          {
            label: 'userSetting.label.phone',
            value: props.formData.mobile,
          },
          {
            label: 'userSetting.label.registrationDate',
            value:dayjs(parseInt(props.formData.createtime)*1000).format('YYYY-MM-DD HH:mm'),
            // value:props.formData.createtime,
          },
        ] as DescData[];
      }
    )
  const fileList = ref<FileItem[]>([file]);
  const uploadChange = (fileItemList: FileItem[], fileItem: FileItem) => {
    fileList.value = [fileItem];
  };
  const customRequest = (options: RequestOption) => {
    // docs: https://axios-http.com/docs/cancellation
    const controller = new AbortController();
    (async function requestWrap() {
      const {
        onProgress,
        onError,
        onSuccess,
        fileItem,
      } = options;
      onProgress(20);
      const onUploadProgress = (event: ProgressEvent) => {
        let percent;
        if (event.total > 0) {
          percent = (event.loaded / event.total) * 100;
        }
        onProgress(parseInt(String(percent), 10), event);
      };
      try {
         //开始手动上传
         const filename=fileItem?.name||""
        const resdata = await userUploadApi({ name: 'file', file: fileItem.file as Blob, filename,data:{cid:0}},onUploadProgress);
        //更新图片
        if(resdata){
          Message.loading({content:"更新头像",id:"delaction"})
          const upres = await saveInfo({avatar:resdata.url})
          if(upres){
            Message.success({content:"更新成功",id:"delaction"})
          }else{
            Message.clear()
          }
        }
        onSuccess(resdata);
      } catch (error) {
        onError(error);
      }
    })();
    return {
      abort() {
        controller.abort();
      },
    };
  };
    //手机号过滤器
    const phoneFilter=(val:string) =>{
    let reg = /^(.{3}).*(.{4})$/;
    return val.replace(reg, "$1****$2");
  }
</script>

<style scoped lang="less">
  .arco-card {
    padding: 14px 0 4px 4px;
    border-radius: 4px;
  }
  :deep(.arco-avatar-trigger-icon-button) {
    width: 32px;
    height: 32px;
    line-height: 32px;
    background-color: #e8f3ff;
    .arco-icon-camera {
      margin-top: 8px;
      color: rgb(var(--arcoblue-6));
      font-size: 14px;
    }
  }
</style>
