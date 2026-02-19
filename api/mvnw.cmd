@REM Maven Wrapper Script (Windows)
@ECHO OFF
SET MAVEN_WRAPPER_JAR=.mvn\wrapper\maven-wrapper.jar
SET MAVEN_WRAPPER_PROPERTIES=.mvn\wrapper\maven-wrapper.properties

IF NOT EXIST "%MAVEN_WRAPPER_JAR%" (
    ECHO Downloading Maven Wrapper...
    mvn -N io.takari:maven:wrapper
)

java -jar "%MAVEN_WRAPPER_JAR%" %*
