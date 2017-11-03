// pages/Charge/Charge.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    orderInfo: {},
    paytype:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderId = options.orderId;
    this.setData({
      orderId: orderId,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var orderId = that.data.orderId;
    wx.request({
      url: app.api.hostUrl + '/Api/Order/details',
      method: 'post',
      data: {
        userid:app.api.userId,
        order_id:orderId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        var status = res.data.status;
        if (status == 1) {
          var info = res.data.info;
          that.setData({
            orderInfo: info,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

  //支付方式
  radioChange: function (e) {
    var paytype = e.detail.value;
    this.setData({
      paytype: paytype,
    });
  },

  //立即支付
  payorder2: function (e) {
    var that = this;
    var order_sn = e.currentTarget.dataset.ordersn;
    // var paytype = that.data.paytype;
    // if(!paytype) {
    //   wx.showToast({
    //     title: "请选择支付方式!",
    //     duration: 2000,
    //   });
    //   return false;
    // }
    wx.request({
      url: app.api.hostUrl + '/Api/Pay/pay_now',
      data: {
        // paytype: paytype,
        order_sn: that.data.orderInfo.order_sn,
        order_id: that.data.orderInfo.id,
        uid: app.api.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
          if (paytype=='amount') {
            wx.showToast({
              title: "支付成功!",
              duration: 2000,
            });
            setTimeout(function () {
              wx.navigateBack();
            }, 2200);
            return false;
          }
          var order = res.data.arr;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateBack();
              }, 2200);
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                duration: 2000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function (e) {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
  //立即支付
  payorder: function (e) {
    var that = this;
    var order_sn = e.currentTarget.dataset.ordersn;
    wx.request({
      url: app.api.hostUrl + '/Api/Payment/pay_now2',
      data: {
        // paytype: paytype,
        order_sn: that.data.orderInfo.order_sn,
        order_id: that.data.orderInfo.id,
        uid: app.api.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
            wx.showToast({
              title: "支付成功!",
              duration: 2000,
            });
            setTimeout(function () {
              wx.navigateBack();
            }, 2200);           
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function (e) {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})