<template>
  <a-list :bordered="false">
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.password') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              {{ $t('userSetting.SecuritySettings.placeholder.password') }}
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link @click="changePassWord=true">
              {{ $t('userSetting.SecuritySettings.button.update') }}
            </a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
<!--    <a-list-item>-->
<!--      <a-list-item-meta>-->
<!--        <template #avatar>-->
<!--          <a-typography-paragraph>-->
<!--            {{ $t('userSetting.SecuritySettings.form.label.securityQuestion') }}-->
<!--          </a-typography-paragraph>-->
<!--        </template>-->
<!--        <template #description>-->
<!--          <div class="content">-->
<!--            <a-typography-paragraph class="tip">-->
<!--              {{-->
<!--                $t('userSetting.SecuritySettings.placeholder.securityQuestion')-->
<!--              }}-->
<!--            </a-typography-paragraph>-->
<!--          </div>-->
<!--          <div class="operation">-->
<!--            <a-link>-->
<!--              {{ $t('userSetting.SecuritySettings.button.settings') }}-->
<!--            </a-link>-->
<!--          </div>-->
<!--        </template>-->
<!--      </a-list-item-meta>-->
<!--    </a-list-item>-->
<!--    <a-list-item>-->
<!--      <a-list-item-meta>-->
<!--        <template #avatar>-->
<!--          <a-typography-paragraph>-->
<!--            {{ $t('userSetting.SecuritySettings.form.label.phone') }}-->
<!--          </a-typography-paragraph>-->
<!--        </template>-->
<!--        <template #description>-->
<!--          <div class="content">-->
<!--            <a-typography-paragraph>-->
<!--              {{phoneFilter(formData.mobile)}}-->
<!--            </a-typography-paragraph>-->
<!--          </div>-->
<!--          <div class="operation">-->
<!--            <a-link>-->
<!--              {{ $t('userSetting.SecuritySettings.button.update') }}-->
<!--            </a-link>-->
<!--          </div>-->
<!--        </template>-->
<!--      </a-list-item-meta>-->
<!--    </a-list-item>-->
<!--    <a-list-item>-->
<!--      <a-list-item-meta>-->
<!--        <template #avatar>-->
<!--          <a-typography-paragraph>-->
<!--            {{ $t('userSetting.SecuritySettings.form.label.email') }}-->
<!--          </a-typography-paragraph>-->
<!--        </template>-->
<!--        <template #description>-->
<!--          <div class="content">-->
<!--            <a-typography-paragraph :class="{tip:!formData.email}">-->
<!--              <template v-if="formData.email">-->
<!--                {{formData.email}}-->
<!--              </template>-->
<!--              <template v-else>-->
<!--                {{ $t('userSetting.SecuritySettings.placeholder.email') }}-->
<!--              </template>-->
<!--            </a-typography-paragraph>-->
<!--          </div>-->
<!--          <div class="operation">-->
<!--            <a-link>-->
<!--              {{ $t('userSetting.SecuritySettings.button.update') }}-->
<!--            </a-link>-->
<!--          </div>-->
<!--        </template>-->
<!--      </a-list-item-meta>-->
<!--    </a-list-item>-->
  </a-list>
  <!--修改密码-->
  <a-modal v-model:visible="changePassWord"  title="修改密码" @before-ok="handlePassword">
    <a-form :model="formpassword" ref="formRef">
      <a-form-item field="oldPassword" label="原来密码" :rules="rules">
        <a-input-password v-model="formpassword.oldPassword" allow-clear/>
      </a-form-item>
      <a-form-item field="password" label="新密码" :rules="rulesnew">
        <a-input-password v-model="formpassword.password" allow-clear/>
      </a-form-item>
      <a-form-item field="secondPassword" label="确认密码" :rules="rulessecond">
        <a-input-password v-model="formpassword.secondPassword" allow-clear/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import {PropType,ref,watch} from 'vue';
  import { checkPassword,BasicInfoModel,changePassword } from '@/api/user-center';
  import { Message } from '@arco-design/web-vue';
  import {useUserStore} from "@/store";

  const props = defineProps({
     formData: {
      type: Object as PropType<BasicInfoModel>,
      default: false,
    }
 });
 const formData = ref<BasicInfoModel>({
   id: 0,
   nickname: "",
   email:  "",
   mobile:"",
   remark:  "",
   company: "",
   country:"",
   province: "",
   city:  "",
   area:  "",
   address:  "",
   createtime: "",
   phoneNumber:"",
   createdAt:"",
   introduction:"",
  });
 watch(
      () => props.formData,
      () => {
        formData.value=props.formData
      }
    )
  //修改密码
  const formRef = ref()
  const formpassword=ref({
    oldPassword:"",
    password:"",
    secondPassword:"",
  })
  const rules = [{
      validator: (value:any, cb:any) => {
        return new Promise(async(resolve) => {
          if(value == undefined){
            cb('请输入原来密码')
          }
          // else{
          //   const resData = await checkPassword({password:value});
          //   if(!resData){
          //     cb('您输入的原来密码不正确！')
          //   }
          // }
          resolve(null)
        })
      }
    }];
    //新密码
  const rulesnew = [{
      validator: (value:any, cb:any) => {
        return new Promise(resolve => {
          if(value==undefined){
            cb('请输入新密码')
          }else{
            if(value){
              var passwordreg = /(?![A-Z]*$)(?![a-z]*$)(?![0-9]*$)(?![^a-zA-Z0-9]*$)/
              if (!passwordreg.test(value)) {
                cb('密码必须由大写字母、小写字母、数字、特殊符号中的2种及以上类型组成!')
              }
            }
          }
          resolve(null)
        })
      }
    }];
    //确认密码
  const rulessecond = [{
      validator: (value:any, cb:any) => {
        return new Promise(resolve => {
          if(value==undefined){
            cb('请输入确认密码')
          }else{
            if(value!=formpassword.value.password){
              cb('两次密码不一致')
            }
          }
          resolve(null)
        })
      }
    }];

  const userStore = useUserStore();

  const changePassWord=ref(false)
  //提交修改
  const handlePassword=()=>{
    formRef.value.validate(async(res:any)=>{
        console.log("提交修改",res)
      if(res==undefined){
        Message.loading({content:"修改密码中",id:"delaction"})
        try{
          await changePassword({oldPassword:formpassword.value.oldPassword,password:formpassword.value.password});
          Message.success({content:"修改密码成功",id:"delaction"})
          await userStore.logout(true)
        }catch (error) {
          console.log(error)
        }
      }
    })
    return false
  }
   //手机号过滤器
   const phoneFilter=(val:string) =>{
      let reg = /^(.{3}).*(.{4})$/;
      return val.replace(reg, "$1****$2");
    }
</script>

<style scoped lang="less">
  :deep(.arco-list-item) {
    border-bottom: none !important;
    .arco-typography {
      margin-bottom: 20px;
    }
    .arco-list-item-meta-avatar {
      margin-bottom: 1px;
    }
    .arco-list-item-meta {
      padding: 0;
    }
  }
  :deep(.arco-list-item-meta-content) {
    flex: 1;
    border-bottom: 1px solid var(--color-neutral-3);

    .arco-list-item-meta-description {
      display: flex;
      flex-flow: row;
      justify-content: space-between;

      .tip {
        color: rgb(var(--gray-6));
      }
      .operation {
        margin-right: 6px;
      }
    }
  }
</style>
