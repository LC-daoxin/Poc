<template>
  <a-upload
    name="file"
    listType="picture-card"
    :multiple="isMultiple"
    :action="uploadAction"
    :headers="headers"
    :data="{biz:bizPath}"
    :fileList="fileList"
    :beforeUpload="beforeUpload"
    :disabled="disabled"
    :isMultiple="isMultiple"
    :showUploadList="isMultiple"
    @change="handleChange"
    @preview="handlePreview">
    <img v-if="!isMultiple && picUrl" :src="getAvatarView()" style="height:104px;max-width:300px"/>
    <div v-else >
      <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
      <div class="ant-upload-text">{{ text }}</div>
    </div>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel()">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
  </a-upload>
</template>

<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import db from '@/utils/localstorage'
  import store from '@/store';
  import commonApi from '@/api/common'

  const uidGenerator=()=>{
    return '-'+parseInt(Math.random()*10000+1,10)
  }
  const getFileName=(path)=>{
    if(path.lastIndexOf('\\')>=0){
      let reg=new RegExp('\\\\','g')
      path = path.replace(reg,'/')
    }
    return path.substring(path.lastIndexOf('/')+1)
  }
  export default {
    name: 'ImageUpload',
    data(){
      return {
        uploadAction: process.env.VUE_APP_API_BASE_URL +':8026/v1/attachment/uploadTitle',
        uploadLoading:false,
        picUrl:false,
        headers:{},
        fileList: [],
        previewImage:'',
        previewVisible: false,
      }
    },
    props:{
      text:{
        type:String,
        required:false,
        default:'上传'
      },
      /*这个属性用于控制文件上传的业务路径*/
      bizPath:{
        type:String,
        required:false,
        default:'temp'
      },
      value:{
        type:[String,Array],
        required:false,
        default:''
      },
      disabled:{
        type:Boolean,
        required:false,
        default: false
      },
      isMultiple:{
        type:Boolean,
        required:false,
        default: false
      }
    },
    watch:{
      value(val){
        if (val instanceof Array) {
          this.initFileList(val.join(','))
        } else {
          this.initFileList(val)
        }
        if(!val || val.length==0){
          this.picUrl = false
        }
      }
    },
    created(){
      let params = {}
      params.tenant = db.get('TENANT', 'default');
      const user = store.state.account.user;
      if (user != undefined) {
        params['x-user-id'] = user['x-user-id'];
        params['x-user-name'] = user['x-user-name'];
        params['x-user-nickname'] = encodeURIComponent(
          user['x-user-nickname']
        );
      }
      const token = db.get('token', '');
      if (token) {
        params['Authorization'] = 'Bearer ' + token;
      }      
      this.headers = params
    },
    methods:{
      initFileList(paths){
        if(!paths || paths.length==0){
          this.fileList = []
          return
        }
        this.picUrl = true
        let fileList = []
        let arr = paths.split(',')
        for(var a=0;a<arr.length;a++){
          let url = commonApi.getFileAccessHttpUrl(arr[a])
          fileList.push({
            uid: uidGenerator(),
            name: getFileName(arr[a]),
            status: 'done',
            url: url,
            response:{
              status:'history',
              message:arr[a]
            }
          })
        }
        this.fileList = fileList
      },
      beforeUpload: function(file){
        var fileType = file.type
        if(fileType.indexOf('image')<0){
          this.$message.warning('请上传图片')
          return false
        }
      },
      handleChange(info) {        
        this.picUrl = false
        let fileList = info.fileList
        if(info.file.status==='done'){
          if(info.file.response.isSuccess){
            this.picUrl = true
            fileList = fileList.map((file) => {
              if (file.response) {
                file.url = file.response.data
              }
              return file
            })
          }          
        }else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 上传失败.`)
        }else if(info.file.status === 'removed'){
          this.handleDelete(info.file)
        }
        this.fileList = fileList
        console.log(fileList)
        if(info.file.status==='done' || info.file.status === 'removed'){
          this.handlePathChange()
        }
      },
      // 预览
      handlePreview (file) {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      },
      getAvatarView(){
        if(this.fileList.length>0){
          let url = this.fileList[0].url
          return commonApi.getFileAccessHttpUrl(url)
        }
      },
      handlePathChange(){
        let uploadFiles = this.fileList
        let path = ''
        if(!uploadFiles || uploadFiles.length==0){
          path = ''
        }
        let arr = []
        if(!this.isMultiple){
          arr.push(uploadFiles[uploadFiles.length-1].response.data)
        }else{
          for(let a=0;a<uploadFiles.length;a++){            
            if(uploadFiles[a].status === 'done' ) {
              arr.push(uploadFiles[a].response.data)
            }else{
              return
            }            
          }
        }
        if(arr.length>0){
          path = arr.join(',')
        }
        this.$emit('change', path)
      },
      handleDelete(file){        
        console.log(file)
      },
      handleCancel() {
        this.close()
        this.previewVisible = false
      },
      close () {

      },
    },
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>

<style scoped>

</style>