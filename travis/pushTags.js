require('shelljs/global');
var version = 'v' + require('../package.json').version;
exec('git tag -a' + version  + '-m "Release' + version + '";');
exec('git push --quiet --tags;');