package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.BuildStep
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2018_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'PublishToNpm'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("PublishToNpm")) {
    expectSteps {
        step {
            type = "jonnyzzz.npm"
            param("npm_commands", "ci")
        }
        step {
            name = "Create new NPM version"
            type = "jonnyzzz.npm"
            param("npm_commands", """version %versionLevel% -m "Update to %s"""")
        }
        step {
            name = "Publish to npm"
            type = "jonnyzzz.npm"
            param("npm_commands", "publish --tag %versionTag%")
        }
    }
    steps {
        update<BuildStep>(1) {
            param("npm_commands", """version %versionLevel% -m "[NPM] Update to %s"""")
        }
    }

    triggers {
        remove {
            vcs {
                triggerRules = """
                    -:package.json
                    -:comment=Update to \d+.\d+.\d+:**
                """.trimIndent()
                branchFilter = "+:refs/heads/master"
            }
        }
        add {
            finishBuildTrigger {
                buildType = "JsSdk_Build"
                successfulOnly = true
            }
        }
    }
}
