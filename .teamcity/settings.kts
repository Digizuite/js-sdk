import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.vcs

/*
The settings script is an entry point for defining a TeamCity
project hierarchy. The script should contain a single call to the
project() function with a Project instance or an init function as
an argument.

VcsRoots, BuildTypes, Templates, and subprojects can be
registered inside the project using the vcsRoot(), buildType(),
template(), and subProject() methods respectively.

To debug settings scripts in command-line, run the

    mvnDebug org.jetbrains.teamcity:teamcity-configs-maven-plugin:generate

command and attach your debugger to the port 8000.

To debug in IntelliJ Idea, open the 'Maven Projects' tool window (View
-> Tool Windows -> Maven Projects), find the generate task node
(Plugins -> teamcity-configs -> teamcity-configs:generate), the
'Debug' option is available in the context menu for the task.
*/

version = "2019.1"

project {
    description = "The javascript SDK"

    buildType(PublishToNpm)
    buildType(Build)

    params {
        select("versionLevel", "patch", label = "Version bumb", description = "How much the build should be bumped version wise",
                options = listOf("major", "minor", "patch", "from-git"))
        param("versionTag", "latest")
    }
}

object Build : BuildType({
    name = "Build"
    description = "Builds the SDK"

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
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

    triggers {
        vcs {
            triggerRules = """
                -:package.json
                -:comment=Update to \d+.\d+.\d+:**
            """.trimIndent()
        }
    }
})

object PublishToNpm : BuildType({
    name = "Publish to npm"
    description = "Publishes the sdk to npm"

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
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

    triggers {
        vcs {
            triggerRules = """
                -:package.json
                -:comment=Update to \d+.\d+.\d+:**
            """.trimIndent()
            branchFilter = "+:refs/heads/master"
        }
    }

    dependencies {
        snapshot(Build) {
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
    }
})
