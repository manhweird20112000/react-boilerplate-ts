@echo off
setlocal EnableExtensions

set "ROOT_DIR=%~dp0.."
set "ENV_FILE=%ROOT_DIR%\.env.docker"
set "COMPOSE_FILE=%ROOT_DIR%\docker-compose.yml"
set "SERVICE_NAME=web"
set "COMMAND=%~1"

if "%COMMAND%"=="" set "COMMAND=deploy"

if /I "%COMMAND%"=="help" goto :usage
if /I "%COMMAND%"=="-h" goto :usage
if /I "%COMMAND%"=="--help" goto :usage
if /I "%COMMAND%"=="deploy" goto :deploy
if /I "%COMMAND%"=="up" goto :deploy
if /I "%COMMAND%"=="down" goto :down
if /I "%COMMAND%"=="stop" goto :down
if /I "%COMMAND%"=="restart" goto :restart
if /I "%COMMAND%"=="logs" goto :logs
if /I "%COMMAND%"=="status" goto :status
if /I "%COMMAND%"=="pull" goto :pull

echo Unknown command: %COMMAND%
goto :usage

:ensure_env
if exist "%ENV_FILE%" exit /b 0
copy /Y "%ROOT_DIR%\.env.docker.example" "%ENV_FILE%" >nul
echo Created %ENV_FILE% from .env.docker.example
echo Edit %ENV_FILE% before production deploy.
exit /b 0

:deploy
call :ensure_env
pushd "%ROOT_DIR%"
docker compose --env-file "%ENV_FILE%" -f "%COMPOSE_FILE%" up -d --build --remove-orphans
if errorlevel 1 goto :fail
call :wait_healthy
popd
exit /b 0

:down
call :ensure_env
pushd "%ROOT_DIR%"
docker compose --env-file "%ENV_FILE%" -f "%COMPOSE_FILE%" down --remove-orphans
popd
echo Stopped.
exit /b 0

:restart
call :down
call :deploy
exit /b %ERRORLEVEL%

:logs
call :ensure_env
pushd "%ROOT_DIR%"
docker compose --env-file "%ENV_FILE%" -f "%COMPOSE_FILE%" logs -f %SERVICE_NAME%
popd
exit /b 0

:status
call :ensure_env
pushd "%ROOT_DIR%"
docker compose --env-file "%ENV_FILE%" -f "%COMPOSE_FILE%" ps
popd
exit /b 0

:pull
if "%DOCKER_IMAGE%"=="" (
  echo Set DOCKER_IMAGE, e.g. set DOCKER_IMAGE=ghcr.io/owner/repo:latest
  exit /b 1
)
call :ensure_env
pushd "%ROOT_DIR%"
docker pull %DOCKER_IMAGE%
docker compose --env-file "%ENV_FILE%" -f "%COMPOSE_FILE%" up -d --no-build
if errorlevel 1 goto :fail
call :wait_healthy
popd
exit /b 0

:wait_healthy
set "APP_PORT=8080"
for /f "usebackq tokens=1,* delims==" %%A in (`findstr /R /C:"^APP_PORT=" "%ENV_FILE%"`) do set "APP_PORT=%%B"
set "APP_PORT=%APP_PORT:"=%"
echo Waiting for app at http://127.0.0.1:%APP_PORT% ...
for /L %%I in (1,1,30) do (
  curl -fsS "http://127.0.0.1:%APP_PORT%/" >nul 2>&1
  if not errorlevel 1 (
    echo Deploy OK: http://127.0.0.1:%APP_PORT%
    exit /b 0
  )
  timeout /t 2 /nobreak >nul
)
echo Container started but health check timed out.
exit /b 1

:usage
echo Usage: scripts\docker-deploy.bat [command]
echo.
echo Commands:
echo   deploy   Build image and start container (default)
echo   up       Alias for deploy
echo   down     Stop and remove containers
echo   restart  Restart containers (rebuild)
echo   logs     Follow container logs
echo   status   Show container status
echo   pull     Pull image from registry (set DOCKER_IMAGE)
exit /b 0

:fail
popd 2>nul
exit /b 1
