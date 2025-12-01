Param(
  [string]$MongoContainerName = "stapl-mongo",
  [string]$MongoPort = "27017"
)

Write-Host "Setting up Stapl backend environment" -ForegroundColor Cyan

if (-Not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Error "Docker is required. Install Docker Desktop and rerun."
  exit 1
}

Write-Host "Starting MongoDB container..."
docker rm -f $MongoContainerName 2>$null | Out-Null
docker run -d --name $MongoContainerName -p ${MongoPort}:27017 mongo:7 > $null

Write-Host "Installing server dependencies..."
pushd server
npm install

if (-Not (Test-Path ".env")) {
  "MONGO_URI=mongodb://127.0.0.1:${MongoPort}/stapl" | Out-File -Encoding utf8 .env
  "JWT_SECRET=$(New-Guid)" | Add-Content .env
}

Write-Host "Seeding demo data..."
node .\scripts\seed.js

Write-Host "Server ready. Start with: npm start" -ForegroundColor Green
popd

Write-Host "Client setup (optional)..."
pushd client
npm install
if (-Not (Test-Path ".env")) {
  "VITE_SERVER_URL=http://127.0.0.1:5000" | Out-File -Encoding utf8 .env
}
Write-Host "Client ready. Start with: npm run dev" -ForegroundColor Green
popd
