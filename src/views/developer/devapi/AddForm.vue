<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :loading="loading" helpMessage="编辑和修改接口" width="1050px" :minHeight="480" :title="getTitle" @ok="handleSubmit">
    <a-form ref="formRef" :model="formData" auto-label-width>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="title" label="接口名称" validate-trigger="input" :rules="[{required:true,message:'请填写接口名称'}]">
            <a-input v-model="formData.title" placeholder="请填接口名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="url" label="接口路径" :rules="[{required:true,message:'请填写接接口路径'}]" >
            <a-input v-if="formData.url||formData.apicode_type==2" v-model="formData.url" placeholder="请填接口路径" :disabled="formData.apicode_type==2?true:false" allow-clear />
            <a-select v-else v-model="formData.url" placeholder="请填接口路径" allow-search allow-clear allow-create>
                <a-option v-for="item in routerlist" :value="item">{{ item }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="dept_id" label="选择分组" style="margin-bottom:15px;">
            <a-tree-select placeholder="选择分组" :data="groupList" 
            :fieldNames="{
                key: 'id',
                title: 'name',
                children: 'children'
              }"  v-model="formData.cid">
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <div class="flexbox">
            <div class="left">
              <a-form-item field="status" label="状态" :label-col-style="{flex:' 0 0 57px'}" style="margin-bottom:15px;">
                  <a-radio-group v-model="formData.status">
                    <a-radio :value="0" style="margin-right:2px">启用</a-radio>
                    <a-radio :value="1" style="margin-right:2px">禁用</a-radio>
                  </a-radio-group>
                </a-form-item>
            </div>
            <div class="right">
              <a-form-item field="istoken" label="Token" :label-col-style="{flex:' 0 0 57px'}"  style="margin-bottom:15px;">
                <a-radio-group v-model="formData.istoken">
                  <a-radio :value="0" style="margin-right:2px">不需</a-radio>
                  <a-radio :value="1" style="margin-right:2px">需要</a-radio>
                </a-radio-group>
              </a-form-item>
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <a-form-item field="tablename" label="数据表名" style="margin-bottom:15px;">
            <a-select v-model="formData.tablename" placeholder="请填数据表名(选填)" allow-search multiple allow-clear>
              <template #label="{ data }">
                  <span>{{data?.value}}</span>
                </template>
                <a-option v-for="item in tablelist" :value="item.name">{{ item.name+" "+item.title }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="method" label="请求方式" style="margin-bottom:15px;">
            <a-radio-group v-model="formData.method"  @change="handelMethodType">
              <a-radio value="get">get</a-radio>
              <a-radio value="post">post</a-radio>
              <a-radio value="delete">delete</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="param" label="参数" style="margin-bottom:15px;">
            <a-textarea v-model="formData.param" placeholder="请填参数(选填)" :auto-size="{ minRows:5, maxRows:6 }"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="remark" label="备注" style="margin-bottom:15px;">
            <a-textarea v-model="formData.des" placeholder="请填备注" :auto-size="{ minRows:5, maxRows:6 }"/>
          </a-form-item>
        </a-col>
        <a-col :span="14">
          <a-form-item field="apicode_type" label="接口代码类型" style="margin-bottom:5px;">
            <a-radio-group v-model="formData.apicode_type" @change="handelApicodeType">
              <a-radio :value="0">手写代码</a-radio>
              <a-radio :value="1">自动生成</a-radio>
              <a-radio :value="2">通用数据接口</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <template v-if="formData.apicode_type==1||formData.apicode_type==2">
        <a-col :span="10" v-if="formData.method=='get'">
          <a-form-item field="getdata_type" label="获取数据类型" style="margin-bottom:5px;">
            <a-radio-group v-model="formData.getdata_type"  @change="handelGetdataType">
              <a-radio value="list">数据列表</a-radio>
              <a-radio value="detail">单条数据</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
          <a-col :span="12" v-if="formData.apicode_type==1">
            <a-form-item  label="" style="margin-bottom:15px;">
                <div class="btnrow" :class="{uphandel:formData.id==0}">
                    <a-button @click="handleInstall" html-type="submit" size="large" type="primary" shape="round" style="width: 150px;">{{formData.is_install!=0?"重新生成":"开始生成"}}</a-button>
                    <a-button v-if="formData.is_install==1" @click="handleUninstall" size="large"  shape="round" style="width: 150px;">卸载代码</a-button>
                    <a-button v-if="formData.is_install==2" @click="handleRemoveFile" size="large"  shape="round" style="width: 150px;">删除文件</a-button>
                    <div class="notig" v-if="formData.id==0">
                      <div class="text">请先保存数据后再生成代码</div>
                    </div>
                  </div>
              </a-form-item>
          </a-col>
          <a-col :span="12" v-if="formData.method=='get'">
            <a-form-item field="fields" label="查询列表字段" >
              <a-select v-model="formData.fields" @popup-visible-change="handelSelectFields" placeholder="选择查询列表字段" multiple :max-tag-count="12" allow-clear >
                  <a-option v-for="item in fieldList" :value="item.value">{{item.label}}</a-option>
                </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="formData.apicode_type==1&&formData.method=='get'&&formData.id!=0">
            <div class="tigmsg"><icon-exclamation-circle class="iconsd"/>如果有修改内容请先保存在生成代码 否则参数不是最新的</div>
          </a-col>
          <a-col :span="24" v-if="formData.apicode_type==2">
            <div class="tigmsg"><icon-exclamation-circle />“通用数据接口”无需编写代码 直接调用通用api接口即可完成增删查改（传apiID区分）</div>
          </a-col>
        </template>
      </a-row>
    </a-form>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { cloneDeep } from 'lodash-es';
  //api
  import { getGroup,save,DataItem,getTables,TableItem,getRoutes} from '@/api/developer/devapi';
  import {installcode,uninstallcode,removeFile} from '@/api/developer/apicode';
  import { getdbfield,TreeItem}  from '@/api/developer/generatecode';
  import { IconPicker ,Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  export default defineComponent({
    name: 'AddBook',
    components: { BasicModal,IconPicker,Icon },
    emits: ['success'],
    setup(_, { emit }) {
      const isUpdate = ref(false);
      const fieldList = ref<TreeItem[]>([]);
      const groupList = ref<DataItem[]>([]);
      const tablelist = ref<TableItem[]>([]);
      const routerlist = ref<string[]>([]);
      //表单
      const formRef = ref<FormInstance>();
      //表单字段
      const basedata={
            id:0,
            type: 'biz',
            cid: 0,
            status: 0,
            istoken: 0,
            title: "",
            des: "",
            url:"",
            param:"",//参数
            method:"get",//方法
            tablename:[],//数据表名
            apicode_type:0,//接口代码类型
            is_install:0,//是否已经生成代码
            fields:[],//查询字段
            getdata_type:"list",//获取数据类型list=多条，detail=单条
        }
      const formData = ref(basedata)
      const mid_url=ref("")
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
          formRef.value?.resetFields()
          setModalProps({ confirmLoading: false });
          const deptdata = await getGroup();
          const parntList_df : any=[{id: 0,name: "未选分组",pid: 0}];
          if(deptdata){
            groupList.value=parntList_df.concat(deptdata)
          }else{
            groupList.value=parntList_df
          }
          //获取数据表
          tablelist.value = await getTables({});
          routerlist.value= await getRoutes({});
          isUpdate.value = !!data?.isUpdate;
          if (unref(isUpdate)) {
            formData.value=cloneDeep(data.record)
            if(formData.value.fields){
              formData.value.fields=formData.value.fields.split(",")
            }
            if(formData.value.tablename){
              formData.value.tablename=formData.value.tablename.split(",")
            }
            if(formData.value.method=="get"){
                 //最好加载一下数据表字段
                setTimeout(async()=>{
                  fieldList.value = await getdbfield({tablename:data.record.tablename});
                },1000)
            }
            mid_url.value=data.record.url
          }else{
            formData.value=cloneDeep(basedata)
            fieldList.value=[]
          }
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增管理接口' : '编辑管理接口'));
     //提交数据保存
     const { loading, setLoading } = useLoading();
     const handleSubmit = async () => {
      try {
          const res = await formRef.value?.validate();
          if (!res) {
            setLoading(true);
            Message.loading({content:"保存中",id:"upStatus"})
            let savedata=cloneDeep(unref(formData))
            let fields_str="";
            if(savedata.fields){
              savedata.fields.forEach((item)=>{
                    if(item){
                      if(fields_str==""){
                        fields_str+=item
                      }else{
                        fields_str+=","+item
                      }
                    }
              })
            }
            savedata.fields=fields_str
            //数据库
            let tablename_str="";
            if(savedata.tablename){
              savedata.tablename.forEach((item)=>{
                    if(item){
                      if(tablename_str==""){
                        tablename_str+=item
                      }else{
                        tablename_str+=","+item
                      }
                    }
              })
            }
            savedata.tablename= tablename_str;
            await save(unref(savedata));
            Message.success({content:"保存成功",id:"upStatus"})
            closeModal()
            emit('success');
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          Message.clear("top")
        }
      };
      //生成接口代码
     const handleInstall=async()=>{
         try {
            Message.loading({content:"生成接口代码中",id:"upStatus",duration:0})
            const res= await installcode({id:formData.value.id});
            if(res){
              formData.value.is_install=1
              emit('success');
              Message.success({content:"生成接口代码成功",id:"upStatus",duration:1000})
            }
          }catch (error) {
             Message.clear("top")
          }
     }
      //卸载接口代码
     const handleUninstall=async()=>{
         try {
            Message.loading({content:"卸载中",id:"upStatus",duration:0})
            const res= await uninstallcode({id:formData.value.id});
            if(res){
              emit('success');
              formData.value.is_install=2
              Message.success({content:"卸载成功",id:"upStatus",duration:1000})
            }
          }catch (error) {
             Message.clear("top")
          }
     }
     //删除文件
     const handleRemoveFile=async()=>{
         try {
            Message.loading({content:"删除文件中",id:"upStatus",duration:0})
            const res= await removeFile({id:formData.value.id});
            if(res){
              formData.value.is_install=0
              Message.success({content:"删除文件功",id:"upStatus",duration:1000})
            }
          }catch (error) {
             Message.clear("top")
          }
     }
     //请求方式变化
     const handelMethodType=()=>{
      if(formData.value.apicode_type!=0){
        handelApicodeType()
      }
     }
     //切换接口类型
     const handelApicodeType=()=>{
       if(formData.value.apicode_type==2&&mid_url.value==""){
          mid_url.value=cloneDeep(formData.value.url)
        }
        handelGetdataType()
     }
     //切换获取数据类型
     const handelGetdataType=()=>{
        if(formData.value.apicode_type==2){
          formData.value.url=`/common/api/`+getMethod()
        }else  if(formData.value.apicode_type==1){
          if(formData.value.tablename){
            const tb_arr=formData.value.tablename.split("_")
            if(tb_arr.length>=3){
              formData.value.url=`/${tb_arr[1]}/${tb_arr[2]}/`+getMethod()
            }else if(tb_arr.length==2){
              formData.value.url=`/${tb_arr[0]}/${tb_arr[1]}/`+getMethod()
            }
          }
        }else{
          formData.value.url=mid_url.value?mid_url.value: formData.value.url
        }
     }
     //获取请求方法
     const getMethod=()=>{
        let mstr=""
        if(formData.value.method=='get'){
          if(formData.value.getdata_type=="list"){
            mstr="get_list"
          }else if(formData.value.getdata_type=="detail"){
            mstr="get_detail"
          }
        }else if(formData.value.method=='post'){
           mstr="save"
        }else if(formData.value.method=='delete'){
           mstr="del"
        }
        return mstr
     }
     //选择字段下拉改变时候出发
     const handelSelectFields=async(visible:boolean)=>{
      if(visible&&(!fieldList.value||fieldList.value.length==0)){
        if(!formData.value.tablename){
          Message.error({content:"请你先填写数据库名称再选择数据字段",id:"upStatus"})
          return
        }
        fieldList.value = await getdbfield({tablename:formData.value.tablename});
      }
     }
     //表单返回
     const tablefallback = (value:string) => {
      console.log(value)
      return {
        value,
        label: `++${value}++`
      }
    };
      return { 
        registerModal, 
        getTitle, 
        handleSubmit,
        formRef,
        loading,
        formData,
        groupList,
        handleInstall,handleUninstall,
        //生成代码
        fieldList,handelApicodeType,handelGetdataType,handelSelectFields,
        handelMethodType,
        handleRemoveFile,
        tablelist,tablefallback,routerlist,
      };
    },
  });
</script>
<style lang="less" scoped>
.flexbox{
  display: flex;
  .left ,.right{
    flex: 1;
  }
}
//生成代码按钮
.btnrow{
  width: 100%;
  height: 100%;
  padding: 5px;
  display: flex;
  justify-content: center;
}
.uphandel{
  cursor: not-allowed;
  position: relative;
  .notig{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 99;
      background: #ccc;
      filter: alpha(opacity=50);
      opacity: .9;
      display: flex;
      align-items: center;
      justify-content: center;
      .text{
       color: rgb(var(--red-6));
       font-size: 14px;
      }
  }
}
.tigmsg{
  font-size: 14px;
  color: var(--color-neutral-6);
  .iconsd{
    padding-right: 5px;
  }
}
</style>
