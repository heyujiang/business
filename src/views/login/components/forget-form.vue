<template>
    <div class="login-form-wrapper">
      <div class="login-form-title">重置密码</div>
      <!-- <div class="login-form-sub-title">{{ loginSubTitle }}</div> -->
      <div class="login-form-error-msg">{{ errorMessage }}</div>
      <a-form
        ref="loginForm"
        :model="userInfo"
        class="login-form"
        layout="vertical"
        @submit="handleSubmit"
      >
        <a-form-item
          field="email"
          :rules="[{ required: true, message: $t('login.form.email.errMsg') }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input
            v-model="userInfo.email"
            :placeholder="$t('login.form.getpemail.placeholder')"
          >
            <template #prefix>
              邮箱
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="code"
          :rules="[{ required: true, message: $t('login.form.verification.errMsg') }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input
            v-model="userInfo.code"
            :placeholder="$t('login.form.verification.placeholder')"
          >
            <template #prefix>
              验证码
            </template>
            <template #append>
              <a class="vbtn" @click="getVerification()"> {{ codeNum == 60 ? "发送验证码" : `(${codeNum})发送验证码` }}</a>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
            field="password"
            :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
            :validate-trigger="['change', 'blur']"
            hide-label
        >
            <a-input-password
            v-model="userInfo.password"
            :placeholder="$t('login.form.password.placeholder')"
            allow-clear
            >
            <template #prefix>
                <icon-lock />
            </template>
            </a-input-password>
        </a-form-item>
        <a-space :size="16" direction="vertical">
          <div class="login-form-password-actions">
            <span></span>
            <a-link @click="GoToType('login')">去登陆</a-link>
          </div>
          <a-button type="primary" html-type="submit" long :loading="loading">重置密码</a-button>
        </a-space>
      </a-form>
    </div>
  </template>
  
  <script lang="ts" setup>
    import { ref} from 'vue';
    import { useRouter } from 'vue-router';
    import { Message } from '@arco-design/web-vue';
    import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
    import { useI18n } from 'vue-i18n';
    import useLoading from '@/hooks/loading';
    import type { LoginData } from '@/api/user';
    import { resetPassword,getCode} from '@/api/user';
    const emit = defineEmits(['reback'])
  //   defineProps({
  //     loginSubTitle:{   
  //         type:String,  // 数据类型
  //         default:"--"  // 未传值时的默认值
  //     }
  //  })
    const router = useRouter();
    const { t } = useI18n();
    const errorMessage = ref('');
    const { loading, setLoading } = useLoading();
  
    const userInfo = ref({
      email: '', // 邮箱
      code: '', // 验证码
      password: '', // 密码
    });
    //注册账号
    const handleSubmit = async ({
      errors,
      values,
    }: {
      errors: Record<string, ValidatedError> | undefined;
      values: Record<string, any>;
    }) => {
      if (loading.value) return;
      if (!errors) {
        setLoading(true);
        try {
         const resdata= await resetPassword(values as LoginData);
          if(resdata){
            emit('reback',"login")
            Message.success(t('login.form.resetPassword.success'));
          }
        } catch (err) {
          errorMessage.value = (err as Error).message;
        } finally {
          setLoading(false);
        }
      }
    };
    //返回
    const GoToType=(keys:string)=>{
      emit('reback',keys)
    }
    
    // 定时器id
    let clearId=ref();
    // 倒计时时间
    const codeNum = ref(60);
    // 是否发送了验证码 防止连点
    const isClickSend = ref(false)
    const getVerification=async ()=>{
         if(!userInfo.value.email){
            errorMessage.value ="请输入邮箱"
            return
         }
        if (isClickSend.value || codeNum.value != 60) return;
            isClickSend.value = true;
            const res = await getCode({email:userInfo.value.email});
            clearId.value = setInterval(() => {
                codeNum.value--;
                if (codeNum.value == 0) {
                clearInterval(clearId.value);
                codeNum.value = 60;
                isClickSend.value = false;
                }
            }, 1000);
            console.log("sendCode", res);
    }
  </script>
  
  <style lang="less" scoped>
    .login-form {
      &-wrapper {
        width: 320px;
      }
  
      &-title {
        color: var(--color-text-1);
        font-weight: 500;
        font-size: 24px;
        line-height: 32px;
      }
  
      &-sub-title {
        color: var(--color-text-3);
        font-size: 16px;
        line-height: 24px;
      }
  
      &-error-msg {
        height: 32px;
        color: rgb(var(--red-6));
        line-height: 32px;
      }
  
      &-password-actions {
        display: flex;
        justify-content: space-between;
      }
  
      &-register-btn {
        color: var(--color-text-3) !important;
      }
    }
    .vbtn{
        height: 100%;
        display: flex;
        align-items: center;
        padding-top: 2px;
        color: rgb(var(--arcoblue-5));
        cursor: pointer;
        user-select: none;
    }
  </style>
  