#!/usr/bin/env bash
killTomcat() {
  #  pid = `ps -ef | grep tomcat | grep java |awk '{print $2}'`
  pid = $(jps -l | grep tencent.jar | awk '{print $1}')
  echo "jar的pid为 : $pid"
  if [ "$pid" = "" ]; then
    echo "没有启动jar"
  else
    kill -9 $pid
  fi
}
# 在Jenkins中设置的从github上检索下来的源代码直接放入这个目录
cd $PROJECT_PATH/tencent
mvn clean install
# 调用killTomcat函数杀死正在运行的tomcat
killTomcat

#删除之前版本
#rm -fr $TOMCAT_APP_PATH/wabapps/ROOT
#rm -f $TOMCAT_APP_PATH/wabapps/ROOT.war
#rm -f $TOMCAT_APP_PATH/wabapps/xxx.war

rm -fr $PROJECT_START_POS/tencent.jar

#cp $PROJECT_PATH/xxx/target/xxx.war $TOMCAT_PROJECT_PATH/webapps/
#cd $TOMCAT_APP_PATH/webapps/
#mv xxx.war ROOT.war
#cd $TOMCAT_APP_PATH/
#sh bin/startup.sh

# 把源码编译后的jar复制到要运行的目录里面
cp $PROJECT_PATH/tencent/target/tencent.jar $PROJECT_START_POS/

cd $PROJECT_START_POS/
java -jar tencent.jar &>out.log &
