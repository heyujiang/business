<template>
  <div class="container" >
    <Breadcrumb :items="[route.matched[0].meta.locale, route.meta.locale]" />
    <a-card class="general-card onelineCard" style="height: calc(100% - 50px);">
      <div class="funcard">
          <!--基本信息-->
          <div class="baseinfo">
            <div class="raw">
              <div class="lf">
                <span>共{{datainfo.allnumber}}个文件</span>
              </div>
              <div class="md">
                <div class="text">
                容量：
                </div>
                <div class="pree">
                  <a-progress
                    :percent="datainfo.fileSize>0?parseFloat((datainfo.usesize/datainfo.fileSize).toFixed(5)):0"
                    size="large"
                    :style="{ width: '100%' }"
                    :color="{
                      '0%': 'rgb(var(--primary-6))',
                      '100%': 'rgb(var(--orange-6))',
                    }"
                  />
                </div>
              </div>
              <div class="rt">
                <span class="all">总量： {{datainfo.fileSize>0?filterSize(datainfo.fileSize):0}}</span>
                <span class="use">已用：{{datainfo.usesize>0?filterSize(datainfo.usesize):0}}</span>
              </div>
            </div>
          </div>
          <div class="listbox">
            <!--表单-->
            <div class="tablebox">
              <div class="header">
                <div class="tool">
                  <div class="check">
                    <a-checkbox v-model:checked="checkedAll" @change="isCheckAll"><span style="user-select: none;">本页全选</span></a-checkbox>
                  </div>
                  <div class="del">
                      <a-button size="small" :disabled="pagedata.selectIds.length==0" @click="delAll">删除</a-button>
                  </div>
                  <div class="updata">
                      <a-button size="small" @click="UpVideo" style="margin-right: 5px;" preIcon="">上传视频</a-button>
                      <a-button size="small" @click="UpImage" style="margin-right: 5px;">上传图片</a-button>
                      <a-button size="small" @click="refreshData">刷新列表</a-button>
                  </div>
                </div>
              </div>
              <div class="filecontext">
                  <div class="filePreview">
                    <a-spin :loading="loading" tip="加载中..."  style=" width: 100%;" >
                    <div class="file_list_box">
                        <div class="file_item" v-for="item in pagedata.picture" >
                          <div   >
                            <div class="imgbox" @click="onSelectImg(item)">
                              <!--图片-->
                              <div class="img_raw">
                                <div class="img_preview" v-if="item.type==0">
                                  <img :src="item.url" class="img_item"/>
                                </div>
                                <div class="img_preview video_preview" v-if="item.type==2">
                                  <img :src="item.cover_url" class="img_item"/>
                                  <Icon class="folder_video" color="#ffffff" :animation="200"  icon="ic:twotone-slow-motion-video" :size="24" ></Icon>
                                </div>
                              </div>
                              <div class="edit_layer "  :class="{l_active:pagedata.selectIds.indexOf(item.id)>-1}" >
                                <i class="colse" @click="onDel(item.id)"></i>
                                <Icon icon="svgfont-mark_sel" class="choose" :size="18" v-if="item.type==0"></Icon>
                              </div>
                            </div>
                            <div class="titlebox">
                              <div class="edit_title">
                                <a-input v-model="item.title" placeholder="输入名称" @change="onChangFile"  style=" padding: 0;"
                                @press-enter="(e)=>{onUpFile(item.id,e)}" @blur="(e)=>{onUpFile(item.id,e)}" :bordered="false"/> 
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="empty" v-if="!loading&&(!pagedata.picture||pagedata.picture.length==0)">
                          <div><Empty description="暂无附件，请上传！"/></div>
                        </div>
                      </div>
                      </a-spin>
                  </div>
              </div>
            </div>
            <!--分页-->
            <div class="pagination" v-if="(pagedata.total>=pagedata.pageSize)">
              <a-pagination :total="pagedata.total" :page-size="pagedata.pageSize" @change="handlePaageChange" @page-size-change="handlePaageSizeChange" show-total show-jumper show-page-size/>
            </div>
          </div>
        </div>
    </a-card>
    <!--附件-->
    <FileManage @register="registerModal" @success="selectImg"/>
  </div>
</template>

