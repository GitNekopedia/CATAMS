param(
    [string]$DockerUser = "dockernekopedia",
    [string]$ProjectName = "catams",
    [string]$Tag = (Get-Date -Format "yyyyMMddHHmm"),
    [string]$Proxy = $env:DEPLOY_PROXY,
    [string]$BuildProxy = $env:DEPLOY_BUILD_PROXY
)

$ErrorActionPreference = "Stop"

function Invoke-Native {
    param(
        [Parameter(Mandatory = $true)][string]$FilePath,
        [Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments
    )

    & $FilePath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code ${LASTEXITCODE}: $FilePath $($Arguments -join ' ')"
    }
}

if ($Proxy) {
    $env:HTTP_PROXY = $Proxy
    $env:HTTPS_PROXY = $Proxy
    $env:http_proxy = $Proxy
    $env:https_proxy = $Proxy
}

if (-not $BuildProxy) {
    $BuildProxy = $Proxy
}

$BuildArgs = @()
if ($BuildProxy) {
    $BuildArgs += @("--build-arg", "HTTP_PROXY=$BuildProxy")
    $BuildArgs += @("--build-arg", "HTTPS_PROXY=$BuildProxy")
    $BuildArgs += @("--build-arg", "http_proxy=$BuildProxy")
    $BuildArgs += @("--build-arg", "https_proxy=$BuildProxy")
}

Write-Host "Current image version: $Tag"

Write-Host "Building backend package..."
Push-Location backend
try {
    Invoke-Native "mvn.cmd" "clean" "package" "-DskipTests"
}
finally {
    Pop-Location
}

Write-Host "Building backend image..."
Invoke-Native "docker" @BuildArgs "build" "-t" "$DockerUser/$ProjectName-backend:$Tag" "./backend"
Invoke-Native "docker" "tag" "$DockerUser/$ProjectName-backend:$Tag" "$DockerUser/$ProjectName-backend:latest"

Write-Host "Building frontend image..."
Invoke-Native "docker" @BuildArgs "build" "-t" "$DockerUser/$ProjectName-frontend:$Tag" "./frontend"
Invoke-Native "docker" "tag" "$DockerUser/$ProjectName-frontend:$Tag" "$DockerUser/$ProjectName-frontend:latest"

Write-Host "Pushing images to Docker Hub..."
$env:DOCKER_CONTENT_TRUST = "0"
Invoke-Native "docker" "push" "$DockerUser/$ProjectName-backend:$Tag"
Invoke-Native "docker" "push" "$DockerUser/$ProjectName-frontend:$Tag"
Invoke-Native "docker" "push" "$DockerUser/$ProjectName-backend:latest"
Invoke-Native "docker" "push" "$DockerUser/$ProjectName-frontend:latest"

Write-Host "Done. Pushed version: $Tag"
Write-Host "Next, update the server with: docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d"