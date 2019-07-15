##
## Create a release package from the publish files
##

$SDKPackageFilePath = "package.json";
$DebuggerPackageFilePath = "ccc_debugger/package.json";

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Unrestricted -Force

if ($PSVersionTable.PSVersion.Major -lt 3)
{
    throw [System.IO.FileNotFoundException] "You need Powershell version 3 or higher to run this script"
}

# Load dependencies
[Reflection.Assembly]::LoadWithPartialName("System.IO.Compression.FileSystem")

function Zip
{
    param([string]$sourceDirectoryName, [string]$destinationArchiveFileName)  
    Write-Host "Zip:"
    Write-Host "sourceDirectoryName=$sourceDirectoryName"
    Write-Host "destinationArchiveFileName=$destinationArchiveFileName"

    [System.IO.Compression.ZipFile]::CreateFromDirectory($sourceDirectoryName, $destinationArchiveFileName)
}

function CreateFolder
{
    param([string]$destPath)  
    Write-Host "CreateFolder:"
    Write-Host "destPath=$destPath"

    New-Item -ItemType directory -Path $destPath
}

function GetVersionFromPackage
{
    param([string]$packageFilePath)
    
    # Read the base version from the version file and push it to the final result
    if( Test-Path $packageFilePath ) {
    
        $package = (Get-Content $packageFilePath | Out-String | ConvertFrom-Json);

        return $package.version;

    } else {
        Write-Error "Version file not found!";
        Exit 1;
    }
     
}

$SDKVersion = GetVersionFromPackage -packageFilePath $SDKPackageFilePath
$DebuggerPackageVersion = GetVersionFromPackage -packageFilePath $DebuggerPackageFilePath
$DebuggerVersion = $SDKVersion + "-cd" + $DebuggerPackageVersion;

# Create the scaffold of the 
if (Test-Path ".\Publish")
{
    Remove-Item -Path .\Publish -Recurse -Force -ErrorAction SilentlyContinue
}

CreateFolder ".\Publish\Unpacked"
CreateFolder ".\Publish\Zip"

Copy-Item -Path ".\ccc_debugger\*" -Recurse -Destination ".\Publish\Unpacked"

# Create src build
$currentPath = $(Get-Location);
$zipSrcSource = "$currentPath\Publish\Unpacked\"
$zipSrcDestinationFile = "$currentPath\Publish\Zip\ccc_debugger-$DebuggerVersion.zip"
Zip $zipSrcSource $zipSrcDestinationFile 

# Stop! Hammertime...
Write-Host " "
Write-Host "Done diddly done."
Write-Host " "
Stop-Transcript