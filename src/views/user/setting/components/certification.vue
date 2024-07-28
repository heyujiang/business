<template>
  <a-spin :loading="loading" style="width: 100%">
    <EnterpriseCertification :userData="userData" />
    <CertificationRecords :render-data="userData" />
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    getCertification,
  } from '@/api/user-center';
  import useLoading from '@/hooks/loading';
  import EnterpriseCertification from './enterprise-certification.vue';
  import CertificationRecords from './certification-records.vue';

  const { loading, setLoading } = useLoading(true);
  const userData = ref();
  const fetchData = async () => {
    try {
      const resData = await getCertification();
      userData.value= resData;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();
</script>

<style scoped lang="less"></style>
