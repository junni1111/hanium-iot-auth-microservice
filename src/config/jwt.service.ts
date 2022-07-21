export const jwtConfigs = {
  secret: process.env.JWT_SECRET,
  expiresIn: `30m`,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: `14d`,
};
