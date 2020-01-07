<template>
  <div class="useradd">
    <div class="cropper-content">
      <div class="cropper">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixedBox="option.fixedBox"
          @realTime="realTime"
          :fixed-number="fixedNumber"
          :fixed="fixed"
        ></vueCropper>
      </div>
      <div
        class="show-preview"
        :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}"
      >
        <div :style="previews.div" class="preview">
          <img :src="previews.url" :style="previews.img" />
        </div>
      </div>
    </div>

    <div class="footer-btn">
      <div class="scope-btn">
        <el-upload
          class="avatar-uploader"
          action="https://10.0.111.21:3000useradd/"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="uploads"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <!-- <label class="btn" for="uploads">选择图片</label>
        <input
          type="file"
          id="uploads"
          style="position:absolute; clip:rect(0 0 0 0);"
          accept="image/png, image/jpeg, image/gif, image/jpg"
          @change="uploadImg($event, 1)"
        />-->
        <Button type="ghost" @click="rotateLeft">
          <span style="font-weight: 600;">↺</span>
        </Button>
        <Button type="ghost" @click="rotateRight">
          <span style="font-weight: 600;">↻</span>
        </Button>
        <div @click="uploadImg">上传图片</div>
      </div>
    </div>
  </div>
</template>

<script>
//使用图片裁切组件
var imgUrll = require("../assets/img/systemImg/logo.png");
//公用方法
import utils from "@/utils/utils.js";
//接口
import { userApi } from "@/api/apiList";
export default {
  data() {
    return {
      crap: false,
      previews: {},
      option: {
        img:
          "http:img1.vued.vanthink.cn/vued751d13a9cb5376b89cb6719e86f591f3.png", //裁剪图片的地址

        size: 1, //裁剪后质量
        full: false, // 输出原图比例截图 props名full
        outputType: "jpg", //裁剪后生成图片的格式
        canMove: true, //是否能拖动图片
        original: false, //传图片是否显示原始宽高
        canMoveBox: true, //// 能否拖动截图框
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false, //固定选框大小
        centerBox: false //截图框限制在图片里面
      },
      fixedNumber: [1, 1], //限制比例
      fixed: true, //限制比例
      downImg: "#",
      imageUrl: ""
    };
  },
  methods: {
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    realTime(data) {
      this.previews = data;
    },
    uploads(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res.raw);
      this.option.img = URL.createObjectURL(res.raw);
      // this.option.img=this.imageUrl;
    },
    uploadImg() {
      this.$refs.cropper.getCropBlob(data => {
        const fm = new FormData();
        const Iuuid = utils.uuid();
        fm.append("file", data);
        fm.append("name", Iuuid);
        console.log(fm.get("file"));

        userApi.axiosuseradd(fm).then(res => {
          console.log(res);
          if (res.recult == 200) {
            this.$message.success("头像设置成功");
          } else {
            this.$message.error("账户名或密码错误");
          }
        });

        //  headers: {
        //             "Content-Type": "multipart/form-data"
        //           }

        //     //上传图片  使用XMLHttpRequest上传
        //     // var xhr = new XMLHttpRequest();
        //     // //请求成功
        //     // xhr.addEventListener("load", function(resUpload) {}, false);
        //     // //请求失败
        //     // xhr.addEventListener("error", function() {}, false);
        //     // //上传终止
        //     // xhr.addEventListener("abort", function() {}, false);
        //     // //上传进度
        //     // xhr.upload.addEventListener("progress", function() {}, false);
        //     // //请求地址
        //     // xhr.open("POST", "http://10.0.111.21:3000/useradd");
        //     // //发送
        //     // xhr.send(fm);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.cropper-content {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
  .cropper {
    width: 350px;
    height: 300px;
  }
  .show-preview {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
    .preview {
      overflow: hidden;
      border: 1px solid #cccccc;
      background: #cccccc;
      margin-left: 40px;
    }
  }
}
.footer-btn {
  margin-top: 30px;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
  .scope-btn {
    width: 350px;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    -webkit-justify-content: space-between;
  }
  .upload-btn {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
  }
  .btn {
    outline: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    padding: 10px 15px;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
  }
}
.avatar-uploader {
  border: 1px dashed red;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
