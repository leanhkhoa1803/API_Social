exports.transMail = {
  subject: "API mạng xã hội : Xác nhận kích hoạt tài khoản",
  templates: (linkVerify) => {
    return `<h2>Bạn đã nhận được email này khi đăng kí ứng dụng Mạng Xã Hội</h2>
      <h3>Vui lòng click vào link bên dưới để xác nhận tài khoản</h3>
      <h3><a href="${linkVerify}" target = "blank">${linkVerify}</a></h3>
      `;
  },
  sendMailFailed:
    "Đã có lỗi khi gửi email, Vui lòng liên hệ với bộ phận hỗ trợ",
  token_isActived:
    "Tài khoản này đã được kích hoạt, Vui lòng không click vào link liên kết nữa",
};

exports.transSuccess = {
  useCreatedSuccess:
    "Tài khoản đã tạo thành công, Vui lòng kiểm tra email để kích hoạt tài khoản",
  account_isActived: "Tài khoản đã được kích hoạt",
  login_success(username) {
    return `Xin chào ${username} đến với Mạng Xã Hội`;
  },
  logout_success: "Đăng xuất tài khoản thành công",
};

exports.transErrors = {
  login_failed: "Sai taì khoản hoặc mật khẩu",
  error_server: "Đã xảy ra lỗi ở server ,",
};
