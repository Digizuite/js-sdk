package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2018_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'Build'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("Build")) {
    check(artifactRules == "") {
        "Unexpected option value: artifactRules = $artifactRules"
    }
    artifactRules = "+:dist/**"

    expectSteps {
        step {
            name = "Pull dependencies"
            type = "jonnyzzz.npm"
            param("npm_commands", "ci")
        }
        step {
            name = "Karma Runner"
            type = "jonnyzzz.npm"
            param("npm_commands", "run test")
        }
    }
    steps {
        insert(2) {
            step {
                type = "jonnyzzz.npm"
                param("npm_commands", "run dist")
            }
        }
    }

    triggers {
        val trigger1 = find<VcsTrigger> {
            vcs {
                triggerRules = """
                    -:package.json
                    -:comment=Update to \d+.\d+.\d+:**
                """.trimIndent()
            }
        }
        trigger1.apply {
            triggerRules = """
                -:package.json
                -:comment=Update to \d+.\d+.\d+:**
                -:comment=TeamCity change:**
            """.trimIndent()
        }
    }
}
