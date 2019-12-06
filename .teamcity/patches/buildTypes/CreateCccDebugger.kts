package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.BuildType
import jetbrains.buildServer.configs.kotlin.v2018_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, create a buildType with id = 'CreateCccDebugger'
in the root project, and delete the patch script.
*/
create(DslContext.projectId, BuildType({
    id("CreateCccDebugger")
    name = "Create CCC Debugger"

    artifactRules = "ccc_debugger/**/* => ccc_debugger.zip"

    vcs {
        root(DslContext.settingsRoot)

        cleanCheckout = true
    }

    steps {
        step {
            name = "NPM Install Deps"
            type = "jonnyzzz.npm"
            param("teamcity.build.workingDir", "ccc_debugger")
            param("npm_commands", "ci")
        }
        step {
            type = "GenerateVersion2"
            param("versionFilePath", """.\package.json""")
        }
    }
}))

