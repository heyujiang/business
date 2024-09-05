<template>
  <a-card
    class="general-card"
    :title="$t('workplace.accessibility')"
    :header-style="{ paddingBottom: 0 }"
    :body-style="{ paddingTop: 0 }"
    style="height: 166px"
  >
    <template #extra>
      <a-link>{{ $t('workplace.viewMore') }}</a-link>
    </template>
    <a-row>
      <a-col :span="12">
        <a-link>
          <router-link to="user/weekday" class="custom-router-link">
            {{ $t('workplace.accessibility.daily') }}
          </router-link>  
        </a-link>
      </a-col>
      <a-col :span="12">
        <router-link to="user/weekday" class="custom-router-link">
          {{ $t('workplace.accessibility.weekly') }}
          </router-link> 
      </a-col>
      <a-col :span="12">
        <a-link>
          {{ $t('workplace.accessibility.docs') }}
        </a-link>
      </a-col>
      <a-col :span="12">
        <a-link>
          {{ $t('workplace.accessibility.creatuser') }}
        </a-link>
      </a-col>
    </a-row>
  </a-card>
</template>

<style lang="less" scoped>
  .arco-card-body .arco-link {
    margin: 10px 0;
    color: rgb(var(--gray-8));
  }
  .custom-router-link {
    color: inherit;
    text-decoration: none;
  }
</style>
