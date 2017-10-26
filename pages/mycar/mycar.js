// pages/address/user-address/user-address.js
var app = getApp()
Page({
  data: {
    list: [],
    radioindex: '',
    cartId:'',
  },

  onLoad: function (options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    var cartId = options.cartId;
    that.setData({
      cartId: cartId,
    });
  },

  onShow: function () {
    var that = this;
    wx.request({
      url: app.api.hostUrl + '/Api/Carlist/index',
      data: {
        uid:app.api.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      
      success: function (res) {
        // success
        var list = res.data.list;
        if (list == '') {
          var list = [];
        }
        that.setData({
          list: list,
        })
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

  onReady: function () {
    // 页面渲染完成
  },

  setDefault: function(e) {
    var that = this;
    var bid = e.currentTarget.dataset.id;
    wx.request({
      url: app.api.hostUrl + '/Api/Carlist/set_default',
      data: {
        uid:app.api.userId,
        bid: bid
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      
      success: function (res) {
        // success
        var status = res.data.status;
        var cartId = that.data.cartId;
        if(status==1){
          // if (cartId) {
          //   wx.redirectTo({
          //     url: '../../pay/pay?cartId=' + cartId,
          //   });
          //   return false;
          // }

          wx.showToast({
            title: '操作成功！',
            duration: 2000
          });
          setTimeout(function(e){
            that.onShow();
          },2200);
          
        }else{
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
  delAddress: function (e) {
    var that = this;
    var bid = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {
        res.confirm && wx.request({
          url: app.api.hostUrl + '/Api/Carlist/del_car',
          data: {
            user_id: app.api.userId,
            id_arr: bid
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {// 设置请求的 header
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          
          success: function (res) {
            // success
            var status = res.data.status;
            if(status==1){
              that.onShow();
            }else{
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
      }
    });

  },

})