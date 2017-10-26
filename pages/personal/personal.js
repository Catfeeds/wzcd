var reg = /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
var app = getApp();
Page({
  data:{
    zheng: '',
    fan: '',
    disabled: false,
    userver:false,
    index:1,
    name:'',
    truename:'',
    tel:'',
    idcard:'',
    logo:'../../images/sssss.png',
    audit:10,
    reason: '无',
    ptype:0,
    img1:'',
    img2:'',
  },

  // 身份证正面
  chooseImage: function () {
    var self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var imageSrc = res.tempFilePaths[0];
        wx.uploadFile({
          url: app.api.hostUrl + '/Api/User/uploadimg',
          filePath: imageSrc,
          name: 'img',
          formData: {
            imgs: self.data.zheng
          },
          header: {
            'Content-Type': 'multipart/form-data'
          },
          success: function (res) {
            var statusCode = res.statusCode;
            if (statusCode==200){
              wx.showToast({
                title: '上传成功',
                duration: 2000
              });
              self.setData({
                imageSrc,
                img1: res.data,
              });
            } else {
              wx.showToast({
                title: 'upload_failed !',
                duration: 2000
              })
            }
          },
          fail: function ({errMsg}) {
            wx.showToast({
              title: '上传失败',
              duration: 2000
            })
          }
        })
      },
      fail: function ({errMsg}) {
        wx.showToast({
          title: '图片选择失败',
          duration: 2000
        })
      }
    })
  },

  // 身份证反面
  images: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var imageSrc = res.tempFilePaths[0];
        wx.uploadFile({
          url: app.api.hostUrl + '/Api/User/uploadimg',
          filePath: imageSrc,
          name: 'img',
          formData: {
            imgs: that.data.fan
          },
          header: {
            'Content-Type': 'multipart/form-data'
          },
          success: function (res) {
            var statusCode = res.statusCode;
            if (statusCode == 200) {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                images: imageSrc,
                img2: res.data,
              })
            } else {
              wx.showToast({
                title: 'upload_failed !',
                duration: 2000
              })
            }
          },
          fail: function ({errMsg}) {
            wx.showToast({
              title: '上传失败',
              icon: 'success',
              duration: 2000
            })
          }
        })
      },
      fail: function ({errMsg}) {
        wx.showToast({
          title: '图片选择失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

//姓名 失焦事件
  bindKeyname: function(e) {
    this.setData({
      truename: e.detail.value
    });
  },

//身份证号  失去焦点事件
idcardInputEvent:function(e){
    this.setData({
      idcard: e.detail.value
    })
 },

 //绑定错误图片
binderrorimg:function(e){
  var logo = e.target.dataset.errorimg;
  this.setData({
    logo
  })
},

//手机焦点事件
bindTelInput(e) {
  this.setData({
    tel: e.detail.value,
    userver: reg.test(e.detail.value)
  })
},

//窗体加载事件
onLoad: function (options) {
  var objectId = options.title;
  //更改头部标题
  wx.setNavigationBarTitle({
    title: objectId,
  });
},

//窗体显示事件
onShow: function () {

},

//提交认证
formDataCommit: function (e) {
    var that = this;
    var truename = that.data.truename;
    var tel = that.data.tel;
    var idcard = that.data.idcard;
    var img1 = that.data.img1;
    var img2 = that.data.img2;
    if (!truename){
        wx.showToast({
          title: '请输入您的姓名！',
          duration: 2000
        });
        return false;
    }
    if (!tel) {
      wx.showToast({
        title: '请输入您的手机！',
        duration: 2000
      });
      return false;
    }

    wx.request({
      url: app.api.hostUrl + '/Api/User/user_auth',
      method: 'post',
      data: { 
        uid : app.api.userId,
        truename: truename,
        tel: tel,
        idcard: idcard,
        zheng: img1,
        fan: img2,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            disabled: true
          });
          wx.showToast({
              title: '提交成功，请耐心等待审核！',
              duration: 2000
          });
          setTimeout(function(){
            wx.navigateTo({
              url: '../audit/audit',
            })
          },2100);

        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },

  watch (){
    console.log(1)
  }
})