<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
  >
    <a-form-item
      field="email"
      :label="$t('userSetting.basicInfo.form.label.email')"
      :rules="[
        {
          required: true,
          message: $t('userSetting.form.error.email.required'),
        },
      ]"
    >
      <a-input
        v-model="formData.email"
        :placeholder="$t('userSetting.basicInfo.placeholder.email')"
      />
    </a-form-item>
<!--    <a-form-item-->
<!--      field="nickname"-->
<!--      :label="$t('userSetting.basicInfo.form.label.nickname')"-->
<!--      :rules="[-->
<!--        {-->
<!--          required: true,-->
<!--          message: $t('userSetting.form.error.nickname.required'),-->
<!--        },-->
<!--      ]"-->
<!--    >-->
<!--      <a-input-->
<!--        v-model="formData.nickname"-->
<!--        :placeholder="$t('userSetting.basicInfo.placeholder.nickname')"-->
<!--      />-->
<!--    </a-form-item>-->
<!--    <a-form-item-->
<!--      field="area"-->
<!--      :label="$t('userSetting.basicInfo.form.label.area')"-->
<!--    >-->
<!--      <a-cascader-->
<!--        v-model="formData.area"-->
<!--        :placeholder="$t('userSetting.basicInfo.placeholder.area')"-->
<!--        :options="[-->
<!--          {-->
<!--            label: '北京',-->
<!--            value: 'beijing',-->
<!--            children: [-->
<!--              {-->
<!--                label: '北京',-->
<!--                value: 'beijing',-->
<!--                children: [-->
<!--                  {-->
<!--                    label: '朝阳',-->
<!--                    value: 'chaoyang',-->
<!--                  },-->
<!--                ],-->
<!--              },-->
<!--            ],-->
<!--          },-->
<!--        ]"-->
<!--        allow-clear-->
<!--      />-->
<!--    </a-form-item>-->
<!--    <a-form-item-->
<!--      field="address"-->
<!--      :label="$t('userSetting.basicInfo.form.label.address')"-->
<!--    >-->
<!--      <a-input-->
<!--        v-model="formData.address"-->
<!--        :placeholder="$t('userSetting.basicInfo.placeholder.address')"-->
<!--      />-->
<!--    </a-form-item>-->
<!--    <a-form-item-->
<!--      field="introduction"-->
<!--      :label="$t('userSetting.basicInfo.form.label.profile')"-->
<!--      :rules="[-->
<!--        {-->
<!--          maxLength: 200,-->
<!--          message: $t('userSetting.form.error.profile.maxLength'),-->
<!--        },-->
<!--      ]"-->
<!--      row-class="keep-margin"-->
<!--    >-->
<!--      <a-textarea-->
<!--        v-model="formData.introduction"-->
<!--        :placeholder="$t('userSetting.basicInfo.placeholder.profile')"-->
<!--      />-->
<!--    </a-form-item>-->
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="validate">
          {{ $t('userSetting.save') }}
        </a-button>
        <a-button type="secondary" @click="reset">
          {{ $t('userSetting.reset') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import {PropType, ref, watch} from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { saveInfo,BasicInfoModel } from '@/api/user-center';
  import { Message } from '@arco-design/web-vue';

  const props = defineProps({
    formData: {
      type: Object as PropType<BasicInfoModel>,
      default: false,
    },
  });

  const formRef = ref<FormInstance>();

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

  const validate = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      Message.loading({content:"更新中",id:"delaction"})
      try {
        await saveInfo(formData.value)
        Message.success({content:"更新成功",id:"delaction"})
      }catch (error) {
        console.log(error)
      }
    }
  };
  const reset = async () => {
    await formRef.value?.resetFields();
  };
</script>

<style scoped lang="less">
  .form {
    width: 540px;
    margin: 0 auto;
  }
</style>
