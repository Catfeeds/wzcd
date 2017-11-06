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
    userinfo:[],
    car:[],
    index:0,
    time:'',
    ctype:0,
    amount:0,
    ppileid:0,
    chong_time:'',
    is_shou: '',
    degree:false
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
  console.log(app.api.userId)
  var objectId = options.title;
  var ppileid = options.ppileid;
  app.api.ppileid = ppileid;
  if(app.api.is_chong == 1){
    this.setData({
      degree:true
    });
  }
  //判断是否有未完成的订单
  wx.request({
    url: app.api.hostUrl + '/Api/Index/index',
    method: 'post',
    data: {
      uid: app.api.userId,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log(res);
      var is_order = res.data.is_order;
      var order_id = res.data.order_id;
      if (is_order > 0) {
        wx.showModal({
          title: '提示',
          content: '您还有一个订单未支付，是否进入完成支付？',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../Charge/Charge?orderId=' + order_id,
              })
            }
          },
        })
      }
    },
    fail: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    },
  });
  
},

//窗体显示事件
onShow: function () {
  var that = this;
  wx.request({
    url: app.api.hostUrl + '/Api/User/getMessage',
    method: 'post',
    data: {
      userId: app.api.userId,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var status = res.data.status;
      console.log(res.data.car)
      if (status == 1) {
        that.setData({
          userinfo:res.data.infouser,
          car:res.data.car
        });
        //this.charge();
      } else {
        wx.showToast({
          title: res.data.err,
          duration: 2000
        });
      }
    },
    fail: function (e) {
      wx.showToast({
        title: '网络异常！err:bindTaps',
        duration: 2000
      });
    },
  });
},
  bindChangeCourse:function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      ctype: e.detail.value
    });
  },
  getAmount: function (e) {
    this.setData({
      amount:e.detail.value
    });
  },
  send_chong: function (e) {
    console.log(this.data.amount)
    var that = this;
    var car_index = that.data.index;

    wx.request({
      url: app.api.hostUrl + '/Api/User/send_chong',
      method: 'post',
      data: {
        userId: app.api.userId,
        car_number: that.data.car[car_index],
        time:that.data.time,
        ctype:that.data.ctype,
        amount:that.data.amount,
        ppileid: app.api.ppileid,
        sid:app.api.sid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        console.log(res.data.car)
        if (status == 1) {
          app.api.is_chong = 1;
          that.setData({
            degree:true
          });
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
          var is_shou = setInterval(function () {
            that.getResult();
          }, 15000);
          that.setData({
            is_shou:is_shou
          });
        } else if(status == 3) {
          var order_id = res.data.order_id;
          wx.showModal({
            title: '提示',
            content: '您还有一个订单未支付，是否进入完成支付？',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../Charge/Charge?orderId=' + order_id,
                })
              }
            },
          })
        }else {
          console.log(res.data.err)
          that.login();
          // that.send_chong();
          // wx.showToast({
          //   title: res.data.err,
          //   duration: 2000
          // });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
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

  getResult:function (){
    var that = this;
    wx.request({
      url: app.api.hostUrl + '/Api/User/getResult',
      method: 'post',
      data: {
        userId: app.api.userId,
        sid:app.api.sid,
        ppileid:app.api.ppileid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {

          app.api.is_chong = 0;
          var is_shou = that.data.is_shou;
          clearInterval(is_shou);
          // that.openDoor();
          console.log(res.data.info.amount);
          console.log(res.data.info.chong_time);
          that.setData({
            amount: res.data.info.amount,
            chong_time:res.data.info.chong_time,
            degree:false
          });
        that.makeOrder();

        } else if(status == 2){
          var is_shou = that.data.is_shou;
          clearInterval(is_shou);
          app.api.is_chong = 0;
          that.setData({
            degree:false
          });
        }else if(status == 15){
          that.login();
        }
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
  makeOrder:function(){
    var that = this;
    wx.request({
      url: app.api.hostUrl + '/Api/Payment/payment',
      method: 'post',
      data: {
        userId: app.api.userId,
        amount: that.data.amount,
        chong_time:that.data.chong_time
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        var arr = res.data.arr;
        var order_id = arr.order_id;
        if (status == 1) {
          
          wx.showModal({
            title: '充电完成，请去支付！',
            success: function (res) {
              if (res.confirm) {
               wx.navigateTo({
                 url: '../Charge/Charge?orderId=' + order_id,
               })
              }
            }
          });
          return false;
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
          return false;
        }
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
        return false;
      }
    })
  },
  openDoor: function () {
    var that = this;
    wx.request({
      url: app.api.hostUrl + '/Api/User/openDoor2',
      method: 'post',
      data: {
        userId: app.api.userId,
        sid: app.api.sid,
        ppileid: app.api.ppileid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {

          return false;
        } else {
          return false;
        }

      },

    })
  },
  login: function () {
    var that = this;
    wx.request({
      url: app.api.hostUrl + '/Api/Index/login',
      method: 'post',
      data: {
        uid: app.api.userId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          console.log(res);
          var data = res.data.data;
          if (data[0] == 'ERROR') {
            wx.showToast({
              title: '错误提示',
              content: data[2],

            });
            return false;
          } else {
            app.api.sid = data[2];
          }
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:bindTaps',
          duration: 2000
        });
      },
    });
  },
  
})