<script lang="ts" setup>
  import { ref,  onMounted } from 'vue';
  import useLoading from '@/hooks/loading';
  //api
  import { getList,saveFile,delFile,PictureItem} from '@/api/datacenter/attachment';
  //表单
  import { useModal } from '/@/components/Modal';
  import FileManage from '@/views/datacenter/attachment/components/FileManage.vue';
  import {Icon} from '@/components/Icon';
  import { Message,Modal } from '@arco-design/web-vue';
  import { useRoute } from 'vue-router'
  const route = useRoute();
  const [registerModal, { openModal }] = useModal();
  const boxheight=document.documentElement.clientHeight;//页面高度
  const { loading, setLoading } = useLoading(true);
  const renderData = ref([]);
   //查询字段
   const generateFormModel = () => {
    return {
      title: '',
      name: '',
      createdTime: [],
      status: '',
    };
  };
  const formModel = ref(generateFormModel());
  const fileInfo=ref({
    allnumber:0,
    fileSize:0,
    allsize:0,
  })//总文件
 
  /**88888888888888888888新增8888888888888888888888 */
    const datainfo=ref({
        allnumber:0,
        usesize:0,
        fileSize:0,
    })
    const checkedAll=ref(false)
    const pictureitem: PictureItem[] = [] // 定义整数型数组
    const arrselectid: number[] = [] // 定义字符串数组
    const pagedata=ref({
        checkedAll:false,
        selectIds:arrselectid,//选择的图片id
        picture:pictureitem,//数据
        current:1,
        pageSize:27,
        total:0,
        allnumber:0,
        allsize:0,
        searchword:"",
        fileSize:0,
        loading:false,
      })
       //加载数据
    const fetchData = async () => {
      setLoading(true);
      try {
        const data= await getList({page: pagedata.value.current,pageSize: pagedata.value.pageSize,...formModel.value});
        pagedata.value.picture = data.items;
        pagedata.value.current = data.page;
        pagedata.value.total = data.total;
        datainfo.value = data.datainfo;
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        setLoading(false);
      }
    };
      //组件挂载完成后执行的函数
      onMounted(()=>{
      fetchData();
      })
  
    //是否全选
    const isCheckAll=(value:any)=>{
        if(value){
            pagedata.value.picture.forEach((item)=>{
            pagedata.value.selectIds.push(item.id)
          })
          pagedata.value.checkedAll=true
        }else{
          pagedata.value.selectIds=[]
          pagedata.value.checkedAll=false
        }
    }
      //删除全部
      const delAll=()=>{
        if(pagedata.value.selectIds.length>0){
          doDel(pagedata.value.selectIds)
        }
      }
      //删除单个
      const onDel=(id:any)=>{
        doDel([id])
      }
      //执行删除
      const doDel=(ids:any)=>{
          Modal.warning({
          title: '您确定删除吗？',
          content: '删除后内容将无法恢复请谨慎操作！',
          cancelText:"取消",
          okText:"删除",
          titleAlign:"start",
          hideCancel:false,
          onOk:(async()=>{
              Message.loading({content:"删除中",id:"delFile",duration:0})
              const resultdata = await delFile({ids:ids});
              if(resultdata){
                ids.forEach((id:number)=>{
                  pagedata.value.picture=pagedata.value.picture.filter((item)=>id!=item.id)
                })
                Message.success({content:"删除成功",id:"delFile", duration: 2})
              }else {
                Message.error({content:"删除失败",id:"delFile", duration: 2})
              }
            })
        });
      }
      //是否修改文件名称
      const ischangname=ref(false)
      const onChangFile=()=>{
          ischangname.value=true
        }
      //更新附件名称
        const onUpFile=async(id:number,ev:any)=>{
          const title=ev.target._value
          if(ischangname.value){
            ischangname.value=false
            Message.loading({ content: '更新中...', id:"upFile",duration:0});
            const resultdata = await saveFile({id:id,title:title});
            if(resultdata){
              Message.success({ content: '更新成功！', id:"upFile", duration: 2 });
            }else if(resultdata==0){
              Message.clear()
            } else{
              Message.error({ content: '更新失败', id:"upFile", duration: 2 });
            }
          }
      }
      //选择图片
      const onSelectImg=(item:any)=>{
          if(pagedata.value.selectIds.indexOf(item.id)>-1){
            pagedata.value.selectIds=pagedata.value.selectIds.filter((id)=>id!=item.id)
          }else{
            pagedata.value.selectIds.push(item.id)
          }
          if(pagedata.value.selectIds.length==pagedata.value.picture.length){
            pagedata.value.checkedAll=true
           }else{
            pagedata.value.checkedAll=false
           }
        }
      //上传视频
      const UpVideo=()=>{
        openModal(true, {
          filetype:"video",
          getnumber: "one",
          openfrom: "manage",
        });
      }
      //上传图片
      const UpImage=()=>{
        openModal(true, {
          filetype:"image",
          getnumber: "more",//one 单张
          openfrom: "manage",
        });
      }
      //选择附件返回
      const selectImg=(item:any)=>{
        if(item.type=="more"){
             item.list.forEach((img:any) => {
               console.log("多张附件返回:",img)
             });
          }else if(item.type=="one"){
            console.log("单张附件返回:",item.url)
          }
      }
      //刷新数据
      const refreshData=()=>{
        fetchData();
      }
       //分页
        const handlePaageChange = (page:any) => {
          pagedata.value.current=page
          fetchData();
        }
        //分页总数
        const handlePaageSizeChange = (pageSize:any) => {
          pagedata.value.pageSize=pageSize
          fetchData();
        }
    /**
        * 文件大小 字节转换单位
        * @param size
        * @returns {string|*}
        */
        const filterSize=(size:number) =>{
          if (!size) return '';
          if (size < pow1024(1)) return size + ' B';
          if (size < pow1024(2)) return (size / pow1024(1)).toFixed(2) + ' KB';
          if (size < pow1024(3)) return (size / pow1024(2)).toFixed(2) + ' MB';
          if (size < pow1024(4)) return (size / pow1024(3)).toFixed(2) + ' GB';
          return (size / pow1024(4)).toFixed(2) + ' TB'
      }
      // 求次幂
      function pow1024(num:number) {
          return Math.pow(1024, num)
      }
</script>

<script lang="ts">
  export default {
    name: 'article',
  };
</script>

<style scoped lang="less">
 @import './style/index.less';
  .container {
    padding: 0 20px 20px 20px;
    height: 100%;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
  :deep(.general-card > .arco-card-header){
    padding: 10px 16px;
  }
</style>
