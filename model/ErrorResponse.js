class ErrorResponse {
  constructor(code, message, success = false) {
    this.code = code;
    this.message = message;
    this.success = success;
  }
}

module.exports = ErrorResponse;
