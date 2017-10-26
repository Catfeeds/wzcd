//城市选择
var app = getApp();
Page({
  data: {
    brandArr: [],//省级数组
    brandId: [],//省级id数组
    brandIndex: 0,
    mid: 0,
    bid:0,
    code:0,
    cartId:'',
    atype:0,
    ppileid:0
  },

  formSubmit: function (e) {
    var info = e.detail.value;
    var cartId = this.data.cartId;
    var that = this;
    console.log(info);
    wx.request({
      url: app.api.hostUrl + '/Api/Carlist/addcar',
      data: {
        uid:app.api.userId,
        bid: info.bid,
        car_number: info.car_number,
        numb: info.numb,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // success
        var status = res.data.status;
        if(status==1){
          wx.showToast({
            title: '保存成功！',
            duration: 2000
          });
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
        setTimeout(function(e){
          if(that.data.atype == 1){
            wx.redirectTo({
              url: '../applycharge/applycharge?ppileid=' + that.data.ppileid
            });
          }else{
            wx.redirectTo({
              url: 'mycar?cartId=' + cartId
            });
          }
         
        },2000);
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

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    that.setData({
      cartId: options.cartId,
      atype:options.atype,
      ppileid: options.ppileid
    });
  },

  onShow: function () {
    // 生命周期函数--监听页面显示
    var that = this;
    //获取省级城市
    wx.request({
      url: app.api.hostUrl + '/Api/Carlist/get_brand',
      data: {},
      method: 'POST',
      success: function (res) {
        var list = res.data.list;
        var sArr = [];
        var sId = [];
        sArr.push('请选择');
        sId.push('0');
        for (var i = 0; i < list.length; i++) {
          sArr.push(list[i].name);
          sId.push(list[i].id);
        }
        that.setData({
          brandArr: sArr,
          brandId: sId
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },

  // 车型变动
  bindPickerChangeBrand: function (e) {
    this.setData({
      brandIndex:e.detail.value,
    });
  },

})