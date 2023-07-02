@echo off
cd /d “D:\Github-Project\my-own-website”

git init
git add --all
git commit -m "Update content"
git push origin main

exit