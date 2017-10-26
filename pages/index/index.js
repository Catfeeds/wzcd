//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
     showModalStatus: false,  //先设置隐藏
     imgUrls: ["../../images/1.png", "../../images/3.png", "../../images/4.png", ],
     indicatorDots: true,
     autoplay: true,
     interval: 4000,
     duration: 1000,
     circular: true,
     retData:[],
     showModal: false,
     xlh:0,
     pwd:'',
     cplid:'',
     ppileid:0,
     is_qing:1
  },

  
  powerDrawer: function (e) {
    this.bindTaps();
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu);
  },
  util: function (currentStatu) {
     /* 动画部分 */
     // 第1步：创建动画实例 
     var animation = wx.createAnimation({
        duration: 200, //动画时长 
        timingFunction: "linear", //线性 
        delay: 0 //0则不延迟 
     });

     // 第2步：这个动画实例赋给当前的动画实例 
     this.animation = animation;

     // 第3步：执行第一组动画 
     animation.opacity(0).rotateX(-100).step();

     // 第4步：导出动画对象赋给数据对象储存 
     this.setData({
        animationData: animation.export()
     })

     // 第5步：设置定时器到指定时候后，执行第二组动画 
     setTimeout(function () {
        // 执行第二组动画 
        animation.opacity(1).rotateX(0).step();
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
        this.setData({
           animationData: animation
        })

        //关闭 
        if (currentStatu == "close") {
           this.setData(
              {
                 showModalStatus: false
              }
           );
        }
     }.bind(this), 200)

     // 显示 
     if (currentStatu == "open") {
        this.setData(
           {
              showModalStatus: true
           }
        );
     }
  },
  //扫码事件处理函数
  bindViewTaps: function(e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu);
    //  wx.scanCode({
    //     onlyFromCamera:false,
    //     success: (res) => {
    //        console.log(res);
    //        wx.showToast({
    //          title: res,
    //          icon: 'loading',
    //        });
    //     },
    //  })
  },

  /**
     * 弹窗
     */
  showDialogBtn: function () {
    // this.setData({
    //   showModal: true
    // });
    var is_qing = this.data.is_qing;
    if(is_qing == 1){
      wx.navigateTo({
        url: '../applycharge/applycharge?ppileid=' + this.data.ppileid,
      })
    }else{
      wx.showToast({
        title: '此桩正在充电，请换另一个桩！',
      })
      return false;
    }
    
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
    
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
    var xlh = this.data.xlh;
    var pwd = this.data.pwd;
    if (!xlh) {
      wx.showToast({
        title: '请输入序列号！',
        duration: 2000
      });
      return false;
    }
    if (!pwd) {
      wx.showToast({
        title: '请输入密码！',
        duration: 2000
      });
      return false;
    }
    wx.showToast({
      title: '正在请求...',
      icon: 'loading',
    });
    wx.request({
      url: app.api.hostUrl + '/Api/Index/login',
      method: 'post',
      data: {
        uid: app.api.userId,
        xlh: xlh,
        pwd: pwd,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status==1) {
          console.log(res);
          var data = res.data.data;
          if(data[0]=='ERROR'){
            wx.showModal({
              title: '错误提示',
              content: data[2],
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            });
            wx.hideToast();
            return false;
          }
          wx.hideToast();
          wx.showToast({
            title: '正在发起充电请求...',
            icon: 'loading',
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

  /**
   *  建议反馈 点击事件
   */
  suggest: function (e) {
    wx.navigateTo({
      url: '../suggest/suggest',
    })
  },

  /**
   *  个人中心 点击事件
   */
  member: function (e) {
    wx.navigateTo({
      url: '../personalcenter/personalcenter',
    })
  },

  /**
   *  序列号 输入事件
   */
  inputChange: function (e) {
    this.setData({
      xlh: e.detail.value,
    });
  },

  /**
   *  密码 输入事件
   */
  inputpwdChange: function (e) {
    this.setData({
      pwd: e.detail.value,
    });
  },

  charge: function (e) {
    var that = this;
    wx.request({
      url: app.api.hostUrl + '/Api/Index/charge_pilesss',
      method: 'post',
      data: {
        uid: 1,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
         console.log(res);
         that.setData({
           retData: res.data,
         });
        wx.hideToast();
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:bindTaps',
          duration: 2000
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var ppileid = options.ppileid;
    app.api.ppileid = ppileid;
    that.setData({
      ppileid: ppileid,
    });
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
        if(is_order>0) {
          wx.showModal({
            title: '提示',
            content: '您还有一个订单未支付，是否进入完成支付？',
            success: function(res) {
              if(res.confirm) {
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
    that.scan();
  },

  onShow:function () {
    var that = this;
    wx.request({
      url: app.api.hostUrl + '/Api/Index/login',
      method: 'post',
      data: {
        uid: app.api.userId,
        // xlh: xlh,
        // pwd: pwd,
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
          }else{
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
    if(app.api.is_chong == 1){
      setInterval(function () {
        that.login();
        that.getResult();
      }, 2000);
    }
    
   
  },
  login:function (){
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
  scan:function () {
    var that = this;
    wx.request({
      url: app.api.hostUrl + '/Api/User/scan',
      method: 'post',
      data: {
        userId: app.api.userId,
        sid: app.api.sid,
        ppileid: app.api.ppileid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
        

        } else if(status == 2){
          wx.setData({
            is_qing:0
          });
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  getResult: function () {
    var that = this;
    wx.request({
      url: app.api.hostUrl + '/Api/User/getResult',
      method: 'post',
      data: {
        userId: app.api.userId,
        sid: app.api.sid,
        ppileid: app.api.ppileid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          app.api.is_chong = 0;
          that.opanDoor();
          that.setData({
            amount: res.data.info.amount,
            chong_time: res.data.info.chong_time
          });
          that.makeOrder();

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
      }
    })
  },
  makeOrder: function () {
    var that = this;
    wx.request({
      url: app.api.hostUrl + '/Api/Payment/payment',
      method: 'post',
      data: {
        userId: app.api.userId,
        amount: that.data.amount,
        chong_time: that.data.chong_time
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          wx.showModal({
            title: '充电完成，请去支付！',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../Charge/Charge',
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
  openDoor:function () {
    var that = this;
    wx.request({
      url: app.api.hostUrl + '/Api/User/openDoor2',
      method: 'post',
      data: {
        userId: app.api.userId,
        sid: app.api.sid,
        ppileid:app.api.ppileid,
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

  // onShareAppMessage: function () {
  //   return {
  //     title: '万众充电',
  //     path: '/pages/index/index',
  //     success: function (res) {
       
  //     },
  //     fail: function (res) {
        
  //     }
  //   }
  // }
})
