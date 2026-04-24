module.exports = {
  apps: [
    {
      name: 'rsh.pw',
      script: './dist/server/entry.mjs',
      env: {
        PORT: 4321,
        HOST: '127.0.0.1',
        NODE_ENV: 'production'
      }
    }
  ]
};
