<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :loading="loading" helpMessage="编辑和修改项目进度" width="800px" :minHeight="420" :title="getTitle" @ok="handleSubmit" @close="handleClose">
    <a-form ref="formRef" :model="formData" auto-label-width >
      <a-row :gutter="16">
        <a-col :span="16">
          <a-form-item field="projectId" label="项目" validate-trigger="change" :rules="[{required:true,message:'请选择项目'}]" style="margin-bottom:15px;">
            <a-select  v-model="formData.projectId" allow-search :options="projectOption" @change="projectChange" :disabled="isUpdate" placeholder="请选择项目" allow-clear/>
          </a-form-item>
        </a-col>

        <a-col :span="16">
          <a-form-item field="nodeId" label="节点" validate-trigger="change" :rules="[{required:true,message:'请选择节点'}]" style="margin-bottom:15px;">
            <a-tree-select
                v-model="formData.nodeId"
                :data="projectNodeOption"
                placeholder="请选择节点"
                :fieldNames="{
                  key: 'value',
                  title: 'label',
                }"
                allow-clear
                :disabled="isUpdate"
            ></a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="16">
          <a-form-item field="state" label="完成情况" validate-trigger="change" :rules="[{required:true,message:'请选择完成情况'}]" style="margin-bottom:15px;">
            <a-select v-model="formData.state"  :options="recordStateOptions"  :disabled="isUpdate" placeholder="请选择请选择完成情况" allow-clear/>
          </a-form-item>
        </a-col>
        <a-col :span="16" >
          <a-form-item field="overview" label="备注"  style="margin-bottom:15px; height: 60px">
            <a-textarea  v-model="formData.overview" placeholder="请输入节点记录备注" allow-clear/>
          </a-form-item>
        </a-col>
        <a-col :span="10" v-if="!isUpdate">
          <a-form-item field="file" label="添加附件" validate-trigger="input"  :rules="[{required:true,message:'请上传文件'}]" style="margin-bottom:15px;">
            <a-upload  :custom-request="customRequest" @before-remove="removeFile" placeholder="点击添加附件" :file-list="defaultFileList"  allow-clear/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { FormInstance } from '@arco-design/web-vue/es/form';
import useLoading from '@/hooks/loading';
import { useI18n } from 'vue-i18n';
import { cloneDeep } from 'lodash-es';
//api
import {getProjectOption, getProjectNodeOption, createProjectAttached} from '@/api/project/project';
import { save,update} from '@/api/project/project_ing';
import { IconPicker ,Icon} from '@/components/Icon';
import { Message } from '@arco-design/web-vue';
import dayjs from 'dayjs';
import {recordStateOptions} from "@/views/project/data";
import type {RequestOption} from "@arco-design/web-vue/es/upload/interfaces";
import {userUploadApi} from "@/api/common";
import {ResultEnum} from "@/utils/http/httpEnum";
export default defineComponent({
  name: 'AddBook',
  computed: {
    recordStateOptions() {
      return recordStateOptions
    }
  },
  components: { BasicModal,IconPicker,Icon },
  emits: ['success'],
  setup(_, { emit }) {
    const { t } = useI18n();
    const isUpdate = ref(false);
    //表单
    const formRef = ref<FormInstance>();
    //ID
    const projectId = ref(0);
    //表单字段

    interface addRecord {
      projectId?:number,
      nodeId?:number,
      overview?:string,
      state?:number,
      file?:object,
    }

    const defaultFileList = ref([])
    const basedata:addRecord = {}

    const formData = ref(basedata)
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      formRef.value?.resetFields()
      setModalProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;
      if (unref(isUpdate)) {
        projectId.value = data.record.id
        formData.value=cloneDeep(data.record)
        projectChange(data.record.projectId)
      }else{
        formData.value=basedata

        formData.value.projectId = data.record.projectId
        formData.value.nodeId = data.record.nodeId
        if(data.record.projectId > 0){
          projectChange(data.record.projectId)
        }

        defaultFileList.value = []
      }
    });
    const getTitle = computed(() => (!unref(isUpdate) ? '新增项目进度' : '编辑项目进度'));

    //点击确认
    const { loading, setLoading } = useLoading();
    const handleSubmit = async () => {
      try {
        const res = await formRef.value?.validate();
        if (!res) {
          setLoading(true);

          if(!unref(isUpdate)){
            Message.loading({content:"新增中",id:"upStatus"})
            await save(unref(formData));
            Message.success({content:"新增成功",id:"upStatus"})
          }else{
            Message.loading({content:"更新中",id:"upStatus"})
            await update(unref(projectId),unref(formData));
            Message.success({content:"更新成功",id:"upStatus"})
          }

          closeModal()
          emit('success');
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    const handleClose = () => {
      formData.value=basedata
      defaultFileList.value = []
    }

    const projectOption = ref([]);
    const projectNodeOption = ref([]);

    const fatchProjectOption = async () => {
      projectOption.value = await getProjectOption();
    }
    fatchProjectOption()

    const projectChange = async (projectId:number) => {
      projectNodeOption.value =  await getProjectNodeOption(projectId);
    }

    //上传附件改变
    const onChange=(fileList:any)=>{
      console.log("fileList",fileList)
    }

    const removeFile=(file:any)=>{
      console.log(file)
      console.log("remove file")

      return new Promise((resolve, reject) => {
        formData.value.file = undefined
        resolve(true)
      });
    }

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
          const uploadRes = await userUploadApi({ name: 'file', file: fileItem.file as Blob, filename,data:{type:'attached'}},onUploadProgress);

          //更新图片
          if(uploadRes){
            if(uploadRes.code != ResultEnum.SUCCESS) {
              Message.error(uploadRes?.msg||"上传文件失败");
            }else{
              formData.value.file = uploadRes.data
            }
          }
          formRef.value?.validateField("file")
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

    return {
      registerModal,
      getTitle,
      handleSubmit,
      formRef,
      loading,
      formData,
      isUpdate,
      t,
      recordStateOptions,
      projectOption,
      projectNodeOption,
      dayjs,
      projectChange,
      handleClose,
      onChange,
      customRequest,
      defaultFileList,
      removeFile,
    };
  },
});
</script>
