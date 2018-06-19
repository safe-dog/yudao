var INFO = wx.getSystemInfoSync();
var { API, YUDAO } = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: [],
    LOADING: true,
    STATUS_HEIGHT: INFO.statusBarHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDairy();
    YUDAO.loadMyDairy = () => this.loadDairy();
  },

  /**
   * 加载我的日记
   */
  loadDairy: function () {
    API.getMyDairy().then(result => {
      var datas = [];
      result.map(ret => {
        ret['style'] = this.getRandomColor();
        datas.push(ret);
      });
      setTimeout(() => {
        this.setData({
          datas,
          LOADING: false
        })
      }, 500);
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
  goBackHandler: function () {
    wx.navigateBack({
      
    })
  },
  /**
   * 点击卡片事件
   */
  viewDetailHandler: function (e) {
    var { link } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/detail/index?isMe=yes&link=' + link,
    })
  },

  // 获取随机颜色
  getRandomColor: function () {
    // 随机颜色列表
    var COLORS = [
      ['#B4EC51', '#429321'],
      ['#FAD961', '#F76B1C'],
      ['#F5515F', '#9F041B'],
      ['#C86DD7', '#3023AE'],
      ['#2C82CD', '#1DAF7A'],
      ['#2AF598', '#009EFD'],
      ['#667eea', '#764ba2'],
      ['#30cfd0', '#330867'],
      ['#fee140', '#fa709a'],
      ['#434343', '#000000'],

      ['#BAC8E0', '#6A85B6'],
      ['#F43B47', '#453A94'],
      ['#f78ca0', '#fe9a8b'],
      ['#FFB199', '#FF0844'],
      ['#3CBA92', '#0BA360']
    ];
    var randomNum = parseInt(Math.random() * COLORS.length);
    var color = COLORS[randomNum] || COLORS[0];
    return 'background-image: linear-gradient(135deg, '+color[0]+' 0%, '+color[1]+' 100%);';
  }
})