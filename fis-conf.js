/**
 * Created by chonglu.wang on 2017/3/15.
 */
/*设置忽略文件*/
fis.set('project.ignore',
  [
    "doc/**",
    "\..*",
    "dist/**",
    "node_modules/**",
    '.git/**',
    "README.md",
    "package.json",
    "npm-debug.log",
    'fis-conf*.js'
  ]);

fis.hook('relative');
fis.match('**', {
  relative: true
})

fis.media("prod")
.match('**.js', {
  optimizer: fis.plugin('uglify-js', {
    drop_console: true
  })
})
.match('**.css', {
  optimizer: fis.plugin('clean-css')
})
.match('*.{js,css}', {
  useHash: true
});