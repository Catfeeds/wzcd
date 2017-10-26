var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    display0:"",
    display1:"",
    display2:"",
    displayId0:"false",
    displayId1:"false",
    displayId2:"false",
    disabled: false,
    ftype: 1,//问题类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '建议反馈',
    })
  },
  type:function(e) {
      var that = this;
      if (e.target.id == 0) {
        if (that.data.display0 == "") {//选上
          that.setData({
            display0: "false",
            displayId0: "",
            display1: "",
            displayId1: "false",
            display2: "",
            displayId2: "false"
          })
        }else {
          that.setData({
            display0: "",
            displayId0: "false"
          })
        }
      } else if (e.target.id == 1) {
          if (that.data.display1 == "") {
            that.setData({
              display0: "",
              displayId0: "false",
              display1: "false",
              displayId1: "",
              display2: "",
              displayId2: "false"
            })
          } else {
            that.setData({
              display1: "",
              displayId1: "false"
            })
        }
      } else if (e.target.id == 2) {
        if (that.data.display2 == "") {
          that.setData({
            display0: "",
            displayId0: "false",
            display1: "",
            displayId1: "false",
            display2: "false",
            displayId2: ""
          })
        } else {
          that.setData({
            display2: "",
            displayId2: "false"
          })
        }
      }
      if (that.data.displayId0 == "") {
        that.setData({
          ftype: 1,
        });
      } else if (that.data.displayId1 == "") {
        that.setData({
          ftype: 2,
        });
      } else if (that.data.displayId2 == "") {
        that.setData({
          ftype: 3,
        });
      }
  },

  /**
   * 保存反馈内容
   */
  save: function (e) {
    var that = this;
    var info = e.detail.value;
    var ftype = that.data.ftype;
    if (!info.con) {
      wx.showToast({
        title: '请补充一下您的问题描述！',
        duration: 2000
      });
      return false;
    }

    wx.request({
      url: app.api.hostUrl + '/Api/User/feedback',
      data: {
        uid: app.api.userId,  //会员ID
        con: info.con,
        ftype: ftype,
        contact: info.contact,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // success
        var status = res.data.status;
        if (status == 1) {
          wx.showToast({
            title: '提交成功！',
            duration: 2000
          });
          that.setData({
            disabled: true
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
    })
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
