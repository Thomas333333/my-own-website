
使用python的JPype包

```python 
import jpype

from jpype import JClass, startJVM, getDefaultJVMPath, shutdownJVM

import time

import os


libjar = ":".join(["lib/"+jar for jar in os.listdir("lib")])

# 启动JVM并指定JAR包路径

startJVM(getDefaultJVMPath(), "-ea", "-Djava.class.path=openapi-java-client-2.0.0-RC4.jar:"+libjar)

...

```

参考： https://www.cnblogs.com/kaibindirver/p/11768977.html 