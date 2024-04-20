// create and send tokena nd also save in cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();
  //  opitons for the coookie

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
module.exports = sendToken;
