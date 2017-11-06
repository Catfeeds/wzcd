//app.js
App({
  api: {
    // hostUrl: 'http://127.0.0.1/miniwzcd/index.php',
    userType: 1,
    userId: 0,
    ppileid: 0,
    sid:'',
    is_chong:0,
    hostUrl: 'https://gzleren.com/miniwzcd/index.php',
    is_shou:''
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    this.getUserInfo();
    if(that.api.is_chong == 1){
      var is_shou = setInterval(function () {
        that.getResult();
      }, 2000);
      that.setData({
        is_shou:is_shou
      });
    }
    
  },
  
  //获取用户信息
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          var code = res.code;
          //get wx user simple info
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo);
              //get user sessionKey
              //get sessionKey
              that.getUserSessionKey(code);
            }
          });
        }
      });
    }
  },

  //获取微信openID
  getUserSessionKey: function (code) {
    //用户的订单状态
    var that = this;
    wx.request({
      url: that.api.hostUrl + '/Api/Login/getsessionkey',
      method: 'post',
      data: {
        code: code
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        if (data.status == 0) {
          wx.showToast({
            title: data.err,
            duration: 2000
          });
          return false;
        }

        that.globalData.userInfo['sessionId'] = data.session_key;
        that.globalData.userInfo['openid'] = data.openid;
        that.onLoginUser();
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:getsessionkeys',
          duration: 2000
        });
      },
    });
  },

  //用户登录
  onLoginUser: function () {
    var that = this;
    var user = that.globalData.userInfo;
    wx.request({
      url: that.api.hostUrl + '/Api/Login/authlogin',
      method: 'post',
      data: {
        SessionId: user.sessionId,
        gender: user.gender,
        NickName: user.nickName,
        HeadUrl: user.avatarUrl,
        openid: user.openid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data.arr;
        var status = res.data.status;
        if (status != 1) {
          wx.showToast({
            title: res.data.err,
            duration: 3000
          });
          return false;
        }
        that.globalData.userInfo['id'] = data.ID;
        that.globalData.userInfo['NickName'] = data.NickName;
        that.globalData.userInfo['HeadUrl'] = data.HeadUrl;
        that.globalData.userInfo['userType'] = data.usertype;
        var userId = data.ID;
        if (!userId) {
          wx.showToast({
            title: '登录失败！',
            duration: 3000
          });
          return false;
        }
        var usertype = data.usertype;
        that.api.userType = usertype;
        that.api.userId = userId;
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:authlogin',
          duration: 2000
        });
      },
    });
  },
  getResult: function () {
    var that = this;
    wx.request({
      url: that.api.hostUrl + '/Api/User/getResult',
      method: 'post',
      data: {
        userId: that.api.userId,
        sid: that.api.sid,
        ppileid: that.api.ppileid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          that.api.is_chong = 0;
          var is_shou = that.data.is_shou;
          clearInterval(is_shou);
          // that.openDoor();
          that.setData({
            amount: res.data.info.amount,
            chong_time: res.data.info.chong_time
          });
          that.makeOrder();

        } else if(status == 2){
          app.api.is_chong = 0;
          var is_shou = that.data.is_shou;
          clearInterval(is_shou);
          
        } else if (status == 15) {
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
  makeOrder: function () {
    var that = this;
    wx.request({
      url: that.api.hostUrl + '/Api/Payment/payment',
      method: 'post',
      data: {
        userId: that.api.userId,
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
      url: that.api.hostUrl + '/Api/User/openDoor2',
      method: 'post',
      data: {
        userId: that.api.userId,
        sid: that.api.sid,
        ppileid: that.api.ppileid,
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
      url: that.api.hostUrl + '/Api/Index/login',
      method: 'post',
      data: {
        uid: that.api.userId,
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

  globalData:{
    userInfo:null
  }
})