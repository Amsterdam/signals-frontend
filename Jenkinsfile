#!groovy
def tryStep(String message, Closure block, Closure tearDown = null) {
    try {
        block()
    }
    catch (Throwable t) {
        slackSend message: "${env.JOB_NAME}: ${message} failure ${env.BUILD_URL}", channel: '#ci-channel', color: 'danger'
        throw t
    }
    finally {
        if (tearDown) {
            tearDown()
        }
    }
}

String BRANCH = "${env.BRANCH_NAME}"
Boolean IS_SEMVER_TAG = BRANCH ==~ /v(\d{1,3}\.){2}\d{1,3}/

node('BS16 || BS17') {
    stage("Checkout") {
        def scmVars = checkout(scm)
        env.COMPOSE_DOCKER_CLI_BUILD = 1
    }

    if (BRANCH == "develop" || IS_SEMVER_TAG) {
        stage("Build and push image") {
            tryStep "build", {
                docker.withRegistry("${DOCKER_REGISTRY_HOST}",'docker_registry_auth') {
                    def cachedImage = docker.image("ois/signalsfrontend:latest")

                    if (cachedImage) {
                        cachedImage.pull()
                    }

                    def buildParams = "--shm-size 1G " +
                        "--build-arg BUILD_NUMBER=${env.BUILD_NUMBER} " +
                        "--build-arg GIT_BRANCH=${BRANCH} " +
                        "."

                    def image = docker.build("ois/signalsfrontend:${env.BUILD_NUMBER}", buildParams)
                    image.push()
                    image.push("latest")
                }
            }
        }
    }

    if (BRANCH == "develop") {
        stage("Deploy Amsterdam ACC") {
            tryStep "deployment", {
                build job: '/SIA_Signalen_Amsterdam/signals-amsterdam/develop'
            }
        }

        stage("Deploy Weesp ACC") {
            tryStep "deployment", {
                build job: '/SIA_Signalen_Amsterdam/signals-weesp/develop'
            }
        }
    }

    if (IS_SEMVER_TAG) {
        stage("Deploy Amsterdam PROD") {
            tryStep "deployment", {
                build job: '/SIA_Signalen_Amsterdam/signals-amsterdam/master'
            }
        }

        stage("Deploy Weesp PROD") {
            tryStep "deployment", {
                build job: '/SIA_Signalen_Amsterdam/signals-weesp/master'
            }
        }
    }
}
