// pages/menber/menber.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     VerifyCode: '发送验证码',
     lol: true,
     userInfo: {},
  },
  //提交
  bindFormSubmit: function (e) {
     var that = this;
     //去除两边空格
     var trim = function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
     };
     // 号码验证
     var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
     console.log(e);

     var phone = e.detail.value.cb;
     var phones = e.detail.value.ce;
     if (trim(phone).length == 0) {
        wx.showToast({
           icon: 'phone',
           title: '请输入手机号码'
        })
        return false;
     }
     if (!reg.test(trim(phone))) {
        wx.showToast({
           icon: 'phone',
           title: '请输入正确的手机号码'
        })
        return false;
     }

     wx.request({
        url: app.api.hostUrl + '/Api/User/study',
        method: 'post',
        data: {
           pro_id: playId,
           uid: app.api.userId,
        },
        header: {
           'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
           var status = res.data.status;
           if (status == 1) {
              wx.showToast({
                 title: '提交成功！',
                 duration: 2000
              });
              setTimeout(function (e) {
                 wx.navigateTo({
                    url: '../user/user?objectId=' + playId
                 })
              });
           } else {
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
        },
     })
  },
  //点击发送验证码，获取手机号码，往后台发送数据
  setVerify: function (e) {
     var linkTel = this.data.linkTel;

     var _Url = "申请下发短信的地址";

     var total_micro_second = 60 * 1000;    //表示60秒倒计时，想要变长就把60修改更大
     //验证码倒计时
     count_down(this, total_micro_second);
     this.setData({
        lol: false
     })
     wx.request({
        url: _Url,
        method: 'POST',
        headers: {
           'Content-Type': 'application/json'
        },
        data: [{
           agentLinktel: linkTel
        }],
        success: function (res) {
           if (res.data.code == "00") {
              wx.showModal({
                 title: '提示',
                 content: '发送验证码成功！',
                 showCancel: false
              })
           }
        },
        fail: function (res) {
           console.log("error res=")
           console.log(res.data)
        },

     });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this
     //调用应用实例的方法获取全局数据
     app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
           userInfo: userInfo,
           loadingHidden: true
        })
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




//下面的代码在page({})外面
/* 毫秒级倒计时 */
function count_down(that, total_micro_second) {
   if (total_micro_second <= 0) {
      that.setData({
         VerifyCode: "重新发送",
         lol: true
      });
      // timeout则跳出递归
      return;
   }

   // 渲染倒计时时钟
   that.setData({
      VerifyCode: date_format(total_micro_second) + " 秒"
   });

   setTimeout(function () {
      // 放在最后--
      total_micro_second -= 10;
      count_down(that, total_micro_second);
   }, 10)



}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
   // 秒数
   var second = Math.floor(micro_second / 1000);
   // 小时位
   var hr = Math.floor(second / 3600);
   // 分钟位
   var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
   // 秒位
   var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
   // 毫秒位，保留2位
   var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

   return sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
   return num < 10 ? "0" + num : num
}