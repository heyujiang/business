<template>
  <div class="container">
    <Breadcrumb :items="['menu.user', 'menu.user.setting']" />
    <a-row style="margin-bottom: 16px">
      <a-col :span="24">
        <UserPanel :loading="loading" :formData="formData"/>
      </a-col>
    </a-row>
    <a-row class="wrapper">
      <a-col :span="24">
        <a-tabs default-active-key="1" type="rounded">
          <a-tab-pane key="1" :title="$t('userSetting.tab.basicInformation')">
            <BasicInformation :loading="loading" :formData="formData"/>
          </a-tab-pane>
          <a-tab-pane key="2" :title="$t('userSetting.tab.securitySettings')">
            <SecuritySettings :loading="loading" :formData="formData"/>
          </a-tab-pane>
          <!-- <a-tab-pane key="3" :title="$t('userSetting.tab.certification')">
            <Certification />
          </a-tab-pane> -->
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import UserPanel from './components/user-panel.vue';
  import BasicInformation from './components/basic-information.vue';
  import SecuritySettings from './components/security-settings.vue';
  // import Certification from './components/certification.vue';
  import { getUser ,BasicInfoModel } from '@/api/user-center';
  import useLoading from '@/hooks/loading';
  const formData = ref<BasicInfoModel>({
    id: 0,
    nickname: "",
    email:  "",
    mobile:"",
    remark:  "",
    company: "",
    country:  "",
    province: "",
    city:  "",
    area:  "",
    address:  "",
    createtime: "",
  });
  const { loading, setLoading } = useLoading(true);
  const fetchData = async () => {
    try {
      const resData = await getUser();
      formData.value= resData;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'Setting',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .wrapper {
    padding: 20px 0 0 20px;
    min-height: 580px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }
</style>
