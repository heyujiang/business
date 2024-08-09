<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :loading="loading" helpMessage="编辑和修改用户" width="800px" :minHeight="420" :title="getTitle" @ok="handleSubmit">
    <a-form ref="formRef" :model="formData" auto-label-width>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="username" label="姓名" validate-trigger="input" :rules="[{required:true,message:'请填写姓名'}]" style="margin-bottom:15px;">
            <a-input  v-model="formData.username" :disabled="isUpdate" placeholder="请填用户名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="password" label="登录密码" style="margin-bottom:15px;">
            <a-input v-model="formData.password" :disabled="isUpdate"  placeholder="登录密码(默认密码123456)" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="phoneNumber" label="手机号" validate-trigger="input" :rules="[{required:true,message:'请填写手机号'}]" style="margin-bottom:15px;">
            <a-input v-model="formData.phoneNumber"  :disabled="isUpdate" placeholder="请填手机号" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="email" label="邮箱" validate-trigger="input" style="margin-bottom:15px;">
            <a-input v-model="formData.email" placeholder="请填写邮箱" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="部门" field="deptId" style="margin-bottom:15px;" validate-trigger="change" :rules="[{required:true,message:'请选择部门'}]">
            <a-tree-select placeholder="选择部门"
                           :data="deptList"
                           :fieldNames="{
                             key: 'id',
                             title: 'title',
                             children: 'children'
                           }"
                           v-model="formData.deptId">
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="角色" field="roleIds" style="margin-bottom:15px;" validate-trigger="change" :rules="[{required:true,message:'请选择角色'}]">
            <a-tree-select placeholder="选择角色"
                           :data="roleList"
                           :fieldNames="{
                             key: 'id',
                             title: 'title',
                             children: 'children'
                           }"
                           multiple
                           v-model="formData.roleIds">
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="avatar" label="头像" style="margin-bottom:15px;">
            <a-upload
                action="/"
                :show-file-list="false"
                :custom-request="customRequest"
              >
                <template #upload-button>
                  <div
                    :class="`arco-upload-list-item`"
                  >
                    <div
                      class="arco-upload-list-picture custom-upload-avatar"
                      v-if="formData.avatar"
                    >
                      <img :src="formData.avatar" />
                      <div class="arco-upload-list-picture-mask">
                        <IconEdit />
                      </div>
                    </div>
                    <div class="arco-upload-picture-card" v-else>
                      <div class="arco-upload-picture-card-text">
                        <IconPlus />
                        <div style="margin-top: 10px; font-weight: 600">上传头像</div>
                      </div>
                    </div>
                  </div>
                </template>
              </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { useI18n } from 'vue-i18n';
  import { cloneDeep } from 'lodash-es';
  //api
  import { save,update,isAccountexist} from '@/api/system/account';
  import { getParent as getDeptOptions} from '@/api/system/dept';
  import { getParent as getRoleOptions} from '@/api/system/role';
  import { IconPicker ,Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  import type { RequestOption} from '@arco-design/web-vue/es/upload/interfaces';
  import {UploadItem, userUploadApi} from '@/api/common';
  import {ResultEnum} from "@/utils/http/httpEnum";
  import {Result} from "/#/axios";
  import {any} from "vue-types";
  export default defineComponent({
    name: 'AddBook',
    components: { BasicModal,IconPicker,Icon },
    emits: ['success','register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const isUpdate = ref(false);
      //表单
      const formRef = ref<FormInstance>();
      //ID
      const userId = ref(0);
      const deptList = ref([]);
      const roleList = ref([]);
      //表单字段
      const basedata={
          id:0,
          username: "",
          phoneNumber:"",//手机
          // name: '',
          // nickName: '',
          deptId:'',
          roleIds:[],
          password: '',
          email:"",//邮箱
          avatar:"",
        }
      const formData = ref(basedata)
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
          formRef.value?.resetFields()
          deptList.value = await getDeptOptions();
          roleList.value = await getRoleOptions();
          setModalProps({ confirmLoading: false });
          isUpdate.value = !!data?.isUpdate;
          if (unref(isUpdate)) {
            userId.value = data.record.id
            formData.value=cloneDeep(data.record)
          }else{
            formData.value=basedata
          }
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增用户' : '编辑用户'));
     //点击确认
     const { loading, setLoading } = useLoading();
     const handleSubmit = async () => {
      try {
          const res = await formRef.value?.validate();
          if (!res) {
            setLoading(true);

            if(!unref(isUpdate)){
              if(formData.value.password==""){
                formData.value.password="123456"
              }
              Message.loading({content:"新增中",id:"upStatus"})
              await save(unref(formData));
              Message.success({content:"新增成功",id:"upStatus"})
            }else{
              Message.loading({content:"更新中",id:"upStatus"})
              await update(unref(userId),unref(formData));
              Message.success({content:"更新成功",id:"upStatus"})
            }

            closeModal()
            emit('success');
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          Message.clear("top")
        }
      };

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
                const uploadRes = await userUploadApi({ name: 'file', file: fileItem.file as Blob, filename,data:{type:'avatar'}},onUploadProgress);
                //更新图片
                if(uploadRes){
                  if(uploadRes.code != ResultEnum.SUCCESS) {
                    Message.error(uploadRes?.msg||"上传文件失败");
                  }else{
                    formData.value.avatar=uploadRes.data.url
                  }
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
      //验证账号唯一性
      const usernameRules = [{
        validator: (value:any, cb:any) => {
          return new Promise(async(resolve) => {
            if(!value){
              cb('请填写登录账号')
            }else{
              let sdata={username:value}
              if(formData.value.id>0){
                sdata=Object.assign({},sdata,{id:formData.value.id}) as any
              }
              const resData = await isAccountexist(sdata);
              if(resData.code==1){
                cb(resData.message)
              }
            }
            resolve(true)
          })
        }
      }];
      return {
        registerModal,
        getTitle,
        handleSubmit,
        formRef,
        loading,
        formData,
        isUpdate,
        t,
        customRequest,
        usernameRules,
        deptList,
        roleList,
      };
    },
  });
</script>
