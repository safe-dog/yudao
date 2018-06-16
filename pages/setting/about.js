var INFO = wx.getSystemInfoSync();
var TOAST;
var weToast = require('../../libs/weToast/weToast.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    WIDTH: INFO.windowWidth,
    HEIGH: INFO.windowHeight,
    SHOW_CAIDAN: false,
    CAIDAN_ANIMATION: {},
    CAIDAN_TITLE_ANIMATION: {},
    CAIDAN_HEART_ANIMATION: {},
    CAIADN_BODY_ANIMATION: {},
    HEIGHT: INFO.screenHeight,
    STATUS_HEIGHT: INFO.statusBarHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    TOAST = new weToast(this);
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
    return {
      title: '来这里，记日子！',
      path: '/pages/init/loading?from=about'
    }
  },

  goBackHandler: function () {
    wx.navigateBack({});
  },

  /**
   * 彩蛋！
   */
  caidanHandler: function () {
    wx.showModal({
      title: '没有彩蛋',
      content: '这里面，没彩蛋！要不你，取消看？',
      success: ret => {
        if (ret.confirm) return;
        // 彩蛋动画
        var a = wx.createAnimation({
          delay: 200,
          duration: 500,
          timingFunction: 'ease'
        });
        a.opacity(1).step();
        // 心移动动画
        var x = wx.createAnimation({
          delay: 500,
          duration: 200,
          timingFunction: 'ease'
        });
        x.top(INFO.statusBarHeight + 40).opacity(0.5).step();
        x.left(20).opacity(1).step();
        // 标题动画
        var t = wx.createAnimation({
          delay: 1200,
          duration: 200,
          timingFunction: 'ease'
        });
        t.top(INFO.statusBarHeight + 50).opacity(1).step();
        // 主题
        var b = wx.createAnimation({
          delay: 1500,
          duration: 500,
          timingFunction: 'ease'
        });
        b.top(150).opacity(1).step();
        this.setData({
          SHOW_CAIDAN: true,
          CAIDAN_ANIMATION: a.export()
        });

        setTimeout(() => this.setData({
          CAIDAN_TITLE_ANIMATION: t.export(),
          CAIDAN_HEART_ANIMATION: x.export(),
          CAIADN_BODY_ANIMATION: b.export()
        }), 1000);
      }
    })
  },

  /**
   * 复制操作
   */
  copyHandler: function (e) {
    var { copy, msg } = e.currentTarget.dataset;
    wx.setClipboardData({
      data: copy,
      success: () => {
        TOAST.success(msg)
      }
    })
  }
})