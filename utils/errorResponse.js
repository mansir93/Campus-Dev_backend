class errorResponse extends Error {
  constructor(massage) {
    super(massage);
    this.codeStatus = this.codeStatus;
  }
}
module.exports = errorResponse;
