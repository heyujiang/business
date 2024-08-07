<template>
  <a-drawer
      :width="800"
      :visible="visible.valueOf()"
      placement="right"
      @ok="handleOk"
      @cancel="handleCancel"
      hide-cancel
  >
    <template #title>
      节点记录附件，数量：{{ attachedItems.length }}
    </template>
    <a-grid :cols="4" :row-gap="10" :col-gap="10">
      <a-grid-item v-if="showUpload">
        <a-upload draggable :show-file-list="false" :custom-request="customRequest">
          <template #upload-button>
            <div class="attached-file-card" style="display: flex;align-items: center;justify-content: center">
              <a-space direction="vertical" fill>
                <div style="text-align: center;color: #aaa"><IconPlus size="22"/></div>
                <div style="text-align: center;color: #aaa">点击或拖拽文件到此处<br>上传附件</div>
              </a-space>
            </div>
          </template>
        </a-upload>
      </a-grid-item>
      <a-grid-item v-for="(attachedItem , index) in attachedItems" :key="index">
          <a-card  :header-style="{border:'none'}" :bordered="false" class="attached-file-card">
            <template #actions>
              <IconDownload @click="downloadFile(attachedItem.url,attachedItem.filename)"/>
            </template>
            <template #cover>
              <div style="width: 100%; text-align: center;">
                <img v-if="attachedItem.mime == 'application/pdf'" style="width: 20%;" alt="pdf" src="../../../assets/images/PDF.png"/>
                <img v-else-if="attachedItem.mime == 'application/vnd.ms-excel'" style="width: 20%;" alt="pdf" src="../../../assets/images/ECEL.png"/>
                <img v-else-if="attachedItem.mime == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'" style="width: 20%;" alt="pdf" src="../../../assets/images/ECEL.png"/>
                <img v-else-if="attachedItem.mime == 'application/wps-office.xlsx'" style="width: 20%;" alt="pdf" src="../../../assets/images/ECEL.png"/>
                <img v-else-if="attachedItem.mime == 'application/msword'" style="width: 20%;" alt="pdf" src="../../../assets/images/WORD.png"/>
                <img v-else-if="attachedItem.mime == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'" style="width: 20%;" alt="pdf" src="../../../assets/images/WORD.png"/>
                <img v-else-if="attachedItem.mime == 'application/wps-office.docx'" style="width: 20%;" alt="pdf" src="../../../assets/images/WORD.png"/>
                <img v-else style="width: 20%;" alt="pdf" src="../../../assets/images/DOC.png"/>
              </div>
            </template>
            <a-card-meta >
              <template #title>
                <a-typography-paragraph spacing="close" ellipsis >
                  {{attachedItem.filename}}
                </a-typography-paragraph>
              </template>
              <template #description>
                {{ attachedItem.createdAt }}
                <br>
                {{ fileSize(attachedItem.size) }}
              </template>
            </a-card-meta>
          </a-card>
      </a-grid-item>
    </a-grid>
<!--    <a href="" target="_blank"></a>-->
  </a-drawer>
</template>
<script lang="ts" setup>
import {withDefaults, defineProps, ref, defineEmits, watch} from 'vue';
import {  getProjectAttached ,createProjectAttached} from '@/api/project/project';
import {RequestOption} from "@arco-design/web-vue/es/upload/interfaces";
import {userUploadApi} from "@/api/common";

interface attachedSearch {
  recordId?: number;
  nodeId?: number;
  projectId?:number,
}

const props = withDefaults(
    defineProps<{
      visible: Boolean;
      search: attachedSearch;
      showUpload: Boolean
    }>(),
    {}
);

const emits = defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (e: 'update:recordId', val: number): void;
}>();

watch(() => ({...props.search}), () => fetchRecordAttached())

const handleOk = () => {
  emits('update:visible',false)
};
const handleCancel = () => {
  emits('update:visible',false)
}

const attachedItems = ref<any>([])
const fetchRecordAttached = async () => {
  attachedItems.value = await getProjectAttached(props.search)
  console.log(attachedItems.value)
}
fetchRecordAttached()

//上传附件
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
      const resdata = await userUploadApi({ name: 'file', file: fileItem.file as Blob, filename,data:{type:'attached'}},onUploadProgress);
      //更新图片
      if(resdata){
        await createProjectAttached(Object.assign({},resdata,{recordId:props.search.recordId}))
        fetchRecordAttached()
      }
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

const downloadFile = (url:string,filename:string)=>{
  const a = document.createElement('a')
  a.href = url
  a.target = "_blank"
  a.download = filename // 下载后文件名
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click() // 点击下载
  document.body.removeChild(a) // 下载完成移除元素
}

const fileSize = (size:number) => {
  if (!size) return '';
  if (size < pow1024(1)) return size + ' B';
  if (size < pow1024(2)) return (size / pow1024(1)).toFixed(2) + ' KB';
  if (size < pow1024(3)) return (size / pow1024(2)).toFixed(2) + ' MB';
  if (size < pow1024(4)) return (size / pow1024(3)).toFixed(2) + ' GB';
  return (size / pow1024(4)).toFixed(2) + ' TB';
}

function pow1024(num:number) {
  return Math.pow(1024, num)
}
</script>

<style scoped lang="less">
.attached-file-card{
  height: 210px;
  border: 1px solid #ccc;
  padding-top: 20px;
  border-radius: 5px
}
.attached-file-card:hover{
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>