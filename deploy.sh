rm -rf dist

npm run build

cd dist

echo 'mtsp.yinode.tech' > CNAME

git init
git add -A
git commit -m "deploy"

git push -f git@github.com:zhangzhengyi12/mtsp-with-js.git master:gh-pages