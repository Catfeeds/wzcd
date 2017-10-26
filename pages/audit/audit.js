// pages/audit/audit.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userauth:1,
    reason:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userauth = options.userauth;
    this.setData({
      userauth : userauth,
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
    //获取用户订单数据
    var that = this;
    wx.request({
      url: app.api.hostUrl + '/Api/User/getuserauth',
      method: 'post',
      data: {
        userId: app.api.userId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var status = res.data.status;
        if (status == 1) {
          var userauth = res.data.userauth;
          var reason = res.data.reason;
          that.setData({
            userauth: userauth,
            reason: reason,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

  //下一步  点击事件
  paymoney: function (e) {
    wx.navigateTo({
      url: '../payment/payment',
    });
  },

  //重新提交资料
  resubmit: function (e) {
    wx.navigateTo({
      url: '../personal/personal',
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