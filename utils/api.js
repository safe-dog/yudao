class API {
  constructor () {
    this.TOKEN = wx.getStorageSync('USER_TOKEN');
    this.COOKIE = wx.getStorageSync('USER_COOKIE');

    this.USER_NAME = '';
    this.AVATAR_URL = '';
    this.HOME_PAGE = '';

    // 签到凭证
    this.CHECKIN_TOKEN = '';
  }

  /**
   * 登录操作
   */
  login (usr, pwd) {
    return new Promise((RES, REJ) => {
      wx.request({
        url: 'https://www.ityudao.com/login',
        data: {
          "nameOrEmail": usr,
          "userPassword": pwd,
          "rememberLogin": true,
          "captcha": ""
        },
        method: 'POST',
        success: ret => {
          if (!ret.data.sc) return REJ(ret.data.msg);
          // 设置cookie
          this.TOKEN = ret.data.token;
          this.COOKIE = ret.header['Set-Cookie'];
          var _cookie = ret.header['Set-Cookie'];
          this.COOKIE = _cookie.split(';')[0];
          this.COOKIE += ';ityudao=';
          this.COOKIE += this.TOKEN;
          this.COOKIE += ';ityudao_domain=40e0578dda3332e4fb79c8bcc16d0c75;';
          // 写入缓存
          wx.setStorageSync('USER_TOKEN', this.TOKEN);
          wx.setStorageSync('USER_COOKIE', this.COOKIE);
          // 获取用户信息
          this.getUserInfo().then(RES).catch(REJ);
        },
        fail: REJ
      })
    })
  }

  /**
   * 获取用户信息
   */
  getUserInfo () {
    return new Promise((RES, REJ) => {
      if (!this.TOKEN || !this.COOKIE) return REJ();
      wx.request({
        url: 'https://www.ityudao.com/settings',
        header: {
          'Cookie': this.COOKIE
        },
        success: ret => {
          var { data } = ret;
          if (ret.statusCode === 403) return REJ();
          try {
            // 用户名
            var userName = data.split('module-header fn-clear">')[1].split('target="_blank">')[1].split('</')[0];
            // 头像
            var avatarUrl = data.split('avatar-small" style="background-image:url(\'')[1].split('?')[0];
            // 用户主页
            var homePage = data.split('nofollow" href="')[1].split('"')[0];
            this.USER_NAME = userName;
            this.AVATAR_URL = avatarUrl;
            this.HOME_PAGE = homePage;
            // 获取头像base64)
            return RES({
              userName,
              avatarUrl,
              homePage,
            });
          } catch(e) {
            return REJ(e)
          }
        }
      })
    })
  }

  /**
   * 加载日记列表
   */
  loadDiary (page = 1) {
    return new Promise((RES, REJ) => {
      wx.request({
        url: 'https://www.ityudao.com/diary?p='+page,
        header: {
          'Cookie': this.COOKIE
        },
        success: ret => {
          if (ret.statusCode === 403) return this.gotoLogin();
          var { data } = ret;
          // 解析数据
          try {
            var temp_array = data.split('<div class="fn-flex">');
            temp_array.shift();
            var result = [];

            temp_array.map(function (tmp) {
              result.push({
                avatar: tmp.split('style="background-image:url(\'')[1].split('?')[0],
                title: tmp.split('rel="bookmark" ')[1].split('</')[0].split('>')[1].trim().replace(/\n/g, ' '),
                link: tmp.split('rel="bookmark" href="')[1].split('"')[0],
                date: tmp.split('ft-smaller ft-fade">')[1].split('</')[0].trim(),
                // count: tmp.split('count ft-gray">')[1].split('<')[0]
              })
            });

            return RES(result);
          } catch (e) {
            return REJ(e);
          }
        }
      })
    })
  }

  /**
   * 获取日记详情
   */
  getDetail (link) {
    return new Promise((RES, REJ) => {
      wx.request({
        url: link,
        header: {
          'Cookie': this.COOKIE
        },
        success: ret => {
          if (ret.statusCode === 403) return this.gotoLogin();
          var { data } = ret;
          try {
            // 解析标题
            var title = data.split('ft-a-title">')[1].split('</')[0];
            // 解析头像
            var avatar = data.split('avatar" style="background-image:url(\'')[1].split('?')[0];
            // 用户名
            var userName = data.split("<strong>")[1].split("</")[0];
            // 喜欢
            var likeNum = data.split('article-level')[1].split('>')[1].split('</')[0].trim();
            // 浏览
            var viewNum = data.split('article-level')[2].split('>')[1].split('</')[0].trim();
            // 发布时间
            var postDate = data.split('&nbsp;•&nbsp;')[3].split('</')[0].trim();
            // html内容
            var html = data.split('article-content">')[1].split('</div')[0];
            // 是否已点喜欢
            var isLiked = data.includes('has-cnt ft-red');
            return RES({
              info: {
                id: link.split('diary/')[1],
                title, avatar, userName, likeNum, viewNum, postDate,
                isLiked
              },
              html
            });
          } catch (e) {
            return REJ(e);
          }
        }
      })
    })
  }

  /**
   * 添加日记
   * opt={title,content,tag,permission}
   */
  addDairy (opt) {
    return new Promise((RES, REJ) => {
      // 1. 获取csrftoken
      wx.request({
        url: 'https://www.ityudao.com/diary/add/show',
        header: {
          'Cookie': this.COOKIE
        },
        success: ret => {
          if (ret.statusCode === 403) return this.gotoLogin();
          try {
            var token = ret.data.split("AddDiary.add('")[1].split("'")[0];
            // 开始提交
            wx.request({
              url: 'https://www.ityudao.com/diary',
              header: {
                'Cookie': this.COOKIE,
                'csrftoken': token,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authority': 'www.ityudao.com',
              },
              method: 'POST',
              data: JSON.stringify({
                'diaryTitle': opt.title,
                'diaryContent': opt.content,
                'diaryTag': opt.tag,
                'diaryPermission': opt.permission
              }),
              success: post_ret => {
                if (post_ret.data.sc === true) return RES();
                return REJ(post_ret.data.msg);
              },
              fail: REJ
            })
          } catch (e) {
            return REJ('获取csrftoken失败');
          }
        },
        fail: REJ
      })
    })
  }

  /**
   * 上传图片
   */
  uploadFile (filePath) {
    return new Promise((RES, REJ) => {
      // 获取token
      wx.request({
        url: 'https://www.ityudao.com/post?type=0',
        header: {
          'Cookie': this.COOKIE
        },
        success: ret => {
          var token = ret.data.split("qiniuUploadToken = '")[1].split("'")[0];
          // 随机文件名
          var fileName = filePath.split('//')[1];
          // 开始上传
          wx.uploadFile({
            url: 'https://up.qbox.me',
            filePath,
            name: 'file',
            formData: {
              token,
              key: fileName
            },
            success: upload_ret => {
              var data = JSON.parse(upload_ret.data);
              return RES('https://img.ityudao.com/' + data.key);
            },
            fail: REJ
          })
        },
        fail: REJ
      })
    })
  }

  /**
   * 获取我的日记列表
   */
  getMyDairy () {
    return new Promise((RES, REJ) => {
      wx.request({
        url: this.HOME_PAGE + '/diarys',
        header: {
          'Cookie': this.COOKIE
        },
        success: ret => {
          if (ret.statusCode === 403) return this.gotoLogin();
          var { data } = ret;
          try {
            var temp_array = data.split('class="has-view">');
            temp_array.shift();
            var result = [];
            temp_array.map(function (tmp) {
              result.push({
                link: tmp.split('bookmark" href="')[1].split('"')[0],
                title: tmp.split('bookmark" href="')[1].split('">')[1].split('</')[0],
                postDate: tmp.split('con-date"></span>')[1].split('</')[0].trim(),
                tag: tmp.split('tag">')[1].split('</')[0].trim(),
                view: tmp.split('tag">')[2].split('\n')[1].trim(),
                permission: tmp.split('tag">')[3].split('</')[0]
              })
            });
            return RES(result);
          } catch(e) {
            REJ(e);
          }
        },
        fail: REJ
      })
    })
  }

  /**
   * 登陆过期，重新登陆
   */
  gotoLogin () {
    // 清除缓存
    wx.removeStorageSync('USER_COOKIE');
    wx.removeStorageSync('USER_COOKIE');
    this.COOKIE = '';
    this.TOKEN = '';
    wx.reLaunch({
      url: '/pages/init/loading?msg=expired',
    })
  }

  /**
   * 注销操作
   */
  logout () {
    return new Promise((RES, REJ) => {
      this.COOKIE = '';
      this.TOKEN = '';
      wx.clearStorageSync();
      wx.request({
        url: 'https://www.ityudao.com/logout',
        header: {
          'Cookie': this.COOKIE
        },
        success: RES,
        fail: RES
      })
    })
  }

  /**
   * 检查是否已经签到
   */
  isCheckIn () {
    return new Promise((RES, REJ) => {
      wx.request({
        url: 'https://www.ityudao.com/activity/checkin',
        header: {
          'Cookie': this.COOKIE
        },
        success: ret => {
          if (ret.statusCode === 403) return this.gotoLogin();
          var { data } = ret;
          if (data.split('<title>')[1][0] === '积') return RES();
          // 获取签到token
          this.CHECKIN_TOKEN = data.split("Activity.checkin('")[1].split("'")[0];
          return REJ();
        }
      })
    })
  }

  /**
   * 开始签到
   */
  checkIn () {
    return new Promise((RES, REJ) => {
      wx.request({
        url: 'https://www.ityudao.com/activity/daily-checkin',
        method: 'POST',
        header: {
          'Cookie': this.COOKIE,
          'csrftoken': this.CHECKIN_TOKEN
        },
        success: ret => {
          if (ret.data.sc) return RES();
          REJ(ret);
        }
      })
    })
  }

  /**
   * 设置喜欢/取消喜欢
   * id=日记id
   */
  setLike (id) {
    return new Promise((RES, REJ) => {
      wx.request({
        url: 'https://www.ityudao.com/vote/up/diary',
        method: 'POST',
        header: {
          'Cookie': this.COOKIE
        },
        data: JSON.stringify({
          'dataId': id
        }),
        success: ret => {
          if (ret.data.sc) return RES();
          REJ();
        }
      })
    })
  }
}

module.exports = new API();