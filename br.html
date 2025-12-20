#-*- coding:utf-8 -*-
from selenium import webdriver
import re
import requests

pages=input("input page:")
pages=int(pages)+1
doc=open('download link.txt','w')
driver = webdriver.Chrome()   
  # 打开 Chrome 浏览器
driver.get("https://ftopx.com/tags/emily+bloom/")

def getphoto():
        html = driver.page_source  
        pattern=re.compile('"https://ftopx.com/mini/(\d+)/(.*?)"',re.S)
        items=re.findall(pattern,html)
#print(items)
        for item in items: 
                photo_url='https://ftopx.com/images/' + str(item[0]) + '/ftop.ru_' + str(item[1])
                print(photo_url)
                print(photo_url,file=doc)
# print(html)

#getphoto()
for i in range(11,pages):
        webpage="https://ftopx.com/tags/emily+bloom/page/"+str(i)+"/"
        driver.get(webpage)
        getphoto()
doc.close()
driver.close()