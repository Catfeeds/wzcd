// pages/chargeMoney/chargeMoney.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  //充值金额 输入事件
  bindMoneyInput: function (e) {
    this.setData({
      money: e.detail.value,
    });
  },

  //立即充值
  chargenow: function () {
    var that = this;
    var money = that.data.money;
    wx.showModal({
      title: '提示',
      content: '您输入的金额：' + money+'，是否确认充值？',
      success: function (res) {
        if (res.confirm) {
          that.wxpay();
        }
      }
    });
  },

  //调起微信支付
  wxpay: function () {
    var that = this;
    wx.request({
      url: app.api.hostUrl + '/Api/Wxpay/chargemoney',
      data: {
        utype: 3,
        uid: app.api.userId,
        money: that.data.money,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        wx.hideToast();
        if (res.data.status == 1) {
          var order = res.data.arr;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "充值成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateBack();
              }, 2300);
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                duration: 3000
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
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！err:wxpay',
          duration: 2000
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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