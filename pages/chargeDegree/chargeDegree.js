// pages/chargeDegree/chargeDegree.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start:0,
    current:0,
    dianliu:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.api.hostUrl + '/Api/User/getCurrent',
      method: 'post',
      data: {
        userId: app.api.userId,
        ppileid: app.api.ppileid,
        sid: app.api.sid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        console.log(res.data.current)
        if (status == 1) {
          that.setData({
            current: res.data.current,
            start: res.data.start,
            dianliu:res.data.dianliu
          });
          //this.charge();
        } else if(status == 15){
          that.login();
          that.onload();
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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